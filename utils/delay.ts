const delay = (ms : number = 1000)=>{
    return new Promise((r)=>setTimeout(r,ms));
};
export default delay;