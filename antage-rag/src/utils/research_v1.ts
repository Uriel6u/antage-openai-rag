import OpenAI from "openai";
import fs from "fs";
import { ChatCompletionTool } from "openai/resources/chat/completions.mjs";
import { isConstructorDeclaration } from "typescript";
const openai = new OpenAI();
import * as fs_p from "fs/promises";
import * as path from "path";
//const { PDFEmbedder } = require('./PDFEmbedder');
import { PDFEmbedder } from "./PDFEmbedder.js";
var pdfEmbedder = new PDFEmbedder();
//var cosinesimilarity = require( 'compute-cosine-similarity' );
import cosinesimilarity from "compute-cosine-similarity";
//const { OpenAIFileUploader } = require('./OpenAIFileUploader');
import { OpenAIFileUploader } from "./OpenAiFileUploader.ts";
var uploader = new OpenAIFileUploader();

//const { Helper } = require('./Helper_assistant');
import { Helper } from "./Helper_assistant.js";
let helper_id = "asst_I5PzvBrqhGgHaPBnXC9nu6yi";
const helper_assistant = new Helper(helper_id);

import path2 from "path";
import { fileURLToPath } from "url";
// Convert the URL to a path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var tools: Array<any> = [
  /*
    {
      type: "function",
      function: {
        name: "get_recent_song",
        description: "Get the top songs of a given year",
        parameters: {
          type: "object",
          properties: {
            year: {
              type: "number",
              description: "The year, e.g. 2024",
            },
            //unit: { type: "string", enum: ["year", "fahrenheit"] },
          },

          required: ["year"],
        },
      },
    },
  */

  {
    type: "function",
    function: {
      name: "retrieve_unknown_question",
      description:
        "Get the answer if question is outside chatgpt training period. Or if additional context is needed from user.",
      parameters: {
        type: "object",
        properties: {
          year: {
            type: "number",
            description: "The year e.g. 2024, 24",
          },
          message: {
            type: "string",
            description: "The entire message content from the user.",
          },
          theme: {
            type: "string",
            description:
              "Give the theme of the question in one word. For a question like 'how many juices in fridge', eg. juice",
          },
          //unit: { type: "string", enum: ["year", "fahrenheit"] },
        },

        required: ["message", "theme"],
      },
    },
  },
];

async function createAssistant() {
  const assistant = await openai.beta.assistants.create({
    name: "Assistant Antage",
    instructions:
      "You are an assistant for question answering. If you find any question outside of your training date, use your knowledge base to find the answer. I am counting on you please.",
    model: "gpt-4-turbo-preview", //gpt-3.5-turbo-1106
    /*
      Model: you can specify any GPT-3.5 or GPT-4 models.
      The Retrieval tool requires at least gpt-3.5-turbo-1106 (newer versions are supported) or
      gpt-4-turbo-preview models.  Note: Support for fine-tuned models in the Assistants API is coming soon
      */
    //tools: [{ "type": "retrieval" }],
  });

  return assistant;
}

