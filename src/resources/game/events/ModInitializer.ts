//Game Will Load This Function immediately after initialized and will expose API in TotalGameAPI;
export function ModInitializer(TotalGameAPI:Record<string,any>):Record<string,any>{
    console.log("Mod Initialize: LoadedAPI",TotalGameAPI)
    return {
        GetPlayerTags(){
            return Object.keys(TotalGameAPI.Global_BasicPlayerData.PlayerTags).filter(_t => _t.slice(0,4)=="_TAG")
        }
    };
}

