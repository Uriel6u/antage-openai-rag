// Import necessary dependencies
import { NextApiRequest, NextApiResponse } from "next";
import * as fs_p from "fs/promises";
import path from "path";
import OpenAI from "openai";
import fs from "fs";
import { PDFEmbedder } from "../../utils/PDFEmbedder.ts";
import cosinesimilarity from "compute-cosine-similarity";
import { OpenAIFileUploader } from "../../utils/OpenAiFileUploader.ts";
import { Helper } from "../../utils/Helper_assistant.ts";
import ts from "typescript";

const pdfEmbedder = new PDFEmbedder();
const uploader = new OpenAIFileUploader();
// Initialize OpenAI, PDFEmbedder, and other dependencies here
const openAI = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const mainAssistantID = process.env.MAIN_ASSISTANT_ID || "";
const helperAssistantID = process.env.ASSISTANT_HELPER_ID || "";

const helperAssistant = new Helper(helperAssistantID);

async function generateEmbeddingForText(text: string) {
  const response = await openAI.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });
  return response.data[0].embedding; // Adjust based on the actual response structure
}

async function readEmbeddingFromFile(filePath: any) {
  const fileContent = await fs_p.readFile(filePath, { encoding: "utf8" });
  return JSON.parse(fileContent);
}

function get_recent_song(query: string) {
  let queryObj = JSON.parse(query);
  if (queryObj.year === 2024) {
    return JSON.stringify({ Song_Name: "Pappa Rappa", Artist: "Uriel" });
  }
}

async function retrieve_unknown_question(query: any) {
  let queryObj = JSON.parse(query);
  console.log("======= Inside Function ====", queryObj);

  // need to get the directory path to the data folder
  const directoryPath = path.join(process.cwd(), "data");

  // const directoryPath =  'data';
  // const yearInQuery = query.year ?? 2024;
  // Step 1 : I will Generate Embedding for the question
  const questionEmbedding = await generateEmbeddingForText(queryObj.message);
  // Step 2: I will check my document repository.
  let files = await fs_p.readdir(directoryPath);
  const pdfFiles = files.filter(
    (file) => path.extname(file).toLowerCase() === ".pdf"
  );
  for (let file of pdfFiles) {
    const filePath = path.join(directoryPath, file);
    await pdfEmbedder.generateAndSaveEmbeddingIfChanged(filePath);
  }
  // Step 3: Find Similarity
  const scores = [];
  files = await fs_p.readdir(directoryPath);
  const jsonFiles = files.filter(
    (file) => path.extname(file).toLowerCase() === ".json"
  );
  console.log("jsons", jsonFiles);
  for (let file of jsonFiles) {
    const filePath = path.join(directoryPath, file);
    const documentEmbedding = await readEmbeddingFromFile(filePath);
    const similarity = cosinesimilarity(documentEmbedding, questionEmbedding);
    scores.push({ file, similarity });
  }
  // Step 4: Take Top 3 file names
  //scores.sort((a, b) => b.similarity - a.similarity);
  scores.sort((a, b) => {
    return (b.similarity ?? 0) - (a.similarity ?? 0);
  });
  console.log(scores);
  const topThreeFileNames = scores.slice(0, 3).map((item) => item.file);
  console.log(topThreeFileNames);
  // Step 5: Upload the files
  var fetched_file_ids = [];
  for (let file of topThreeFileNames) {
    let pdf_file = file.replace(/\.json$/i, ".pdf");
    const filePath = path.join(directoryPath, pdf_file);
    fetched_file_ids.push(await uploader.uploadFileIfNeeded(filePath));
  }
  console.log(fetched_file_ids);
  // Step6. Find the answer with helper
  const reply = await helperAssistant.sendMessageAndGetReply(
    queryObj.message,
    fetched_file_ids
  );
  console.log(reply);
  const replyMatch = reply.match(/\{reply: ([^\}]+)\}/);
  const citeMatch = reply.match(/\{cite: ([^\}]+)\}/);
  // Extract the reply and cite if they are found
  const reply_message = replyMatch ? replyMatch[1] : "";
  const cite = citeMatch ? citeMatch[1] : "";
  let jsonString = reply.replace(/```json\n?|\n?```/g, "");
  console.log(jsonString);
  // Return a JSON string with the extracted information
  return JSON.stringify({ jsonString });
}

