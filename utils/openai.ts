
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { getSetting } from "~utils";

let OpenAIModel: OpenAI;
const cbs: ((token: string) => void)[] = [];
const callCbs = (token: string) => {
    cbs.forEach(c => c(token));
};

const getOpenAIModel = async (cb?: (token: string) => void) => {
    if (typeof cb === "function") {
        cbs.push(cb);
    }
    if (OpenAIModel) return OpenAIModel;
    const setting = await getSetting();
    const model = new OpenAI({
        openAIApiKey: setting.API_KEY,
        temperature: 0,
        streaming: cbs.length > 0,
        modelName: setting.API_Model,
        callbacks: [
            {
                handleLLMNewToken(token: string) {
                    callCbs(token);
                },
                handleLLMEnd(output, runId, parentRunId) {
                    console.log({ callCbs });
                    callCbs(`TRANSLATE_END`)
                },
                handleLLMStart(llm, prompts, runId, parentRunId, extraParams, tags) {
                    callCbs(`TRANSLATE_START`)
                }
            },
        ],
    }, {
        basePath: setting.API_URL
    });
    OpenAIModel = model;
    return OpenAIModel;
};

const template = "You are a translation engine that can only translates text from {input_language} to {output_language}.The next text is you should translate. {text}";
const single_word_template = `你是一个词典，请将给到的单词进行翻译，只需要翻译不需要解释。以下是我需要翻译的单词{text}。请给出单词原始文本（即输入的文本）、单词的语种、对应的音标（如果有）、所有含义（含词性）、双语示例，至少三条例句，请严格按照下面格式给到翻译结果：
<原始文本>
[<语种>] · / <单词音标>
[<词性缩写>] <中文含义>]
例句：
<序号><例句>(例句翻译)`; 

export const translate = async (text: string, input_language: string, output_language: string, cb?: (token: string) => void) => {
    const isSingleWord = output_language === "Chinese" && !text.includes(' ');
    let prompt;
    if(isSingleWord){
        const translatePrompt = PromptTemplate.fromTemplate(single_word_template);
        prompt = await translatePrompt.format({ text });
    }else{
        const translatePrompt = PromptTemplate.fromTemplate(template);
        prompt = await translatePrompt.format({ input_language, output_language, text });
    }
    const modal = await getOpenAIModel(cb);
    const res = await modal.call(prompt);
    return res;
};

export default getOpenAIModel;