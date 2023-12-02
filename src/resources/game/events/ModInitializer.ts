//Game Will Load This Function immediately after initialized and will expose API in TotalGameAPI;
export function ModInitializer(TotalGameAPI:Record<string,any>):Record<string,any>{
    const TotalGameAPIInterceptor=new Proxy(TotalGameAPI,{
        get(_target,_param,_reciver){
            // console.log(_target,_param,_reciver);
            if(typeof _param === "boolean"){
                return _target;
            }else{
                return _target[<string>_param];
            }
            
        },
        set(_target,_param,_newVal,_reciver){
            // console.log(_target,_param,_newVal,_reciver);
            if(typeof _param === "boolean"){
                _target=_newVal;
            }else{
                _target[<string>_param]=_newVal;
            }
            return true;
        }
    });
    console.log("Mod Initialize: LoadedAPI",TotalGameAPIInterceptor)
    return {
        GetPlayerTags(){
            return Object.keys(TotalGameAPIInterceptor.Global_BasicPlayerData.PlayerTags).filter(_t => _t.slice(0,4)=="_TAG")
        }
    };
}

