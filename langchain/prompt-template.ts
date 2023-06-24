import { PromptTemplate } from "langchain/prompts"

/**
 *
 * ## PromptTemplate 基本使用
 *
 * 从官网教程来看，作用类似于 Javascript 的模板字符串，就是进行进行变量替换。
 * 有没有其它作用，后面再看
 *
 * 模板字符串，变量名用大括号括起来 `{destination}`
 *
 */

const template = "我想去{destination}旅游，你有什么建议么?"

const prompt = new PromptTemplate({
  template: template,
  inputVariables: ["destination"]
})

const main = async () => {
  const res = await prompt.format({ destination: "海南" })
  console.log(res)
}

main()
