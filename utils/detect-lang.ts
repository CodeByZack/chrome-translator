// import { franc } from 'franc'
// import convert3To1 from 'iso-639-3-to-1'

export const supportLanguages: [string, string][] = [
    ['en', 'English'],
    ['zh-Hans', 'Chinese'],
]
export const langMap: Map<string, string> = new Map(supportLanguages)
export const langMapReverse = new Map(supportLanguages.map(([standardLang, lang]) => [lang, standardLang]))


const isChineseSentence = (str, threshold)=>{
  var reg = /[\u4e00-\u9fa5]/;
  var chineseCount = 0;
  for (var i = 0; i < str.length; i++) {
    if (reg.test(str[i])) {
      chineseCount++;
    }
  }
  var ratio = chineseCount / str.length;
  return ratio >= threshold;
}

const detectLang = (input : string)=>{
    // const langCode = franc(input,{ minLength : 3 });
    // const lang = convert3To1(langCode);
    // if (lang === 'zh' || lang === 'zh-CN' || lang === 'zh-TW') {
    //     return 'zh-Hans';
    // }
    const isChinese = isChineseSentence(input,0.7);
    return isChinese ? "zh-Hans" : "en";
};

export default detectLang;