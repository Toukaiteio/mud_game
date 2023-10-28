<template>
    <div class="MainWrapper">
        <div class="RegisterCard">
            <div class="Wrapper Centralize" :class="{show:UserInputManager.InputIndex==0,prev:UserInputManager.getPrev()==0,next:UserInputManager.getNext()==0,backward:PageStateManager.isBackWard,forward:!PageStateManager.isBackWard,hide:isElementHide(0)}">
                <div class="InputerWrapper" :class="InputBarStatus['PlayerName']['InfoType']">
                    <input type="text" v-model="UserInputManager.PlayerName" class="GameInputer" :placeholder="$t('_gameinputer_playername')">
                    <div class="InfoContent">{{ InputBarStatus['PlayerName']['InfoContent'] }}</div>
                </div>
            </div>
            <div class="Wrapper HasSelector" :class="{show:UserInputManager.InputIndex==1,prev:UserInputManager.getPrev()==1,next:UserInputManager.getNext()==1,backward:PageStateManager.isBackWard,forward:!PageStateManager.isBackWard,hide:isElementHide(1)}">
                <div class="WelcomeMessage" v-dompurify-html='$t("_tab_create_character_HelloPage_Hello")'>
                </div>
                <div class="ChooseGender" v-dompurify-html='$t("_tab_create_character_HelloPage_ChooseGender")'>
                </div>
                <div class="GenderSelector">
                    <DysSelector @on-selected="OnGenderSelectedHandler" @on-canceled="OnGenderCanceledHandler" :max-allow-selection="1" :selector-props="PageComponentsManager.GenderSelectorList"></DysSelector>
                    <div class="WraningMessage" v-dompurify-html="PageStateManager.GenderSelectorWarningMessage"></div>
                </div>
            </div>
            <div class="Wrapper" :class="{show:UserInputManager.InputIndex==2,prev:UserInputManager.getPrev()==2,next:UserInputManager.getNext()==2,backward:PageStateManager.isBackWard,forward:!PageStateManager.isBackWard,hide:isElementHide(2)}">
                <div class="RangeBar">
                    <div class="RangeName" v-dompurify-html="$t('_general_ATK')"></div>
                    <div class="Bar"><DysRange :min-range="-4" :max-range="4" v-model:now-number="Global_BasicPlayerData.PlayerStatus.ATK"></DysRange></div>
                </div>
                <div class="RangeBar">
                    <div class="RangeName" v-dompurify-html="$t('_general_DEF')"></div>
                    <div class="Bar"><DysRange :min-range="-4" :max-range="4" v-model:now-number="Global_BasicPlayerData.PlayerStatus.DEF"></DysRange></div>
                </div>
                <div class="RangeBar">
                    <div class="RangeName" v-dompurify-html="$t('_general_MOV')"></div>
                    <div class="Bar"><DysRange :min-range="-4" :max-range="4" v-model:now-number="Global_BasicPlayerData.PlayerStatus.MOV"></DysRange></div>
                </div>
            </div>
            <div class="Wrapper" :class="{show:UserInputManager.InputIndex==3,prev:UserInputManager.getPrev()==3,next:UserInputManager.getNext()==3,backward:PageStateManager.isBackWard,forward:!PageStateManager.isBackWard,hide:isElementHide(3)}">
                <div class="DescribeFact">
                    <p v-dompurify-html="$t('_tab_choose_start_StartPage_Line1')"></p>
                    <p v-dompurify-html="$t('_tab_choose_start_StartPage_Line2')"></p>
                </div>
            </div>
            <div class="Btns">
                <div class="BWrapper" @click="GoPrevPage()" v-if="UserInputManager.InputIndex>0">
                    <div class="Roller"></div>
                    <div class="Arrow">&lt;</div>
                </div>
                <div class="BWrapper" @click="(UserInputManager.NextBtnFunc[UserInputManager.InputIndex] || DefalutNextFunc)()" :class="{CentralFix:UserInputManager.InputIndex==0 || UserInputManager.InputIndex==UserInputManager.InputTotalLayer}">
                    <div class="Roller"></div>
                    <div class="Arrow">></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useGameMainStorage } from '@/utils/store';
