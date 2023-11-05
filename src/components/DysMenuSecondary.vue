<template>
  <div class="dys_Menu">
    <!-- <div class="dys_Menu_Item">
      {{ testprop }}
    </div> -->
    <div class="dys_Menu_Item" v-for="(_c1,_i1) in menuprops" :key="_i1">
      <svg class="_icon" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
        <path :d="_c1._icon"></path>
      </svg>
      <div class="context" v-dompurify-html="$t(_c1._text)"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps,ref } from 'vue';
import { useGameMainStorage } from '@/utils/store';
const {$t} = useGameMainStorage();
const nowSelecting=ref(0);
defineProps({
  menuprops:{
    type:Array,
    default: ()=>{return []}
  }
})
</script>
<style scoped lang="scss">
$BaseMainColor:#1F242B;
$BaseSecondaryColor:#0046FF;
$BaseSecondaryColor2:#F91941;
$BaseSecondaryColor3:#00B1FF;
$BaseSecondaryColor4:#008b7b;
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
