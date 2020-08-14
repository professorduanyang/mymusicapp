<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" 
           ref="progressBtn"
           @touchstart.prevent.stop="start"
           @touchmove.prevent.stop="move"
           @touchend="end">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getStylePrefix} from '../js/dom.js'
  const dotWidth = 16 //小圆点宽度16
  const transform = getStylePrefix('transform')
  export default {
    data(){
      return {
        touch:{
          init:false,
          left:0,
          startX:0,
        }
      }
    },
    props:{
      percent:{
        type:Number,
        default:0
      }
    },
    methods:{
      start(e){
        this.touch.init = true //表示开始touch事件了
        this.touch.left = this.$refs.progress.offsetWidth //记录初始时已经播放的位置(绿条的长度),不能写成xxx.style.width,因为会加上px
        this.touch.startX = e.touches[0].pageX //记录点击位置(距离手机屏幕左边的距离)
      },
      move(e){
        if (!this.touch.init) {
          return
        }
        let progressWidth = e.touches[0].pageX - this.touch.startX + this.touch.left
        if (progressWidth <= 0) {
          progressWidth = 0 //最小距离
        }
        if (progressWidth >= this.$refs.progressBar.offsetWidth - dotWidth) {
          progressWidth = this.$refs.progressBar.offsetWidth - dotWidth //最大距离
        }
        this.$refs.progress.style.width = `${progressWidth}px`
        this.$refs.progressBtn.style[transform] = `translate3d(${progressWidth}px,0,0)`
      },
      end(){
        this.touch.init = false
        //松手时计算此时的百分比
        const progressPercent = this.$refs.progress.offsetWidth / this.$refs.progressBar.offsetWidth
        this.$emit('changePercent',progressPercent)
      },
      progressClick(e){
        //直接写e.offsetX会有个bug,当再次点击小圆点时会立即跳到开始处(00:00),因为此时e.offsetX=0
        //const progressWidth = e.offsetX
        const progressWidth = e.pageX - this.$refs.progressBar.offsetLeft
        this.$refs.progress.style.width = `${progressWidth}px`
        this.$refs.progressBtn.style[transform] = `translate3d(${progressWidth}px,0,0)`
        const progressPercent = this.$refs.progress.offsetWidth / this.$refs.progressBar.offsetWidth
        this.$emit('changePercent',progressPercent)
      },
    },
    watch:{
      percent(newV){
        //在拖动时不监听(否则拖着就会回到原位)
        if (newV >= 0 && !this.touch.init) {
          const barTotalWidth = this.$refs.progressBar.offsetWidth - dotWidth
          const progressWidth = barTotalWidth * newV
          this.$refs.progress.style.width = `${progressWidth}px`
          this.$refs.progressBtn.style[transform] = `translate3d(${progressWidth}px,0,0)`
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>