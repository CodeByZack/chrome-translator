import { OpenAI } from "langchain/llms/openai";
import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import 'dotenv/config'

const OPENAI_API_BASE_URL = process.env.OPENAI_API_BASE_URL;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/**
 * 
 * ## LLMChain 基本使用
 * 
 * 最简单的链条，将 `open-api model` 和 `PromptTemplate` 链接起来。
 * 
 * 即将 `model` 和 `template` 作为参数传递给 `LLMChain` 。
 * 
 * 
 */

const model = new OpenAI({ 
    openAIApiKey: OPENAI_API_KEY, 
    temperature: 0.9,
    // 测试流式回答，放开以下注释
    streaming: true,
    callbacks: [
        {
        handleLLMNewToken(token: string) {
            process.stdout.write(token);
        },
        },
    ],
}, {
    basePath: OPENAI_API_BASE_URL
});

const template = "我想去{destination}旅游，你有什么建议么?"

const prompt = new PromptTemplate({
  template: template,
  inputVariables: ["destination"]
})


const chain = new LLMChain({ llm: model, prompt: prompt });

const main = async ()=>{
    const res = await chain.call({ destination : "海南" });
    console.log(res);
};

main();