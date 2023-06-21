import { CSSProperties, useEffect, useMemo, useRef, useState } from "react"
import LogoSvg from "react:~assets/logo.svg"
import { Button, ButtonGroup, Input, Loader, Panel } from "rsuite"
import { usePort } from "@plasmohq/messaging/hook"

import delay from "~utils/delay"
import useDrag from "~utils/use-drag"

interface IProps {
  x: number
  y: number
  fromLang: string
  toLang: string
  text: string
}

const isInGmailDetailPage = () => {
  console.log(window.location)
  const { hostname } = window.location
  const isGmail = hostname === "mail.google.com"
  const replyBtn = document.querySelector(`span.ams`)
  const replyBox = document.querySelector(`div[role=textbox]`)
  if (!isGmail) return false
  if (!replyBtn && !replyBox) return false
  return true
}

const replyGmail = async (replyText: string) => {
  let replyBox = document.querySelector(`div[role=textbox]`)
  if (!replyBox) {
    const replyBtn = document.querySelector(`span.ams`) as HTMLButtonElement
    replyBtn.click()
    await delay()
  }
  replyBox = document.querySelector(`div[role=textbox]`)
  if (replyBox) {
    replyBox.textContent = replyText
    console.log("替换成功！")
  } else {
    console.log("替换失败！")
  }
}

const Translator = (props: IProps) => {
  const { x, y, text, fromLang, toLang } = props
  const [inputValue, setInput] = useState(text)
  const [replyValue, setReplayValue] = useState("")
  const [resultText, setResultText] = useState("")
  const [loading, setLoading] = useState(false)
  const [replyMode, setReplyMode] = useState(false)
  const dataRef = useRef({ gmailContent: "" })

  const { send, listen } = usePort("translate")

  // const triggerTranslate = async (text : string)=>{
  //   setLoading(true);
  //   const res = await sendToBackground({
  //     name: "translate",
  //     body : {
  //       text,
  //       fromLang,
  //       toLang
  //     }
  //   });
  //   setLoading(false);
  //   if(res.error){
  //     setResultText(res.error.message);
  //     return;
  //   }
  //   const txt = res.data?.choices[0]?.message?.content;
  //   setResultText(txt);
  // };
  const handleMsg = (msg) => {
    console.log({ msg })
    if (msg.type === "normal") {
      if (msg.inputText !== text) {
        // translatePort.onMessage.removeListener(handleMsg)
        return
      }
      if (msg.error) {
        setResultText(msg.error.message || "出错了")
        // translatePort.onMessage.removeListener(handleMsg)
        // translatePort.disconnect();
        setLoading(false)
      } else if (msg?.data === "[DONE]") {
        // translatePort.onMessage.removeListener(handleMsg)
        // translatePort.disconnect();
        setLoading(false)
      } else {
        const obj = JSON.parse(msg.data)
        const content = obj.choices[0].delta.content
        if (content) {
          setResultText((t) => (t += content))
        }
      }
    }
    if (msg.type === "reply") {
      if (msg.error) {
        setResultText(msg.error.message || "出错了")
        // translatePort.onMessage.removeListener(handleMsg)
        // translatePort.disconnect();
        setLoading(false)
      } else if (msg?.data === "[DONE]") {
        // translatePort.onMessage.removeListener(handleMsg)
        // translatePort.disconnect();
        setLoading(false)
      } else {
        const obj = JSON.parse(msg.data)
        const content = obj.choices[0].delta.content
        if (content) {
          setResultText((t) => (t += content))
        }
      }
    }
  }

  const triggerTranslate = async (
    text: string,
    fromLang,
    toLang,
    type: "normal" | "reply" = "normal"
  ) => {
    setLoading(true)
    send({
      text,
      fromLang,
      toLang,
      type
    })
  }

  const drag = useDrag()
  const wrapperStyle: CSSProperties = {
    position: "absolute",
    left: `${x}px`,
    top: `${y}px`,
    width: 600,
    minHeight: 300,
    backgroundColor: "white",
    borderRadius: 4,
    boxShadow: "rgba(0, 0, 0, 0.2) 0px 0px 4px",
    cursor: "move"
    // padding: 8
  }

  const switchReplyMode = () => {
    setReplyMode(true)
    setResultText("")
    dataRef.current.gmailContent = resultText
  }

  const translationReplyText = () => {
    if (!replyValue) return
    setResultText("");
    triggerTranslate(replyValue, toLang, fromLang, "reply")
  }

  const doReply = () => {
    console.log({ resultText })
    replyGmail(resultText)
  }

  useEffect(() => {
    if (text) {
      triggerTranslate(text, fromLang, toLang)
      listen(handleMsg)
      // translatePort.onMessage.addListener(handleMsg)
      // translatePort.onDisconnect.addListener(()=>{
      //   console.log(" onDisconnect ")
      // })
    }
    return () => {
      // translatePort.onMessage.removeListener(handleMsg)
    }
  }, [text])

  const showReply = useMemo(() => {
    const isIn = isInGmailDetailPage()
    console.log({ isIn })
    return isIn
  }, [])

  return (
    <div
      className="ai-translator-wrapper rs-theme-light"
      ref={drag.domRef}
      onMouseUp={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      style={wrapperStyle}>
      <div className="ai-translator-header">
        <span className="ai-translator-logo">
          <LogoSvg />
        </span>
        <span className="ai-translator-title">AI Translator</span>
        <span style={{ flex: 1 }}></span>
        {showReply && !replyMode && (
          <Button
            disabled={loading}
            onClick={switchReplyMode}
            size="xs"
            className="ai-translator-reply">
            回复
          </Button>
        )}
      </div>
      {replyMode ? (
        <div className="ai-translator-content">
          <Panel bordered header="邮件内容" collapsible>
            <div className="ai-translator-result">
              {dataRef.current.gmailContent?.split("\n").map((r) => (
                <p key={r}>{r}</p>
              ))}
            </div>
          </Panel>
          <Panel bordered header="回复内容" collapsible>
            <div className="ai-translator-result">
              {resultText?.split("\n").map((r) => (
                <p key={r}>{r}</p>
              ))}
            </div>
          </Panel>
          <Input
            style={{ margin: "8px 0" }}
            value={replyValue}
            onChange={(e) => {
              setReplayValue(e)
            }}
            className="ai-translator-input"
            as="textarea"
            rows={3}
            placeholder="请输入回复内容"
          />
          <div style={{ textAlign: "right" }}>
            <ButtonGroup>
              <Button loading={loading} onClick={translationReplyText}>
                翻译文本
              </Button>
              <Button onClick={doReply}>确认回复</Button>
            </ButtonGroup>
          </div>
        </div>
      ) : (
        <div className="ai-translator-content">
          <Input
            value={inputValue}
            onChange={(e) => {
              setInput(e)
            }}
            className="ai-translator-input"
            as="textarea"
            rows={3}
            placeholder="请输入"
          />
          <div className="ai-translator-content-divider">
            {loading && (
              <Loader
                className="ai-translator-status"
                size="xs"
                content="AI IS WORKING"
              />
            )}
            <div className="ai-translator-line"></div>
          </div>
          <div className="ai-translator-result">
            {resultText?.split("\n").map((r) => (
              <p key={r}>{r}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Translator
