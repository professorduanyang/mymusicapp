<template>
  <div class="progress-circle">
    <!--viewBox是视口的区域,0 0是左上角坐标,拉到100 100这块区域,width height是svg实际显示的大小-->
    <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <!--r是半径,cx,cy是圆心-->
      <!--第一个圆是外面那层完整的整圆背景进度条,第二个圆是随着播放进度逐渐增加的绿条-->
      <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent"/>
      <circle class="progress-bar" r="50" cx="50" cy="50" 
              fill="transparent" 
              :stroke-dasharray="dashArray"
              :stroke-dashoffset="dashOffset"/>
    </svg>
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props:{
      radius:{
        type:Number,
        default:100
      },
      percent:{
        type:Number,
        default:0
      }
    },
    computed:{
      dashArray(){
        return Math.PI * 100
      },
      dashOffset(){
        return (1 - this.percent) * this.dashArray
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../stylus/variable"

  .progress-circle
    position: relative
    circle
      stroke-width: 8px
      transform-origin: center
      &.progress-background
        transform: scale(0.9)
        stroke: $color-theme-d
      &.progress-bar
        transform: scale(0.9) rotate(-90deg)
        stroke: $color-theme
</style>