import { OpenAI } from "openai";
import fs from "fs";

export class OpenAIFileUploader {
  private openai: any;

  constructor() {
    this.openai = new OpenAI();
  }

  async uploadFileIfNeeded(filePath: string): Promise<string> {
    const fileName = filePath.split("/").pop() || ""; // Extract the file name from the path
    let allFiles = await this.openai.files.list();

    let fileFound = false;
    let fileId: string | undefined;

    for (let file of allFiles.data) {
      if (file.filename === fileName) {
        console.log("File Exists:", fileName);
        fileId = file.id;
        fileFound = true;
        break;
      }
    }

    if (!fileFound) {
      console.log("Uploading file:", fileName);
      let file = await this.openai.files.create({
        file: fs.createReadStream(filePath),
        purpose: "assistants",
      });
      fileId = file.id;
    }

    return fileId!;
  }
}

//export default OpenAIFileUploader;
