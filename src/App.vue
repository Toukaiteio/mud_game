<template>
  <div class="mobile" @contextmenu.prevent>
    <div class="MainWrapper">
      <div class="Displayer">
          <router-view v-slot="{ Component }">
            <transition name="fade">
              <component :is="Component" />
            </transition>
          </router-view>
      </div>
      <div class="Menu">
        <DysMenu :menuprops="MenuElement" v-model:selecting-item="Global_BasicPlayerData.MenuSelecting" ></DysMenu>
      </div>
      <div class="SecondaryMenu" :class="{PopUp:Global_BasicPlayerData.MenuSelecting>0,Hidden:Global_BasicPlayerData.MenuSelecting==0}">
        <!-- Display menu in column -->
        <div class="MenuContainer">

        </div>
      </div>
    </div>
  </div>
  <!-- 
    I'm going to fall asleep.
   -->
</template>
<script lang="ts" setup>
import DysMenu from './components/DysMenu.vue';
import { useGameMainStorage } from './utils/store';
const { MenuElement,Global_BasicPlayerData }=useGameMainStorage();
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
    .SecondaryMenu{
      height: 100%;
      width: 100%;
      padding-right: 140px;
      padding-bottom: 55px;
      transition: background 0.6s;
      position: absolute;
      top: 0;
      left: 0;
      pointer-events: none;
        user-select: none;
      .MenuContainer{
        width: 100%;
        height: 100%;
        position: relative;
        background-color: lighten($color: $BaseMainColor, $amount: 0.15);
        border-right: 1px solid $BaseSecondaryColor4;
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
        overflow: hidden;
        transition: transform 0.6s,opacity 1s;
      }
      &.Hidden{
        background: transparent;
        // left: -110%;
        .MenuContainer{
          transform: translateX(-110%);
          pointer-events: none;
          user-select: none;
          opacity: 0;
        }
      }
      &.PopUp{
        background: transparentize($color: $BaseMainColor, $amount: 0.8);
        .Menu{
          transform: translateX(0%);
        }
      }
    }
  }

}
</style>
