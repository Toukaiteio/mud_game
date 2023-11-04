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
    </div>
  </div>
  <!-- 
    to_do_list:
    -为自定义function接口增加参数设定功能，参数只能接受字符串和数和布尔姓值，在function_event中通过#$参数名，访问
    X 增加通过ID访问npc对象的接口
    为npc增加事件池与Common事件池
    为npc能加Action功能，功能参照地点functions属性
    增加自定义菜单内容的接口
    增加自定义窗口内容的接口
figure_out
    通过特定变量控制npc事件池
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
  }

}
</style>
