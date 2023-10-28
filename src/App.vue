<template>
  <div class="mobile">
    <div class="MainWrapper">
      <div class="Displayer">
        <router-view></router-view>
      </div>
      <div class="Menu">
        <DysMenu :menuprops="MenuElement"></DysMenu>
      </div>
    </div>
  </div>

</template>
<script lang="ts" setup>
import { ref } from 'vue';
import DysMenu from './components/DysMenu.vue';
import { useGameMainStorage } from '@/utils/store';
const { $t }=useGameMainStorage();
const MenuElement=ref([
  {
    _icon:"M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z",
    target:"./",
    _text:$t("_tab_create_character")
  },
])
</script>
<style lang="scss">
$BaseMainColor:#1F242B;
$BaseSecondaryColor:#0046FF;
$BaseSecondaryColor2:#F91941;
$BaseSecondaryColor3:#00B1FF;
$BaseSecondaryColor4:#29d69c;
$FontColor:lighten($BaseMainColor,40%);
$FontActive:lighten($BaseMainColor,55%);
$TabBarHeight:55px;
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Times New Roman', Times, serif;
}
.InputerWrapper{
  input.GameInputer{
    outline: none;
    border: none;
    height: 30px;
    font-size: 22px;
    color: $FontColor;
    background-color: $BaseMainColor;
    border-bottom: 4px solid mix($BaseMainColor,$BaseSecondaryColor);
    transition: all 0.6s;
    font-weight: bolder;
  }
  input.GameInputer:focus{
    border-bottom: 4px solid lighten($BaseSecondaryColor,10%);
  }
  .InfoContent{
    text-align: left;
    height: 14px;
    width: 100%;
  }
  &.error{
    input.GameInputer{
      border-bottom: 4px solid $BaseSecondaryColor2;
    }
    .InfoContent{
      color: $BaseSecondaryColor2;
    }
  }
  &.success{
    input.GameInputer{
      border-bottom: 4px solid $BaseSecondaryColor4;
    }
    .InfoContent{
      color: $BaseSecondaryColor4;
    }
  }
}

.mobile{
  .MainWrapper{
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    background-color: $BaseMainColor;
    color: $FontColor;
    .Menu{
      border-top: 2px solid mix($BaseMainColor,$BaseSecondaryColor);
      border-left: 2px solid mix($BaseMainColor,$BaseSecondaryColor);
      border-right: 2px solid mix($BaseMainColor,$BaseSecondaryColor);
      position: fixed;
      width: 100%;
      height: $TabBarHeight;
      border-top-right-radius: 12px;
      border-top-left-radius: 12px;
      overflow: hidden;
      bottom: 0;
      left: 0;
    }
    .Displayer{
      width: 100%;
      height: 0;
      flex: 1;
      padding-bottom: $TabBarHeight;
      overflow-y: scroll;
      overflow-x: none;
      &::-webkit-scrollbar{
        display: none;
      }
    }
  }

}
</style>
