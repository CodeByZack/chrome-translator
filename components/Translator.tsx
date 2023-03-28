import { CSSProperties, useEffect, useState } from "react";
import useDrag from "~utils/use-drag";
import LogoSvg from "react:~assets/logo.svg"
import { sendToBackground } from "@plasmohq/messaging";
import { Input, Loader } from "rsuite";
import { getPort } from "@plasmohq/messaging/port"

interface IProps {
  x: number;
  y: number;
  fromLang : string;
  toLang : string;
  text : string;
}


const translatePort = getPort("translate");

const Translator = (props: IProps) => {
  const { x, y, text, fromLang, toLang } = props;
  const [inputValue,setInput] = useState(text);
  const [resultText,setResultText] = useState('');
  const [loading,setLoading] = useState(false);

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
  const handleMsg = (msg)=>{
    if(msg.inputText !== text){
      translatePort.onMessage.removeListener(handleMsg);
      return;
    }

    if(msg.error){
      setResultText(msg.error.message || "出错了");
      translatePort.onMessage.removeListener(handleMsg);
      // translatePort.disconnect();
      setLoading(false);
    }else if(msg?.data === "[DONE]"){
      translatePort.onMessage.removeListener(handleMsg);
      // translatePort.disconnect();
      setLoading(false);
    }else{
      const obj = JSON.parse(msg.data);
      const content = obj.choices[0].delta.content;
      console.log({
        text, content
      })
      if(content){
        setResultText(t=>t+=content);
      }
    }
  };

  const triggerTranslate = async (text : string)=>{
    setLoading(true);
    translatePort.postMessage({
      body: {
        text,
        fromLang,
        toLang
      }
    });
   
  };

  const drag = useDrag();
  const wrapperStyle: CSSProperties = {
    position: "absolute",
    left: `${x}px`,
    top: `${y}px`,
    width: 600,
    minHeight: 300,
    backgroundColor: "white",
    borderRadius: 4,
    boxShadow: 'rgba(0, 0, 0, 0.2) 0px 0px 4px',
    cursor: "move",
    // padding: 8
  };

  useEffect(()=>{
    if(text){
      triggerTranslate(text);
      translatePort.onMessage.addListener(handleMsg)
    }
    return ()=>{
      translatePort.onMessage.removeListener(handleMsg);
    }
  },[text])



  return (
      <div className="ai-translator-wrapper rs-theme-light" ref={drag.domRef} onMouseUp={e => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()} style={wrapperStyle}>
        <div className="ai-translator-header">
          <span className="ai-translator-logo"><LogoSvg /></span>
          <span className="ai-translator-title">AI Translator</span>
        </div>
        <div className="ai-translator-content">
          <Input value={inputValue} onChange={(e)=>{setInput(e)}} className="ai-translator-input" as="textarea" rows={3} placeholder="请输入" />
          <div className="ai-translator-content-divider">
            {loading &&<Loader className="ai-translator-status" size="xs" content="AI IS WORKING"/>}
            <div className="ai-translator-line"></div>
          </div>
          <div className="ai-translator-result">
            {resultText?.split("\n").map(r=><p>{r}</p>)}
          </div>
        </div>
      </div>
  )

}

export default Translator;