import DysSelector from '@/components/DysSelector.vue';
import DysRange from '@/components/DysRange.vue';
import { reactive} from 'vue';
const { Global_BasicPlayerData, $t }=useGameMainStorage();
const PageComponentsManager=reactive({
    GenderSelectorList:[
        {
            text:$t("_tab_create_character_HelloPage_ChooseGender_Male"),
            icon:"M289.8 46.8c3.7-9 12.5-14.8 22.2-14.8H424c13.3 0 24 10.7 24 24V168c0 9.7-5.8 18.5-14.8 22.2s-19.3 1.7-26.2-5.2l-33.4-33.4L321 204.2c19.5 28.4 31 62.7 31 99.8c0 97.2-78.8 176-176 176S0 401.2 0 304s78.8-176 176-176c37 0 71.4 11.4 99.8 31l52.6-52.6L295 73c-6.9-6.9-8.9-17.2-5.2-26.2zM400 80l0 0h0v0zM176 416a112 112 0 1 0 0-224 112 112 0 1 0 0 224z",
            value:0
        },
        {
            text:$t("_tab_create_character_HelloPage_ChooseGender_Female"),
            icon:"M80 176a112 112 0 1 1 224 0A112 112 0 1 1 80 176zM224 349.1c81.9-15 144-86.8 144-173.1C368 78.8 289.2 0 192 0S16 78.8 16 176c0 86.3 62.1 158.1 144 173.1V384H128c-17.7 0-32 14.3-32 32s14.3 32 32 32h32v32c0 17.7 14.3 32 32 32s32-14.3 32-32V448h32c17.7 0 32-14.3 32-32s-14.3-32-32-32H224V349.1z",
            value:1
        },
        {
            text:$t("_tab_create_character_HelloPage_ChooseGender_NMale"),
            icon:"M337.8 14.8C341.5 5.8 350.3 0 360 0H472c13.3 0 24 10.7 24 24V136c0 9.7-5.8 18.5-14.8 22.2s-19.3 1.7-26.2-5.2l-39-39-24.7 24.7C407 163.3 416 192.6 416 224c0 80.2-59.1 146.7-136.1 158.2c0 .6 .1 1.2 .1 1.8v.4 .4 .4 .4 .4 .4 .4 .4 .4 .4 .4 .4 .4 .4 .4 .4 .4 .4 .4 .4 .4 .4 .4 .4 .4 .4 .4 .4 .4 .4 .3 .4 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3h24c13.3 0 24 10.7 24 24s-10.7 24-24 24H280v.2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0l-24 0-24 0v0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1V486 486v-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1V485 485v-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1V484v-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1V483v-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1V481v-.1-.1-.1-.1-.1-.1-.1-.1V480v-.1-.1-.1-.1-.1-.1-.1V479v-.1-.1-.1-.1-.1-.1-.1V478v-.1-.1-.1-.1-.1-.1V477v-.1-.1-.1-.1-.1-.1V476v-.1-.1-.1-.1-.1-.1V475v-.1-.2-.2-.2-.2-.2V474v-.2-.2-.2-.2-.2V473v-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2V470v-.2-.2-.2-.2-.2V469v-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2V467v-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2V463v-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2V459v-.2-.2-.2-.2-.2-.2-.2-.2V457v-.2-.2-.2-.2V456H208c-13.3 0-24-10.7-24-24s10.7-24 24-24h24v-.3-.3-.3-.3-.3-.3-.3-.3-.3-.3-.3-.3-.3-.3V403v-.3-.3V402v-.3-.3V401v-.3-.3V400v-.3-.3-.3-.3-.3-.3-.3-.3-.3-.3-.3-.3-.3-.4-.3-.4-.4-.4-.4V393v-.4-.4-.4-.4-.4-.4-.4-.4-.4-.4-.4-.4-.4V388v-.4-.4-.4-.4-.4-.4-.4-.4-.4-.4V384c0-.6 0-1.2 .1-1.8C155.1 370.7 96 304.2 96 224c0-88.4 71.6-160 160-160c39.6 0 75.9 14.4 103.8 38.2L382.1 80 343 41c-6.9-6.9-8.9-17.2-5.2-26.2zM448 48l0 0h0v0zM256 488h24c0 13.3-10.7 24-24 24s-24-10.7-24-24h24zm96-264a96 96 0 1 0 -192 0 96 96 0 1 0 192 0z",
            value:2
        },
        {
            text:$t("_tab_create_character_HelloPage_ChooseGender_NFamale"),
            icon:"M337.8 14.8C341.5 5.8 350.3 0 360 0H472c13.3 0 24 10.7 24 24V136c0 9.7-5.8 18.5-14.8 22.2s-19.3 1.7-26.2-5.2l-39-39-24.7 24.7C407 163.3 416 192.6 416 224c0 80.2-59.1 146.7-136.1 158.2c0 .6 .1 1.2 .1 1.8v.4 .4 .4 .4 .4 .4 .4 .4 .4 .4 .4 .4 .4 .4 .4 .4 .4 .4 .4 .4 .4 .4 .4 .4 .4 .4 .4 .4 .4 .4 .3 .4 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3 .3h24c13.3 0 24 10.7 24 24s-10.7 24-24 24H280v.2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .2 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 .1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0l-24 0-24 0v0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1V486 486v-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1V485 485v-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1V484v-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1V483v-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1V481v-.1-.1-.1-.1-.1-.1-.1-.1V480v-.1-.1-.1-.1-.1-.1-.1V479v-.1-.1-.1-.1-.1-.1-.1V478v-.1-.1-.1-.1-.1-.1V477v-.1-.1-.1-.1-.1-.1V476v-.1-.1-.1-.1-.1-.1V475v-.1-.2-.2-.2-.2-.2V474v-.2-.2-.2-.2-.2V473v-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2V470v-.2-.2-.2-.2-.2V469v-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2V467v-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2V463v-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2-.2V459v-.2-.2-.2-.2-.2-.2-.2-.2V457v-.2-.2-.2-.2V456H208c-13.3 0-24-10.7-24-24s10.7-24 24-24h24v-.3-.3-.3-.3-.3-.3-.3-.3-.3-.3-.3-.3-.3-.3V403v-.3-.3V402v-.3-.3V401v-.3-.3V400v-.3-.3-.3-.3-.3-.3-.3-.3-.3-.3-.3-.3-.3-.4-.3-.4-.4-.4-.4V393v-.4-.4-.4-.4-.4-.4-.4-.4-.4-.4-.4-.4-.4V388v-.4-.4-.4-.4-.4-.4-.4-.4-.4-.4V384c0-.6 0-1.2 .1-1.8C155.1 370.7 96 304.2 96 224c0-88.4 71.6-160 160-160c39.6 0 75.9 14.4 103.8 38.2L382.1 80 343 41c-6.9-6.9-8.9-17.2-5.2-26.2zM448 48l0 0h0v0zM256 488h24c0 13.3-10.7 24-24 24s-24-10.7-24-24h24zm96-264a96 96 0 1 0 -192 0 96 96 0 1 0 192 0z",
            value:3
        }
    ]
});
const DefalutNextFunc=():void=>{
    PageStateManager.isBackWard=false;
    UserInputManager.InputIndex=UserInputManager.getNext();
}
const SetPlayerNameFunc=():void=>{
    if(UserInputManager.PlayerName!='' && UserInputManager.PlayerName.length<=32){
        Global_BasicPlayerData.PlayerName=UserInputManager.PlayerName;
        PageStateManager.isBackWard=false;
        UserInputManager.InputIndex=UserInputManager.getNext();
        ClearInputInfo("PlayerName");
    }
    else ThrowPlayerNameException(UserInputManager.PlayerName);
}
const OnGenderSelectedHandler=(data:number):void=>{
    UserInputManager.PlayerGender=data;
    Global_BasicPlayerData.PlayerGender=data;
    if(data!=-1) Global_BasicPlayerData.PlayerGenderDisplay=Global_BasicPlayerData.GenderMap[data];
    else Global_BasicPlayerData.PlayerGenderDisplay=""
}
const OnGenderCanceledHandler=(data:number):void=>{
    UserInputManager.PlayerGender=-1;
}
const SavePlayerGenderAction=():void=>{
    if(UserInputManager.PlayerGender!=-1){
        DefalutNextFunc();
    }else{
        PageStateManager.GenderSelectorWarningMessage=$t("_tab_create_character_HelloPage_ChooseGender_Warning_Empty");
    }
}
const UserInputManager=reactive({
    InputIndex:0,
    InputTotalLayer:4,
    NextBtnFunc:[
        SetPlayerNameFunc,
        SavePlayerGenderAction
    ],
    getPrev(){
        if(this.InputIndex<=0) return this.InputTotalLayer-1
        else return this.InputIndex-1;
    },
    getNext(){
        if(this.InputIndex>=this.InputTotalLayer-1) return 0;
        else return this.InputIndex+1;
    },
    PlayerName:"",
    PlayerGender:-1,
});
const isElementHide=(index:number):boolean=>{
    return (UserInputManager.InputIndex!=index && UserInputManager.getNext()!=index && UserInputManager.getPrev()!=index)
}
interface InputBarBasicInfoContent{
    InfoType:"error"|"info"|"success"|"none";
    InfoContent:string
}
type InputAlert=InputBarBasicInfoContent;
const InputBarStatus:Record<string,InputAlert>=reactive({
    "PlayerName":{
        InfoType:"none",
        InfoContent:"",
    }

});
const PageStateManager=reactive({
    isBackWard:false,
    GenderSelectorWarningMessage:"",
})

