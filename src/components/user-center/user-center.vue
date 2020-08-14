<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back">
        <i class="icon-back" @click.stop="back()"></i>
      </div>
      <div class="switches-wrapper">
        <switches :currentTitleIndex="currentTitleIndex" :titles="titles" @switches="switchItem"></switches>
      </div>
      <div class="list-wrapper" ref="wrapper">
        <scroll ref="collectList" class="list-scroll" :data="collectList" v-show="currentTitleIndex === 0">
          <div class="list-inner">
            <song-list :songs="collectList" @select="selectItem"></song-list>
          </div>
        </scroll>
        <scroll ref="playRecord" class="list-scroll" :data="playRecord" v-show="currentTitleIndex === 1">
          <div class="list-inner">
            <song-list :songs="playRecord" @select="selectItem"></song-list>
          </div>
        </scroll>
      </div>
      <div class="no-result-wrapper" v-show="isShow">
        <no-result :title="title"></no-result>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {myMixin} from '../../common/js/mixin.js'
  import switches from '../../common/switches/switches.vue'
  import scroll from '../../common/vue/scroll.vue'
  import songList from '../../common/vue/song-list.vue'
  import noResult from '../../common/no-result/no-result.vue'
  import Song from '../../common/js/song.js'
  export default {
    mixins:[myMixin],
    data(){
      return {
        currentTitleIndex:0,
        title:'暂无收藏记录',
        titles:['收藏列表','最近播放'],
      }
    },
    methods:{
      switchItem(item,index){
        this.currentTitleIndex = index
      },
      back(){
        this.$router.back()
      },
      selectItem(song,index){
        this.$store.dispatch('insertSong',new Song(song))
      },
      //重写Mixin中方法
      changeBottom(list){
        const bottom = list.length > 0 ? '60px' : ''
        this.$refs.wrapper.style.bottom = bottom
        this.$refs.collectList && this.$refs.collectList.refresh()
        this.$refs.playRecord && this.$refs.playRecord.refresh()
      },
    },
    computed:{
      collectList(){
        return this.$store.state.collectList
      },
      playRecord(){
        return this.$store.state.playRecord
      },
      isShow(){
        if ((this.currentTitleIndex == 0 && this.collectList.length == 0) || (this.currentTitleIndex == 1 && this.playRecord.length == 0)) {
          return true
        }
        else {
          return false
        }
      }
    },
    watch:{
      currentTitleIndex(newV){
        newV == 0 ? this.title = '暂无收藏记录' : this.title = '暂无播放记录'
        //v-show的元素需要重新计算高度(点击tab标签页切换时)
        this.$nextTick(() => {
          this.$refs.collectList.refresh()
          this.$refs.playRecord.refresh()
        })
      }
    },
    components:{
      switches,scroll,songList,noResult
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"

  .user-center
    position: fixed
    top: 0
    bottom: 0
    z-index: 100
    width: 100%
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .switches-wrapper
      margin: 60px 0 20px 0
    .play-btn
      box-sizing: border-box
      width: 135px
      padding: 7px 0
      margin: 0 auto
      text-align: center
      border: 1px solid  $color-text-l
      color: $color-text-l
      border-radius: 100px
      font-size: 0
      .icon-play
        display: inline-block
        vertical-align: middle
        margin-right: 6px
        font-size: $font-size-medium-x
      .text
        display: inline-block
        vertical-align: middle
        font-size: $font-size-small
    .list-wrapper
      position: absolute
      top: 110px
      bottom: 0
      overflow: hidden
      width: 100%
      .list-scroll
        height: 100%
        overflow: hidden
        .list-inner
          padding: 20px 30px
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>