async function main() {
  /*
    try {
        const assistant = await createAssistant();
        console.log(assistant);
        // Assuming `assistant` has an `id` property:
        console.log(assistant.id); // Correctly logs `assistant.id` within the `try` block
    } catch (error) {
        console.error(error);
    }
    */
  var assistant_id = "asst_U6fywgDoiOZsVUATZMvcJNTm";
  let assistant = await openai.beta.assistants.retrieve(assistant_id); // Show this to Antage.... Nov 23
  /*
   tools.push({"type": "retrieval"})

   assistant = await openai.beta.assistants.update(
    assistant_id,
    {
      tools: tools,
      tools: [{"type": "retrieval"}]
    }
  );
  */
  //tools.push({"type": "retrieval"})
  assistant = await openai.beta.assistants.update(
    assistant_id,
    {
      tools: tools,
    },
  );

  // Creating a thread.
  const thread = await openai.beta.threads.create();

  // Add message to thread.
  let message = await openai.beta.threads.messages.create(
    thread.id, // in above thread It will append the message. Good for MongoDB.....
    {
      role: "user",
      content: "HOw are you?", // Will come from front end
      //file_ids: ["file-H7Ks0CyOedxk3ykSBmauvgIq"]
    },
  );

  // Tag this message to our created assistant using RUN (Middleware of almost everything)
  let run = await openai.beta.threads.runs.create(
    thread.id,
    {
      assistant_id: assistant.id,
    },
  );

  /*
  const run = await openai.beta.threads.createAndRun({
    assistant_id: assistant.id,
    thread: {
      messages: [
        { role: "user", content: "What is the best song of 2024" },
      ],
    },
  });
  console.log("-----------")
  console.log(run);
  console.log("Getting out the thread Id")
  console.log(run.thread_id);

  console.log("-----------")

  */

  var check_stat = await openai.beta.threads.runs.retrieve(
    thread.id,
    run.id,
  );
  function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  console.log(check_stat); // this shows it is in progress
  while (check_stat.status != "completed") {
    check_stat = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    if (check_stat.status === "requires_action") {
      break;
    }
    await sleep(2000);
    console.log("--");
    console.log(check_stat.status);
    console.log("--");
  }

  let messages = await openai.beta.threads.messages.list(
    thread.id,
  );
  var text: any = messages.data[0].content[0];
  console.log(text.text.value);

  // Going for secong message
  message = await openai.beta.threads.messages.create(
    thread.id, // in above thread It will append the message. Good for MongoDB.....
    {
      role: "user",
      // content: "What is the number of Juices in my fridge?" // Will come from front end
      // content: "How many Juices in my fridge?",
      //content: "Best song of 2024?",

      content: "Who is Adel working for in class?",
      //content: "How many students there in 5700 this semester?"
    },
  );
  run = await openai.beta.threads.runs.create(
    thread.id,
    {
      assistant_id: assistant.id,
    },
  );
  var check_stat = await openai.beta.threads.runs.retrieve(
    thread.id,
    run.id,
  );

  while (check_stat.status != "completed") {
    check_stat = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    if (check_stat.status === "requires_action") {
      break;
    }
    await sleep(2000);
    console.log("--");
    console.log(check_stat.status);
    console.log("--");
  }
  console.log("---- Retrieving to see function calls =====");
  console.log(`---\nThe whole run.retrive = \n`, check_stat);

  messages = await openai.beta.threads.messages.list(
    thread.id,
  );
  console.log("--------------------------");
  text = messages.data[0].content[0];
  console.log(text.text.value);

  console.log(message);

  console.log("---- Check what AI model needs us to do? -----");
  if (check_stat.required_action !== null) {
    var fun_calls = check_stat.required_action.submit_tool_outputs.tool_calls;
    console.log(`---\nThe function calls = \n`, fun_calls);
  } else {
    console.log("Failed to retrieve function calls");
  }

  // Executing the functions found in assistant
  if (check_stat.required_action !== null) {
    if (check_stat.required_action.submit_tool_outputs.tool_calls) {
      const availableFunctions: any = {
        get_recent_song: get_recent_song,
        retrieve_unknown_question: retrieve_unknown_question,
      };
      var fun_calls = check_stat.required_action.submit_tool_outputs.tool_calls;

      let tool_outputs: Array<any> = [];

      for (var calls of fun_calls) {
        const functiontoCall: Function =
          availableFunctions[calls.function.name];
        const functionArg: any = calls.function.arguments; // Because this is an object
        const functionResponse = await functiontoCall(functionArg);
        const call_id = calls.id; // This is not runid, but the call id
        tool_outputs.push({ tool_call_id: call_id, output: functionResponse });
      }
      run = await openai.beta.threads.runs.submitToolOutputs(
        thread.id,
        run.id,
        {
          tool_outputs: tool_outputs,
        },
      );

      // Now lets check again the status of the run
      console.log(
        "--- Checking again the stat of Run after submitting function output ---",
      );
      check_stat = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      while (check_stat.status != "completed") {
        check_stat = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        if (check_stat.status === "requires_action") {
          break;
        }
        await sleep(2000);
        console.log("--");
        console.log(check_stat.status);
        console.log("--");
      }
    }
  }

  messages = await openai.beta.threads.messages.list(
    thread.id,
  );
  console.log("--------------------------");
  text = messages.data[0].content[0];
  console.log(text.text.value);

  console.log(message); //  Good for MongoDB.....

  ///////////////////////////////////////////////////////////////

  function get_recent_song(query: any): any {
    let queryObj = JSON.parse(query);
    if (queryObj.year === 2024) {
      return JSON.stringify({ Song_Name: "Pappa Rappa", Artist: "Uriel" });
    }
  }

  /*
function get_mentor_name(query:any):any  {
  let queryObj = JSON.parse(query)
   if (queryObj.student_name.toLowerCase().includes("adel")) {
    return JSON.stringify({ Mentor_name: "Robert Myers and Andrew Leverette", org: "Antage" });

  }
 }
  */

  async function generateEmbeddingForText(text: any): Promise<number[]> {
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
    });
    return response.data[0].embedding; // Adjust based on the actual response structure
  }

  async function readEmbeddingFromFile(filePath: string): Promise<number[]> {
    const fileContent = await fs_p.readFile(filePath, { encoding: "utf8" });
    return JSON.parse(fileContent);
  }

  async function retrieve_unknown_question(query: any): Promise<any> {
    let queryObj = JSON.parse(query);
    console.log("======= Inside Function ====", queryObj);

    const directoryPath = path.join(__dirname, "../data");
    // const directoryPath =  'data';
    // const yearInQuery = query.year ?? 2024;

    // Step 1 : I will Generate Embedding for the question
    const questionEmbedding = await generateEmbeddingForText(queryObj.message);
    // Step 2: I will check my document repository.
    let files = await fs_p.readdir(directoryPath);
    const pdfFiles = files.filter((file) =>
      path.extname(file).toLowerCase() === ".pdf"
    );
    for (let file of pdfFiles) {
      const filePath = path.join(directoryPath, file);
      await pdfEmbedder.generateAndSaveEmbeddingIfChanged(filePath);
    }
    // Step 3: Find Similarity
    const scores = [];
    files = await fs_p.readdir(directoryPath);
    const jsonFiles = files.filter((file) =>
      path.extname(file).toLowerCase() === ".json"
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

    const reply = await helper_assistant.sendMessageAndGetReply(
      queryObj.message,
      fetched_file_ids,
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
}

main();