const ClearInputInfo=(target:string):void=>{
    InputBarStatus[target]={
        InfoType:"none",
        InfoContent:""
    }
}
const ThrowInputInfo=(target:string,InfoType:"error"|"info"|"success"|"none",InfoContent:string):void=>{
    InputBarStatus[target]={
        InfoType:InfoType,
        InfoContent:InfoContent
    }
}
const ThrowPlayerNameException=(ori:string):void=>{
    // if(ori.length>32) ThrowInputInfo("PlayerName","error","_L.lang._gameinputer_playername_overlength");
    // if(ori.length==0) ThrowInputInfo("PlayerName","error","_L.lang._gameinputer_playername_empty");
    if(ori.length>32) ThrowInputInfo("PlayerName","error",$t("_gameinputer_playername_Overlength"));
    if(ori.length==0) ThrowInputInfo("PlayerName","error",$t("_gameinputer_playername_Empty"));
}
const GoPrevPage=():void=>{
    PageStateManager.isBackWard=true;
    UserInputManager.InputIndex=UserInputManager.getPrev();
}
</script>
<style lang="scss" scoped>
$BaseMainColor:#1F242B;
$BaseSecondaryColor:#0046FF;
$BaseSecondaryColor2:#F91941;
$BaseSecondaryColor3:#00B1FF;
$FontColor:lighten($BaseMainColor,40%);
$FontActive:lighten($BaseMainColor,55%);
@keyframes roller {
    0%{
        transform: rotateZ(0deg);
    }
    100%{
        transform: rotateZ(360deg);
    }
}
@keyframes rtm {
    0%{
        transform: translateX(110%);
        display: none;
    }
    100%{
        transform: translateX(0%);
    }
}
@keyframes mtl {
    0%{
        transform: translateX(0%);
    }
    100%{
        transform: translateX(-110%);
        display: none;
    }
}
@keyframes ltm {
    0%{
        transform: translateX(-110%);
        display: none;
    }
    100%{
        transform: translateX(0%);
    }
}
@keyframes mtr {
    0%{
        transform: translateX(0%);
    }
    100%{
        transform: translateX(-110%);
        display: none;
    }
}
    .MainWrapper{
        height: 100%;
        width: 100%;
        overflow: hidden;
        padding: 26px;
        .RegisterCard{
            width: 100%;
            height: 100%;
            .Wrapper{
                position: absolute;
                top: 0;
                left: 0;
                overflow: hidden;
                text-overflow: ellipsis;
                .DescribeFact{
                    height: 30%;
                    width: 100%;
                    p{
                        width: 100%;
                    }
                }
                &.hide{
                    display: none !important;
                    opacity: 0;
                    pointer-events: none;
                    user-select: none;
                }
                &.prev.forward{
                    animation:mtl 0.6s forwards;
                }
                &.prev.backward{
                    animation:mtr 0.6s forwards;
                }
                &.show.forward{
                    animation:rtm 0.8s forwards;
                }
                &.show.backward{
                    animation:ltm 0.8s forwards;
                }
                &.next{
                    transform: translateX(110%);
                }
                width: 100%;
                height: 100%;
                &.Centralize{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    position: absolute;
                }
                .WelcomeMessage{
                    font-size: 22px;
                    font-weight: bolder;
                }
                &.HasSelector{
                    display: flex;
                    flex-direction: column;
                }
                .GenderSelector{
                    
                    flex: 1;
                    height: 0;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }
                .RangeBar{
                    width: 100%;
                    height: 100px;
                    margin-bottom: 24px;
                    .RangeName{
                        height: 40px;
                        width: 100%;
                        font-size: 23px;
                        text-align: center;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        word-break: keep-all;
                        white-space: nowrap;
                    }
                    .Bar{
                        height: 60px;
                        width: 100%;
                        border-radius: 3px;
                        overflow: hidden;
                    }
                }
            }
            position: relative;
            padding-bottom: 42px;
            .Btns{
                user-select: none;
                position: absolute;
                left: 0px;
                bottom: 36px;
                height: 50px;
                padding-left: 36px;
                padding-right: 36px;
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: space-evenly;
                .BWrapper{
                    height: 50px;
                    width: 50px;
                    position: relative;
                    &.CentralFix{
                        .Arrow{
                            margin-left: 2px;
                        }
                    }
                }
                .Roller{
                    transition: background 0.6s;
                    overflow: hidden;
                    // &:hover{
                    //     background: darken($BaseMainColor,10%);
                    //     animation-play-state: paused;
                    // }
                    position: absolute;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    border: 4px dashed $FontColor;
                    animation: roller 6s infinite linear;
                }
                
                .Arrow{
                    font-size: 35px;
                    height: 50px;
                    width: 50px;
                    font-family: Arial, Helvetica, sans-serif;
                    font-weight: bolder;
                    text-align: center;
                    line-height: 50px;
                    vertical-align: middle;
                    color:transparent;
                    -webkit-text-stroke: $FontColor 1px;
                }
                color: $FontColor;
                
            }
        }
    }
</style>