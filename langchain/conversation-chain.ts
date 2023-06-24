import { OpenAI } from "langchain/llms/openai";
import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import 'dotenv/config'

const OPENAI_API_BASE_URL = process.env.OPENAI_API_BASE_URL;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/**
 * 
 * ## ConversationChain 基本使用
 * 
 * 之前的链条都是无状态的。 `ConversationChain` 不同之处在于它默认拥有简单的记忆类型。
 * 正如它名字一样，它可以用于会话聊天类型的场景。
 * 
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