import { initializeAgentExecutorWithOptions } from "langchain/agents"
import { OpenAI } from "langchain/llms/openai"
import { SerpAPI } from "langchain/tools"
import { Calculator } from "langchain/tools/calculator"

import "dotenv/config"

const OPENAI_API_BASE_URL = process.env.OPENAI_API_BASE_URL
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const SERPAPI_API_KEY = process.env.SERPAPI_API_KEY

/**
 *
 * ## Agent 基本使用
 *
 * 另外使用 `agent` ，我们还需要明白以下几个概念
 *
 * 工具（Tool）：执行特定职责的函数。这些职责可能包括：Google 搜索、数据库查询、代码 REPL（Read-Eval-Print Loop，读取-求值-输出循环）、其他链。目前工具的接口是一个期望输入字符串，并返回一个字符串的函数。
 * LLM: 代理使用的语言模型。
 * Agent: 所使用的代理。这应该是一个引用支持代理类的字符串。。
 *
 * 可以这么理解代理，我们现在和 `chatgpt` 对话，需要写 `prompt` ，而且越程式化，回答则越精确。
 * 但人的表达，往往是非程式化的， `agent` 可以帮你做到这件事，拆解你的意图，调用合适的工具，得到答案，看答案是否符合。
 *
 * 可以在生成 `agent` 时，将 `verbose` 设置为 `true` ，看详细的执行过程。
 *
 */

const model = new OpenAI(
  {
    openAIApiKey: OPENAI_API_KEY,
    temperature: 0.9
    // 测试流式回答，放开以下注释
    // streaming: true,
    // callbacks: [
    //     {
    //     handleLLMNewToken(token: string) {
    //         process.stdout.write(token);
    //     },
    //     },
    // ],
  },
  {
    basePath: OPENAI_API_BASE_URL
  }
)

const tools = [
  new SerpAPI(SERPAPI_API_KEY, {
    hl: "zh-cn",
    gl: "cn"
  }),
  new Calculator()
]

const input = "今天的日期和时间?"

const main = async () => {
  const executor = await initializeAgentExecutorWithOptions(tools, model, {
    agentType: "zero-shot-react-description",
    // 如果需要可以看 agent 详细的执行过程，可以打开 verbose
    verbose: true
  })
  console.log("Loaded agent.")
  const result = await executor.call({ input })
  console.log(`Got output ${result.output}`)
}

main()
