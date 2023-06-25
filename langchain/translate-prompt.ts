import {
    PromptTemplate
} from "langchain/prompts";
import { OpenAI } from "langchain/llms/openai";
import 'dotenv/config'


const OPENAI_API_BASE_URL = process.env.OPENAI_API_BASE_URL;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;


const model = new OpenAI({
    openAIApiKey: OPENAI_API_KEY,
    temperature: 0,
    // 测试流式回答，放开以下注释
    streaming: true,
    callbacks: [
        {
            handleLLMNewToken(token: string) {
                process.stdout.write(token);
            }
        },
    ],
}, {
    basePath: OPENAI_API_BASE_URL
});


const main = async () => {
    
    
    // 以下不使用 chain ，直接使用 modal.call 的方式
    const translatePrompt = PromptTemplate.fromTemplate("You are a translation engine that can only translates text from {input_language} to {output_language}.The next text is you should translate. {text}");
    const prompt = await translatePrompt.format({
        input_language: "English",
        output_language: "Chinese",
        text: `LangChain is a framework for developing applications powered by language models. We believe that the most powerful and differentiated applications will not only call out to a language model via an api, but will also:`,
    });

    const res = await model.call(prompt);
};

main();