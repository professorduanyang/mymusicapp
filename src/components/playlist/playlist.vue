<template>
  <transition name="list-fade">
    <div class="playlist" v-show="isShow" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click="changeMode()"></i>
            <span class="text">{{ modeName }}</span>
            <span class="clear" @click.stop="clear"><i class="icon-clear"></i></span>
          </h1>
        </div>
        <confirm :confirmText="confirmText" :affirmBtnName="affirmBtnName" :isShow="confirmIsShow" 
                 @affirm="affirm" @cancel="cancel">
        </confirm>
        <add-song ref="addSong"></add-song>
        <scroll ref="scroll" :data="playList" class="list-content" :scrollDelay="scrollDelay">
          <transition-group name="list" tag="ul">
            <li ref="myli" class="item" v-for="(item,index) in sequenceList" :key="item.id" @click.stop="playThisSong(index)">
              <i class="current" :class="getCurrent(item)"></i>
              <span class="text">{{ item.songname }}</span>
              <span class="like" @click.stop="toggleFavorite(item)">
                <i :class="getFavoriteCls(item)"></i>
              </span>
              <span class="delete" @click.stop="deleteSong(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add">
            <i class="icon-add"></i>
            <span class="text" @click="addSong">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close">
          <span @click="hide()">关闭</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapState,mapGetters} from 'vuex'
  import scroll from '../../common/vue/scroll.vue'
  import confirm from '../../common/confirm/confirm.vue'
  import addSong from '../add-song/add-song.vue'
  import {findSongIndex} from '../../common/js/util.js'
  import {changePlayModes,collectListLogic} from '../../common/js/mixin.js'
  export default {
    mixins:[changePlayModes,collectListLogic],
    data(){
      return {
        isShow:false,
        confirmText:'是否清空播放列表',
        affirmBtnName:'清除',
        confirmIsShow:false,
        scrollDelay:300
      }
    },
    methods:{
      hide(){
        this.isShow = false
      },
      show(){
        this.isShow = true
        this.$nextTick(() => {
           this.$refs.scroll.refresh() //dom结构更新
           this.scrollToCurrentSong() //滚动到当前位置
        })
      },
      getCurrent(song){
        if (song.id === this.getCurrentSong.id) {
           return 'icon-play'
        }
      },
      playThisSong(index){
        this.$store.commit('changeCurrentIndex',index)
        this.$store.commit('changeIsPlaying',true)
      },
      scrollToCurrentSong(){
        const index = parseInt(findSongIndex(this.sequenceList,this.getCurrentSong),10)
        this.$refs.scroll.scrollToElement(this.$refs.myli[index],500)
      },
      deleteSong(song){
        this.$store.dispatch('deleteSong',song)
      },
      clear(){
        this.confirmIsShow = true
      },
      cancel(){
        this.confirmIsShow = false
      },
      affirm(){
        this.confirmIsShow = false
        this.$store.dispatch('deleteAllSongs')
      },
      addSong(){
        this.$refs.addSong.show()
      },
    },
    computed:{
      ...mapState(['mode','playList','sequenceList','currentIndex']),
      ...mapGetters(['getCurrentSong'])
    },
    watch:{
      getCurrentSong(newV,oldV){
        if (!this.isShow || newV.id === oldV.id) {
          return
        }
        setTimeout(() => {
          this.scrollToCurrentSong()
        },20)
      }
    },
    components:{
      scroll,confirm,addSong
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 30px
            color: $color-theme-d
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s
          &.list-enter, &.list-leave-to
            height: 0
          .current
            flex: 0 0 20px
            width: 20px
            font-size: $font-size-small
            color: $color-theme-d
          .text
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            color: $color-text-d
          .like
            extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            font-size: $font-size-small
            color: $color-theme
      .list-operate
        width: 140px
        margin: 20px auto 30px auto
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid $color-text-l
          border-radius: 100px
          color: $color-text-l
          .icon-add
            margin-right: 5px
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 50px
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
</style>