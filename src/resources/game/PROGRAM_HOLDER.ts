import { useGameMainStorage } from "@/utils/store";
import GameNPCDialog from '@/resources/game/npc/npc_dialog.json';
const { Global_BasicPlayerData,conditionParser,effectParser,$t }=useGameMainStorage();
interface DialogEffect{
    effect:Record<string,any>,
    useVal:Record<string,any>|undefined
}
const LoadNpcDialog=(TargetID:string)=>{
    //Find NPC
    const npc=(Global_BasicPlayerData.GameOnNpcs as Record<string,any>)[TargetID];
    console.log(TargetID);
    //Check if has dialog
    const dialog=(GameNPCDialog as Record<string,any>)[(npc as Record<string,any>)["usingDialog"]];
    const dialog_effects=([] as Array<DialogEffect>);
    if(dialog){
        for(const i in dialog){
            if(dialog[i]["condition"]){
                if(conditionParser(dialog[i]["condition"],undefined,undefined,true,dialog[i]["condition"]["affection"],true,dialog[i]["requireVal"])["_direct_use_result_transer"]){
                    if(dialog[i]["effect"])
                        dialog_effects.push(({
                            "effect":dialog[i]["effect"],
                            "useVal":dialog[i]["useVal"],
                        } as DialogEffect));
                    (Global_BasicPlayerData.ThisRoundEvent as Array<string>).push($t(i));
                }
                
            }else{
                if(dialog[i]["effect"])
                    dialog_effects.push(({
                                "effect":dialog[i]["effect"],
                                "useVal":dialog[i]["useVal"],
                            } as DialogEffect));
                (Global_BasicPlayerData.ThisRoundEvent as Array<string>).push($t(i));
            }
            
        }
    }else{
        (Global_BasicPlayerData.ThisRoundEvent as Array<string>).push($t((npc as Record<string,any>)["usingDialog"]))
    }
    console.log("Dialog Effect:",dialog_effects);
    for(const i of dialog_effects){
        effectParser(i["effect"],i["useVal"],undefined)();
    }
}
export const PROGRAMHOLDER={
    "#PROGRAM_HOLD_TALK_FUNCTION":(TargetID:string)=>{
        (Global_BasicPlayerData.RoundTempValues as Record<string,any>)["#PROGRAM_HOLD_TALK_FUNCTION"]=$t("_function_TALK_Prefix")+$t((Global_BasicPlayerData as Record<string,any>)["GameOnNpcs"][TargetID]["name"]);
        (Global_BasicPlayerData.RoundTempValues as Record<string,any>)["#PROGRAM_HOLD_TALK_CONTENT"]=$t("_function_TALK_Prefix")+" \n";
    },
    "#PROGRAM_HOLD_TALK_FUNCTION_DO":(TargetID:string)=>{
        // ${Holder_Name} with _Do suffix will excute after Time calculation.
        LoadNpcDialog(TargetID);
    },
    
}