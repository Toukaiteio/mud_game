<template>
  <div class="dys_Menu">
    <!-- <div class="dys_Menu_Item">
      {{ testprop }}
    </div> -->
    <div class="dys_Menu_Item" v-for="(_c1,_i1) in menuprops" :key="_i1" :class="{Selecting:(_i1==nowSelecting)}" @click="nowSelecting=_i1;">
      <svg class="_icon" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
        <path :d="_c1._icon"></path>
      </svg>
      <div class="context">{{ _c1._text }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps,ref } from 'vue';
const nowSelecting=ref(0);
defineProps({
  menuprops:{
    type:Array,
    default: ()=>{return []}
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
$BaseMainColor:#FFFFFF;
$BaseSecondaryColor:#f27bff;
$FontColor:darken($BaseMainColor,55%);
$FontActive:darken($BaseMainColor,40%);
.dys_Menu{
  &::-webkit-scrollbar{
        display: none;
      }
      width: 100%;
      height: 100%;
      border-right: 1px solid $FontColor;
      overflow-y: scroll;
      overflow-x: hidden;
      display: flex;
      flex-direction: row;
      justify-content: center;
      .dys_Menu_Item{
        transition: all 0.6s;
        .context{
          height: 0px;
          width: 0px;
          overflow: hidden;
        }
        &.Selecting{
          background-color: lighten($BaseMainColor,100%);
          border-radius: 6px;
          ._icon{
            height: 50% !important;
            aspect-ratio: 1 / 1;
            fill: $FontActive;
          }
          .context{
            height: 50% !important;
            width: 100% !important;
            white-space: nowrap;
            word-break: keep-all;
            overflow: hidden;
            text-align: center;
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
          height: 65%;
          aspect-ratio: 1 / 1;
          fill: $FontColor;
        }
      }
}
</style>
