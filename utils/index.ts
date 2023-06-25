const DEFAULT_API_URL = "https://aigptx.top/v1";
import { Storage } from "@plasmohq/storage"
export type APIModel = 'gpt-3.5-turbo' | 'gpt-3.5-turbo-0301' | 'gpt-4' | 'gpt-4-0314' | 'gpt-4-32k' | 'gpt-4-32k-0314'
 
export interface ISetting{
    API_KEY : string;
    API_URL : string;
    API_Model: APIModel;
};

const storage = new Storage();
export const saveSetting = (setting : Partial<ISetting>)=>{
    if(setting.API_KEY){
        storage.set("API_KEY",setting.API_KEY);
    }
    if(setting.API_Model){
        storage.set("API_Model",setting.API_Model);
    }
    if(setting.API_URL){
        storage.set("API_URL",setting.API_URL);
    }
};
export const getSetting =async ()=>{
    const API_KEY = await storage.get("API_KEY");
    const API_Model = (await storage.get("API_Model")) || 'gpt-3.5-turbo';
    const API_URL = (await storage.get("API_URL")) || DEFAULT_API_URL;
    return {
        API_KEY,
        API_URL,
        API_Model
    } as ISetting;
};