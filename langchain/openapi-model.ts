import { OpenAI } from "langchain/llms/openai";
import 'dotenv/config'

const OPENAI_API_BASE_URL = process.env.OPENAI_API_BASE_URL;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/**
 * 
 * ## 基本使用
 * 
 * 1. 填入 `OPENAI_API_KEY`
 * 2. 如有代理，请在第二个参数里填入 `basePath`
 * 3. 直接调用 `model.call` 传入用户输入就行
 * 4. 流式回答，在配置里开启 `streaming` 开关，使用 `callbacks` 接受回传的字符串
 */

const model = new OpenAI({ 
    openAIApiKey: OPENAI_API_KEY, 
    temperature: 0.9,
    // 测试流式回答，放开以下注释
    // streaming: true,
    // callbacks: [
    //     {
    //     handleLLMNewToken(token: string) {
    //         process.stdout.write(token);
    //     },
    //     },
    // ],
}, {
    basePath: OPENAI_API_BASE_URL
});

const main = async ()=>{
    const res = await model.call("介绍一下你自己把！");
    console.log(res);
};

main();