<template>
  <div class="music-list">
    <div class="back">
      <i class="icon-back" @click="goBack()"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image">
      <div class="play-wrapper">
       <div class="play">
         <i class="icon-play"></i>
         <span class="text" @click="randomPlay">随机播放全部</span>
       </div>
      </div>
      <div class="filter" style="background-size:cover;" :style="bgImg" ref="myImg"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <Scroll :data="songs" :probeType="probeType" :listenScroll="listenScroll" class="list" ref="myScroll" @myscroll="scroll">
      <div class="song-list-wrapper">
        <songList :songs="songs" :rank="rank" @select="selectItem"></songList>
      </div>
      <div class="loading-container" v-show="isShow">
        <Loading/>
      </div>
    </Scroll>
  </div>
</template>

<script>
  const toTopHeight = 34 //定义遮罩层距离顶部的最小距离
  import Scroll from './scroll.vue'
  import songList from './song-list.vue'
  import Loading from '../loading/loading.vue'
  import {getStylePrefix} from '../js/dom.js' //专门用于判断当前浏览器,为CSS3样式添加前缀
  import {getRandom} from '../js/util.js'
  import {mapState,mapGetters} from 'vuex'
  import {myMixin} from '../js/mixin.js'
  const transform = getStylePrefix('transform')
  export default {
    mixins:[myMixin],
    created() {
      this.probeType = 3
      this.listenScroll = true
    },
    data(){
      return {
        scrollY:-1
      }
    },
    props:{
      bgImage:{
        type:String,
        default:''
      },
      title:{
        type:String,
        default:''
      },
      songs:{
        type:Array
      },
      isShow:{
        type:Boolean,
        default:true
      },
      rank:{
        type:Boolean,
        default:false
      }
    },
    methods:{
      scroll(pos){
        this.scrollY = pos.y;//随时记录滚动的位置
      },
      goBack(){
        this.$router.back();
      },
      selectItem(song,index){
        this.$store.commit('changePlayList',this.songs)
        this.$store.commit('changeSequenceList',this.songs)
        this.$store.commit('changeIsPlaying',true)
        this.$store.commit('changeIsFullScreen',true)
        this.$store.commit('changeCurrentIndex',index)
      },
      randomPlay(){
        this.$store.commit('changeMode','random')
        const randomArr = getRandom(0,9)
        let songsArr = []
        //获取随机播放列表
        for (let index = 0; index <= 9; index++) {
           songsArr.push(this.songs[parseInt(randomArr[index],10)])
        }
        //获取当前播放的音乐在新列表中的索引(例如当前顺序播放,突然点击随机播放全部的按钮),如果索引为-1说明当前没播放歌曲(直接点击的按钮),那就播放第一首
        let index = this.getCurrentIndex(songsArr)
        if (index == -1) {index = 0}
        this.$store.commit('changePlayList',songsArr)
        this.$store.commit('changeSequenceList',this.songs)
        this.$store.commit('changeIsPlaying',true)
        this.$store.commit('changeIsFullScreen',true)
        this.$store.commit('changeCurrentIndex',index)
      },
      getCurrentIndex(songs){
        return songs.findIndex(song => {
           return song.id == this.getCurrentSong.id
        })
      },
      //重写mixin中的方法
      changeBottom(list){
        const bottom = list.length > 0 ? '40px' : ''
        this.$refs.myScroll.$el.style.bottom = bottom
        this.$refs.myScroll.refresh()
      }
    },
    watch:{
      scrollY(newV){
        const mostScrollDistance = this.imgHeight - toTopHeight;//遮罩层向上滚动最大距离
        //向上滚动且超过滚动上限
        if (newV < 0 && Math.abs(newV) >= mostScrollDistance) {
          this.$refs.myImg.style.height = `${toTopHeight}px`;
          this.$refs.myImg.style.zIndex = 10;
          return;
        }
        //向下滚动
        if (newV > 0) {
          const percent = 1 + newV / this.imgHeight;
          this.$refs.myImg.style[transform] = `scale(${percent})`;
          this.$refs.myImg.style.zIndex = 10;
          return;
        }
        //向上滚动且未超过滚动上限
        this.$refs.myImg.style[transform] = 'scale(1)';
        this.$refs.myImg.style.height = `${this.imgHeight}px`;
        this.$refs.myImg.style.zIndex = -1;
        this.$refs.layer.style[transform] = `translate3d(0,${newV}px,0)`;
      }
    },
    mounted(){
      //尽量减少频繁操作DOM,因此用变量接收
      this.imgHeight = this.$refs.myImg.offsetHeight
      this.scrollDOM = this.$refs.myScroll.$el
      this.scrollDOM.style.top = `${this.imgHeight}px`
    },
    computed:{
      bgImg(){
        return `background-image:url(${this.bgImage})`;
      },
      ...mapState(['isPlaying','isFullScreen','playList','sequenceList','currentIndex','mode']),
      ...mapGetters(['getCurrentSong'])
    },
    components:{
      Scroll,
      songList,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../stylus/variable"
  @import "../stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
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
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
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
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>