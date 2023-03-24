import type { PlasmoCSConfig, PlasmoRender } from "plasmo"
import { createRoot } from 'react-dom/client';
import Logo from "~components/Logo";
import Translator from "~components/Translator";
import styleText from "data-text:rsuite/styles/index.less";
import compStyleText from "data-text:~components/styles.less";
import type { PlasmoGetStyle } from "plasmo"
import detectLang from "~utils/detect-lang";
 
export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style");
  style.textContent = [styleText,compStyleText].join('\n');
  return style
}

export interface IPosition {
  x: number;
  y: number;
}

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
}

const STORE: {
  CONTENT_RENDER?: ReturnType<typeof createRoot>;
  IS_ICON_SHOW: boolean;
  IS_PANEL_SHOW: boolean;
} = {
  CONTENT_RENDER: undefined,
  IS_ICON_SHOW: false,
  IS_PANEL_SHOW: false
};



export const render: PlasmoRender = async ({ anchor, createRootContainer }) => {
  const rootContainer = await createRootContainer(anchor);
  STORE.CONTENT_RENDER = createRoot(rootContainer);
}


const showTranslator = (text:string,x:number,y:number)=>() => {
  if(STORE.IS_ICON_SHOW){
    STORE.CONTENT_RENDER.render(null);
  }
  const detectFromLang = detectLang(text);
  const detectToLang = detectFromLang === 'zh-Hans' ? "en" : "zh-Hans";
  STORE.CONTENT_RENDER.render(<Translator fromLang={detectFromLang || "auto"} toLang={detectToLang} text={text} x={x-300} y={y}/>);
  STORE.IS_PANEL_SHOW = true;
};


const showPopupIcon = (text, x, y) => {
  STORE.CONTENT_RENDER.render(<Logo showTranslator={showTranslator(text,x,y)} x={x} y={y} />);
  STORE.IS_ICON_SHOW = true;
};

const hidePopup = () => {
  if (STORE.IS_ICON_SHOW || STORE.IS_PANEL_SHOW){
    STORE.CONTENT_RENDER.render(null);
  }

  STORE.IS_ICON_SHOW = false;
  STORE.IS_PANEL_SHOW = false;
};


const main = () => {

  let lastMouseEvent: MouseEvent | undefined
  document.addEventListener('mouseup', (event: MouseEvent) => {
    lastMouseEvent = event
    window.setTimeout(async () => {
      let text = (window.getSelection()?.toString() ?? '').trim()
      if (text && !STORE.IS_PANEL_SHOW && !STORE.IS_ICON_SHOW) {
        showPopupIcon(text, event.pageX + 7, event.pageY + 7);
      }
    })
  })

  document.addEventListener('mousedown', () => {
    hidePopup();
  })
};

main();