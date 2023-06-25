import { CSSProperties, useCallback, useEffect, useState } from "react"
import LogoSvg from "react:~assets/logo.svg"
import { Input, Loader } from "rsuite"
import useDrag from "~utils/use-drag"
import { translate } from "~utils/openai"
import { langMap } from "~utils/detect-lang"

interface IProps {
  x: number
  y: number
  fromLang: string
  toLang: string
  text: string
}

const Translator = (props: IProps) => {
  const { x, y, text, fromLang, toLang } = props
  const [inputValue, setInput] = useState(text)
  const [resultText, setResultText] = useState("")
  const [loading, setLoading] = useState(false)

  const handleMsg = useCallback((msg) => {
    if(msg === "TRANSLATE_START"){
      setLoading(true);
    }else if(msg === "TRANSLATE_END"){
      setLoading(false);
    }else{
      setResultText((t) => (t += msg));
    }
  }, []);

  const triggerTranslate = async (
    text: string,
    fromLang,
    toLang,
  ) => {
    setLoading(true);
    const input_language = langMap.get(fromLang);
    const output_language = langMap.get(toLang);
    translate(text, input_language, output_language, handleMsg);
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
  }

  useEffect(() => {
    if (text) {
      triggerTranslate(text, fromLang, toLang)
    }
  }, [text]);

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
      </div>
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
    </div>
  )
}

export default Translator
