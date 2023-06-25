import { OpenAI } from "langchain/llms/openai";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
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



const main = async ()=>{
    const memory = new BufferMemory();
    const chain = new ConversationChain({ llm: model, memory: memory });
    const res1 = await chain.call({ input: "你好，我的名字是空山，你是谁" });
    // console.log(res1);
    const res2 = await chain.call({ input: "你知道我的名字吗" });
    // console.log(res2);
};

main();