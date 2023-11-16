<template>
  <div class="dys_Menu">
    <!-- <div class="dys_Menu_Item">
      {{ testprop }}
    </div> -->
    <div class="dys_Menu_Item" v-for="(_c1,_i1) in (menuprops as Record<string,any>)" :key="_i1" :class="{Selecting:(_i1==nowSelecting)}" @click="changeNowSelecting(_i1)">
      <svg class="_icon" v-if="_c1._icon" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
        <path :d="_c1._icon"></path>
      </svg>
      <div class="context" v-dompurify-html="_gprops.Translator(_c1._text)"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps,defineEmits,ref,onUpdated } from 'vue';
const _gprops=defineProps({
  menuprops:{
    type:Array,
    default: ()=>{return []}
  },
  selectingItem:{
    type:Number,
    default:0,
  },
  Translator:{
        type:Function,
        default:(text:string)=>{return text;}
    }
})
const nowSelecting=ref(_gprops.selectingItem);
const emits=defineEmits<{
  (e:"update:selectingItem",data:number):void}>()
const changeNowSelecting=(_index:number)=>{
  nowSelecting.value=_index;
  emits("update:selectingItem",_index);
}
onUpdated(()=>{
  nowSelecting.value=_gprops.selectingItem;
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
$BaseMainColor:#1F242B;
$BaseSecondaryColor:#0046FF;
$BaseSecondaryColor2:#F91941;
$BaseSecondaryColor3:#00B1FF;
$FontColor:lighten($BaseMainColor,40%);
$FontActive:lighten($BaseMainColor,55%);
.dys_Menu{
  &::-webkit-scrollbar{
        display: none;
      }
      width: 100%;
      height: 100%;
      overflow-y: scroll;
      overflow-x: hidden;
      display: flex;
      flex-direction: row;
      justify-content: center;
      .dys_Menu_Item{
        transition: all 0.6s;
        background-color: darken($BaseMainColor,33%);
        .context{
          height: 50%;
          width: 100%;
          white-space: nowrap;
          word-break: keep-all;
          overflow: hidden;
          text-align: center;
        }
        &.Selecting{
          background-color: $BaseMainColor;
          ._icon{
            height: 65% !important;
            aspect-ratio: 1 / 1;
            fill: $FontActive;
          }
          .context{
            height: 0px !important;
            width: 0px !important;
            overflow: hidden;
          }
          
        }
        width: 100%;
        aspect-ratio: 1 / 1;
        padding-top: 8px;
        padding-bottom: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        ._icon{
          height: 50%;
          aspect-ratio: 1 / 1;
          fill: $FontColor;
        }
      }
}
</style>
