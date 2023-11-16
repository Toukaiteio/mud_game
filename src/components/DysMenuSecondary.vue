<template>
  <div class="dys_Menu">
    <div v-for="(_c1,_i1) in (menuprops as Record<string,any>)" class="ItemWrapper" :key="_i1">
      <div class="dys_Menu_Item" v-if="!_c1['type'] || _c1['type']=='MenuItem'">
        <svg class="_icon" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
          <path :d="_c1.icon"></path>
        </svg>
        <div class="context" v-dompurify-html="_props.Translator(_c1.text)"></div>
      </div>
      <div class="dys_Text_Box" v-if="_c1['type']=='TextBox'">
        <div class="context" v-dompurify-html="_props.Translator(_c1.text)"></div>
      </div>
      <div class="dys_Tag_Box" v-if="_c1['type']=='TagBox' && _c1['tags']">
        <div class="title" v-if="_c1['title']" v-dompurify-html="_props.Translator(_c1['title'])"> </div>
        <div class="context">
          <div class="tag-item" v-for="(tagitem,tagindex) in _c1['tags']" :key="`Tag-${tagindex}`" v-dompurify-html="_props.Translator(tagitem)"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
const _props=defineProps({
  menuprops:{
    type:Array,
    default: ()=>{return []}
  },
  Translator:{
    type:Function,
    default: (text:string)=>{return text;}
  }
})
</script>
<style scoped lang="scss">
$BaseMainColor:#1F242B;
$BaseSecondaryColor:#0046FF;
$BaseSecondaryColor2:#F91941;
$BaseSecondaryColor3:#00B1FF;
$BaseSecondaryColor4:#008b7b;
$BaseSecondaryColor5:#90aa00;
$FontColor:lighten($BaseMainColor,40%);
$FontActive:lighten($BaseMainColor,55%);

.dys_Menu{
  padding-top: 22px;
  padding-bottom: 22px;
  &::-webkit-scrollbar{
        display: none;
      }
      width: 100%;
      height: 100%;
      border-right: 1px solid $FontColor;
      overflow-y: scroll;
      overflow-x: hidden;
      display: flex;
      flex-direction: column;
      .ItemWrapper{
        width: 100%;
      }
      .dys_Tag_Box{
        width: 100%;
        font-size: 12px;
        border: 2px dashed $BaseSecondaryColor3;
        .title{
          width: 100%;
          font-size: 14px;
          color: $FontActive;
          text-align: center;
        }
        .context{
          width: 100%;
          display: flex;
          flex-direction: row;
          // justify-content: space-evenly;
          
          flex-wrap: wrap;
          .tag-item{
            margin-left: 6px;
            color: lighten($BaseMainColor,100%);
            background-color: $BaseSecondaryColor5;
            box-sizing: content-box;
            height: 14px;
            line-height: 14px;
            vertical-align: middle;
            text-align: center;
            padding-left: 3px;
            padding-right: 3px;
            border-radius: 14px;
            overflow: hidden;
            word-break: keep-all;
            white-space: nowrap;
          }
        }
      }
      .dys_Text_Box{
        width: 100%;
        font-size: 18px;
        border: 2px dashed $BaseSecondaryColor4;
        .context{
          width: 100%;
          height: fit-content;
        }
      }
      .dys_Menu_Item{
        padding: 12px;
        transition: all 0.6s;
        ._icon{
            height: 100%;
            aspect-ratio: 1 / 1;
            fill: $FontColor;
        }
        .context{
            height: 100%;
            width: 100%;
            white-space: nowrap;
            line-height: 29px;
            vertical-align: bottom;
            font-size: 18px;
            word-break: keep-all;
            overflow: hidden;
          }
        &.Selecting{
          background-color: lighten($BaseMainColor,20%);
          ._icon{
            fill: $FontActive !important;
          }
          
        }
        width: 100%;
        height: 45px;
        aspect-ratio: 1 / 1;
        padding-top: 8px;
        padding-bottom: 8px;
        display: flex;
        align-items: center;
        background-color: lighten($BaseMainColor,10%);
        justify-content: space-evenly;
      }
}
</style>
