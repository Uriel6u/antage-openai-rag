import fs from "fs";
import crypto from "crypto";
const pdf = require("pdf-parse");
import { OpenAI } from "openai";

export class PDFEmbedder {
  private openai: any;

  constructor() {
    this.openai = new OpenAI();
  }

  // Function to read PDF and extract text
  private async extractTextFromPDF(pdfFilePath: string): Promise<string> {
    const dataBuffer = fs.readFileSync(pdfFilePath);
    const data = await pdf(dataBuffer);
    return data.text;
  }

  // Function to compute a hash of the file contents
  private computeFileHash(filePath: string): string {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash("sha256");
    hashSum.update(fileBuffer);
    return hashSum.digest("hex");
  }

  // Function that checks if the PDF has changed before embedding
  public async generateAndSaveEmbeddingIfChanged(
    pdfFilePath: string,
  ): Promise<void> {
    const currentHash = this.computeFileHash(pdfFilePath);
    const outputFilePath = pdfFilePath.replace(/\.pdf$/i, ".json");
    const metadataFilePath = `${outputFilePath}.meta`;

    // Check if metadata exists and if the hash matches
    if (fs.existsSync(metadataFilePath)) {
      const { hash } = JSON.parse(fs.readFileSync(metadataFilePath, "utf8"));
      if (hash === currentHash) {
        console.log(
          "PDF has not changed since last embedding. Skipping embedding process.",
        );
        return; // Exit the function if the PDF has not changed
      }
    }

    // PDF has changed or this is the first time, proceed with embedding
    const text = await this.extractTextFromPDF(pdfFilePath);
    const response = await this.openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text.substring(0, 7000),
    });
    console.log(response);

    const embeddings = response.data[0].embedding;

    // Save embeddings and the current hash to file
    fs.writeFileSync(outputFilePath, JSON.stringify(embeddings));
    fs.writeFileSync(metadataFilePath, JSON.stringify({ hash: currentHash }));

    console.log(`Embeddings saved to ${outputFilePath}`);
  }
}

/*
// Example usage
(async () => {
  const pdfEmbedder = new PDFEmbedder();
  const pdfFilePath = 'data/data_2024.pdf';
  const outputFilePath = 'data/data_2024.json';
  await pdfEmbedder.generateAndSaveEmbeddingIfChanged(pdfFilePath);
})().catch(console.error);
*/
