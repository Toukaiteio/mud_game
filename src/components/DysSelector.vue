<template>
    <div class="dys_Selector">
      <div class="dys_Selector_Item" v-for="(_c1,_i1) in (selectorProps as Array<any>)" :key="_i1" :class="{Selecting:nowSelecting[_i1]}" @click="NewSelection(_c1,_i1);">
        <svg class="_icon" v-if="_c1.icon" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
          <path :d="_c1.icon"></path>
        </svg>
        <div class="context" v-dompurify-html="_gprop.Translator(_c1.text)"></div>
      </div>
    </div>
</template>
<script lang="ts" setup>
import { reactive,defineEmits,defineProps } from 'vue';
interface SelectorItem{
    text:string,
    icon:string,
    value:any
}
const nowSelecting=reactive([]);
let LastIn=-1;
const _gprop=defineProps({
    selectorProps:{
        type:Array,
        default: ()=>{return []},
    },
    maxAllowSelection:{
        type:Number,
        default:3,
    },
    limitAllowSelection:{
        type:Number,
        default:-1
    },
    Translator:{
        type:Function,
        default:(text:string)=>{return text;}
    }
});
let Selected=0;
const emits=defineEmits<{
    (e:'onSelected',data:any):void,
    (e:'onCanceled',data:any):void
}>()
const NewSelection=(_sitem:SelectorItem,_sindex:number):void=>{
    let _f=false;
    if(!(nowSelecting as Array<boolean>)[_sindex]){
        if((_gprop.limitAllowSelection>0 || LastIn!=-1) || _gprop.limitAllowSelection==-1){
            
            emits("onSelected",_sitem.value);
            (nowSelecting as Array<boolean>)[_sindex]=true;
            Selected+=1;
            _f=true;
        }
    }else{
        emits("onCanceled",_sitem.value);
        (nowSelecting as Array<boolean>)[_sindex]=false;
        Selected-=1;
        if(LastIn==_sindex) LastIn=-1;
    }
    if(Selected>_gprop.maxAllowSelection && _gprop.limitAllowSelection==-1 && LastIn!=-1){
        emits("onCanceled",(_gprop.selectorProps as Array<SelectorItem>)[LastIn].value);
        (nowSelecting as Array<boolean>)[LastIn]=false;
        Selected-=1;
        if(Selected==0) LastIn=-1;
    }else if(_gprop.limitAllowSelection!=-1){
        if( _gprop.limitAllowSelection<=0 && LastIn!=-1){
            emits("onCanceled",(_gprop.selectorProps as Array<SelectorItem>)[LastIn].value);
            (nowSelecting as Array<boolean>)[LastIn]=false;
            Selected-=1;
            if(Selected==0) LastIn=-1;
        }
    }
    if(_f) LastIn=_sindex;
}
for(const _ in _gprop.selectorProps){
    (nowSelecting as Array<boolean>).push(false);
}
</script>
<style lang="scss" scoped>
    $BaseMainColor:#1F242B;
    $BaseSecondaryColor:#0046FF;
    $BaseSecondaryColor2:#F91941;
    $BaseSecondaryColor3:#00B1FF;
    $FontColor:lighten($BaseMainColor,40%);
    $FontActive:lighten($BaseMainColor,55%);
    .dys_Selector{
        width: 100%;
        padding-left: 32px;
        padding-right: 32px;
        .dys_Selector_Item{
            transition: all 0.4s;
            width: 100%;
            height: 42px;
            padding: 6px;
            padding-bottom: 6px;
            background-color: lighten($BaseMainColor,10%);
            border-bottom: 1px solid $BaseMainColor;
            color:$FontColor;
            .context{
                flex:1;
                width: 0;
                height: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            svg{
                height: 100%;
                aspect-ratio: 1 / 1;
                padding-right: 12px;
            }
            display: flex;
            justify-content: left;
            align-items: center;
            word-break: keep-all;
            white-space: nowrap;
            font-size: 23px;
            fill: $FontActive;
            &.Selecting{
                background-color: $BaseSecondaryColor3;
                color: lighten($FontColor,100%);
                svg{
                    fill: lighten($FontColor,100%);
                }
            }
        }
    }
</style>