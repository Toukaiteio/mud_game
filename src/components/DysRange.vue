<template>
    <div class="dys_Range">
        <div class="dys_Range_Item arrow Left" @click="prevValue()">
            &lt;
        </div>
        <div class="dys_Range_Item" v-for="(_c1,_i1) in ValueState" :key="`${_i1}-Range`" :class="{Selecting:_c1==_gprop.nowNumber}" @click="setValueTo(_c1);">
            {{ _c1 }}
        </div>
        <div class="dys_Range_Item arrow Right" @click="nextValue()">
            >
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref,defineEmits,defineProps } from 'vue';
const _gprop=defineProps({
    minRange:{
        type:Number,
        default: -3,
    },
    maxRange:{
        type:Number,
        default:3,
    },
    gap:{
        type:Number,
        default:1
    },
    nowNumber:{
        type:Number,
        default:0,
    },
    Translator:{
        type:Function,
        default:(text:string)=>{return text;}
    }
});

const ValueState=ref((()=>{
    const _vA=[];
    for(let i=_gprop.minRange;i<=_gprop.maxRange;i+=_gprop.gap) _vA.push(i>_gprop.maxRange?_gprop.maxRange:i);
    return _vA})() || [0])
// console.log(ValueState);
let nowValPos=ValueState.value.indexOf(_gprop.nowNumber);
const emits=defineEmits<{
    (e:'update:nowNumber',data:number):void,
}>()
const setValueTo=(val:number)=>{
    nowValPos=ValueState.value.indexOf(val);
    emits("update:nowNumber",val);
}
const nextValue=()=>{
    if(nowValPos+1<ValueState.value.length){
        nowValPos+=1;
        emits("update:nowNumber",ValueState.value[nowValPos]);
    }
}
const prevValue=()=>{
    if(nowValPos-1>=0){
        nowValPos-=1;
        emits("update:nowNumber",ValueState.value[nowValPos]);
    }
}
</script>
<style lang="scss" scoped>
    $BaseMainColor:#1F242B;
    $BaseSecondaryColor:#0046FF;
    $BaseSecondaryColor2:#F91941;
    $BaseSecondaryColor3:#00B1FF;
    $FontColor:lighten($BaseMainColor,40%);
    $FontActive:lighten($BaseMainColor,55%);
    .dys_Range{
        height: 100%;
        width: 100%;
        display: inline-flex;
        border: 1px solid black;
        .dys_Range_Item{
            width:100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.4s;
            border:4px solid transparent;
            font-size: 24px;
            font-weight: bolder;
            background-color: lighten($BaseMainColor,10%);
            color: $FontColor;
            &.Selecting{
                border: 4px solid $BaseSecondaryColor3;
                color: lighten($FontColor,100%);
            }
            &.arrow{
                color: lighten($FontColor,100%);
                &.Left{
                    border-right:2px solid $BaseMainColor; 
                }
                &.Right{
                    border-left:2px solid $BaseMainColor; 
                }
            }
        }
    }
</style>