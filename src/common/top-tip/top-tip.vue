<template>
  <transition name="drop">
    <div class="top-tip" v-show="isShow" @click.stop="hide()">
      <slot></slot>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    data(){
      return {
        isShow:false
      }
    },
    methods:{
      show(){
        this.isShow = true
        if (this.timer) {
          clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
          this.isShow = false
        },2000)
      },
      hide(){
        this.isShow = false
      },
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../stylus/variable"

  .top-tip
    position: fixed
    top: 0
    width: 100%
    z-index: 9999
    background: $color-dialog-background
    &.drop-enter-active, &.drop-leave-active
      transition: all 0.3s
    &.drop-enter, &.drop-leave-to
      transform: translate3d(0, -100%, 0)
</style>