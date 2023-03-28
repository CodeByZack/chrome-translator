import { createParser } from "eventsource-parser"

import type { PlasmoMessaging } from "@plasmohq/messaging"

import { getSetting } from "~utils"
import { langMap } from "~utils/detect-lang"

export type APIModel =
  | "gpt-3.5-turbo"
  | "gpt-3.5-turbo-0301"
  | "gpt-4"
  | "gpt-4-0314"
  | "gpt-4-32k"
  | "gpt-4-32k-0314"

const SINGLE_WORD_PROMPT = `你是一个词典，请将给到的单词进行翻译，只需要翻译不需要解释。请给出单词原始文本（即输入的文本）、单词的语种、对应的音标（如果有）、所有含义（含词性）、双语示例，至少三条例句，请严格按照下面格式给到翻译结果：
<原始文本>
[<语种>] · / <单词音标>
[<词性缩写>] <中文含义>]
例句：
<序号><例句>(例句翻译)`

const translate: PlasmoMessaging.PortHandler<{
  text: string
  fromLang: string
  toLang: string
}> = async (req, res) => {
  const { text, fromLang, toLang } = req.body
  let systemPrompt =
    "You are a translation engine that can only translate text and cannot interpret it."
  let assistantPrompt = `translate from ${
    langMap.get(fromLang) || fromLang
  } to ${langMap.get(toLang) || toLang}`

  if (toLang === "zh-Hans" && !text.includes(" ")) {
    systemPrompt = SINGLE_WORD_PROMPT
  }
  const setting = await getSetting()

  const body: Record<string, any> = {
    model: setting.API_Model,
    temperature: 0,
    max_tokens: 1000,
    // top_p: 1,
    // frequency_penalty: 1,
    // presence_penalty: 1,
    stream: true,
    messages: [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: assistantPrompt
      },
      { role: "user", content: `${text}` }
    ]
  }
  const apiKey = setting.API_KEY
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`
  }
  let resp: Response | null = null

  try {
    resp = await fetch(setting.API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    })
  } catch (error) {
    res.send({ error })
    return
  }

  const reader = resp?.body?.getReader()
  if (!reader) {
    res.send({ inputText: text, status: resp.status })
    return
  }
  const parser = createParser((event) => {
    if (event.type === "event") {
      res.send({ inputText: text, status: resp?.status, data: event.data })
    }
  })
  try {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        break
      }
      const str = new TextDecoder().decode(value)
      parser.feed(str)
    }
  } catch (error) {
    res.send({ inputText: text, error })
    return
  }
}

export default translate
