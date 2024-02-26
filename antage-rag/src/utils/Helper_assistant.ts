import { OpenAI } from 'openai';
//https://community.openai.com/t/assistant-sometimes-reply-with-files-youve-uploaded-are-not-accessible-with-the-myfiles-browser-tool/503951/9
export class Helper {
    private openai: any;

    private assistantId: string;

    constructor(assistantId: string) {
        this.openai = new OpenAI();
        this.assistantId = assistantId;
    }

    async sendMessageAndGetReply(content: any, fileIds: string[]): Promise<string> {
        const thread = await this.openai.beta.threads.create();
        await this.openai.beta.threads.messages.create(thread.id, 
            
            {

            role: "user",
            content: content+ "Please look into the uploaded files for my answers. Please also cite the filename. Reply in Json format {reply: Your reply} {cite: The source file name}",
            file_ids: fileIds,
        });

        var run = await this.openai.beta.threads.runs.create(
            thread.id, 
            {
            assistant_id: this.assistantId,
        });

        let checkStat = await this.openai.beta.threads.runs.retrieve(thread.id, run.id);
        
        while (checkStat.status !== "completed") {
            if (checkStat.status === "requires_action") {
                break;
            }
            console.log(checkStat.status)
            await this.sleep(1000); // Wait for 2 seconds before checking again
            checkStat = await this.openai.beta.threads.runs.retrieve(thread.id, run.id);
        }

        const messages = await this.openai.beta.threads.messages.list(thread.id);
        const text = messages.data[0].content[0];
        return text.text.value;







    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }




    





}


