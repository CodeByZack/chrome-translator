import { PromptTemplate } from "langchain/prompts";
import { OpenAI } from "langchain/llms/openai";
import { LLMChain } from "langchain/chains";

const model = new OpenAI({ 
    openAIApiKey: "sk-fWNnKsDLKg0cOGVrsMwcoNGWm6KX9xyEgaycCeXtODTSfnWU", 
    temperature: 0.9,
    streaming: true,
    callbacks: [
        {
        handleLLMNewToken(token: string) {
            console.log({ token });
            process.stdout.write(token);
        },
        },
    ],
}, {
    basePath: 'https://aigptx.top/v1'
});
const template = "你是谁 {product}?";

const prompt = new PromptTemplate({

  template: template,

  inputVariables: ["product"],

});

const chain = new LLMChain({ llm: model, prompt: prompt });

const main = async ()=>{
    const res = await chain.call({ product: "你好啊" });
    console.log(res);
};

main();