// Handle POST requests to your endpoint
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const mainAssistant = await openAI.beta.assistants.retrieve(mainAssistantID);

  if (req.method === "POST") {
    try {
      // Your existing code goes here
      const thread = await openAI.beta.threads.create();
      // Parse request body if needed
      const requestBody = req.body;
      // Parse request body if needed

      // Extract the message from the request body
      const messageFromUser = requestBody.message;

      let message = await openAI.beta.threads.messages.create(thread.id, {
        role: "user",
        content: messageFromUser,
      });

      let run = await openAI.beta.threads.runs.create(thread.id, {
        assistant_id: mainAssistantID,
      });

      let checkStatus = await openAI.beta.threads.runs.retrieve(
        thread.id,
        run.id
      );
      console.log(checkStatus);

      while (checkStatus.status != "completed") {
        checkStatus = await openAI.beta.threads.runs.retrieve(
          thread.id,
          run.id
        );
        if (checkStatus.status === "requires_action") {
          break;
        }
        console.log("--");
        console.log(checkStatus.status);
        console.log("--");
      }
      let messages = await openAI.beta.threads.messages.list(thread.id);
      var text = messages.data[0].content[0];
      // @ts-ignore
      console.log(messages.data[0].content[0]);
      if (checkStatus.required_action !== null) {
        var fun_calls =
          checkStatus.required_action.submit_tool_outputs.tool_calls;
        console.log(`---\nThe function calls = \n`, fun_calls);
      } else {
        console.log("Failed to retrieve function calls");
      }

      if (checkStatus.required_action !== null) {
        if (checkStatus.required_action.submit_tool_outputs.tool_calls) {
          const availableFunctions = {
            get_recent_song: get_recent_song,
            retrieve_unknown_question: retrieve_unknown_question,
          };
          var fun_calls =
            checkStatus.required_action.submit_tool_outputs.tool_calls;
          let tool_outputs = [];
          for (var calls of fun_calls) {
            // @ts-ignore
            const functiontoCall = availableFunctions[calls.function.name];
            const functionArg = calls.function.arguments; // Because this is an object
            const functionResponse = await functiontoCall(functionArg);
            const call_id = calls.id; // This is not runid, but the call id
            tool_outputs.push({
              tool_call_id: call_id,
              output: functionResponse,
            });
          }
          run = await openAI.beta.threads.runs.submitToolOutputs(
            thread.id,
            run.id,
            {
              tool_outputs: tool_outputs,
            }
          );
          // Now lets check again the status of the run
          console.log(
            "--- Checking again the stat of Run after submitting function output ---"
          );
          checkStatus = await openAI.beta.threads.runs.retrieve(
            thread.id,
            run.id
          );
          while (checkStatus.status != "completed") {
            checkStatus = await openAI.beta.threads.runs.retrieve(
              thread.id,
              run.id
            );
            if (checkStatus.status === "requires_action") {
              break;
            }

            console.log("--");
            console.log(checkStatus.status);
            console.log("--");
          }
        }
      }
      messages = await openAI.beta.threads.messages.list(thread.id);
      console.log("--------------------------");
      text = messages.data[0].content[0];
      // @ts-ignore
      console.log(text.text.value);
      //
      // send this back to the user
      // Send back a success response
      // @ts-ignore
      res.status(200).json({ message: text.text.value });
    } catch (error) {
      console.error(error);
      // Send back an error response
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    // Handle unsupported HTTP methods
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
