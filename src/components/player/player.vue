<template>
  <div class="player" v-show="playList.length">
    <!--展开的播放器-->
    <transition 
        name="max"
        @enter="enter"
        @after-enter="afterEnter"
        @before-leave="beforeLeave"
        @leave="leave"
        @after-leave="afterLeave">
      <div class="normal-player" v-show="isFullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="getCurrentSong.image">
        </div>
        <div class="top">
          <div class="back">
            <i class="icon-back" @click="mini()"></i>
          </div>
          <h1 class="title" v-html="getCurrentSong.songname"></h1>
          <h2 class="subtitle" v-html="getCurrentSong.singer"></h2>
        </div>
        <div class="middle"
             @touchstart.prevent="touchstart"
             @touchmove.prevent="touchmove"
             @touchend="touchend">
          <div class="middle-l" ref="middleL">
            <!--做CSS3动画的dom-->
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="rotate">
                <img class="image" :src="getCurrentSong.image">
              </div>
            </div>
            <!--当前播放的歌词-->
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric" v-text="currentLyricTxt"></div>
            </div>
          </div>
          <!--歌词列表-->
          <Scroll ref="scroll" class="middle-r" :data="lyric && lyric.lines">
            <div class="lyric-wrapper">
               <div v-if="lyric">
                 <p ref="lyricP" v-for="(line,index) in lyric.lines" :key="index" class="text" :class="{'current':currentLyricNum == index}">
                   {{ line.txt }}
                 </p>
               </div>
            </div>
          </Scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow == 'cd'}"></span>
            <span class="dot" :class="{'active':currentShow == 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{currentTime | timeFiltter}}</span>
            <div class="progress-bar-wrapper">
              <progressBar :percent="percent" @changePercent="changePercent"></progressBar>
            </div>
            <span class="time time-r">{{getCurrentSong.duration | timeFiltter}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i :class="iconMode" @click="changeMode"></i>
            </div>
            <div class="icon i-left">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center">
              <i :class="iconForNormal" @click="toggle"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon" :class="getFavoriteCls(getCurrentSong)" @click.stop="toggleFavorite(getCurrentSong)"></i>
            </div>
          </div>
         </div>
      </div>
    </transition>
    <!--收起来在底部的播放器-->
    <transition name="mini">
      <div class="mini-player" v-show="!isFullScreen" @click="max()">
        <div class="icon">
          <img width="40" height="40" :class="rotate" :src="getCurrentSong.image">
        </div>
        <div class="text">
          <h2 class="name" v-html="getCurrentSong.songname"></h2>
          <p class="desc" v-html="getCurrentSong.singer"></p>
        </div>
        <div class="control">
          <progressCircle :radius="radius" :percent="percent">
            <i class="icon-mini" :class="iconForMini" @click.stop="toggle"></i>
          </progressCircle>
        </div>
        <div class="control">
          <i class="icon-playlist" @click.stop="showPlaylist"></i>
        </div>
      </div>
    </transition>
    <playlist ref="playlist"></playlist>
    <audio :src="getCurrentSong.url" ref="audio" @play="canplay" @error="error" @timeupdate="update" @ended="end"></audio>
  </div>
</template>

<script>
  import {mapState,mapGetters} from 'vuex'
  import animations from 'create-keyframe-animation'
  import {getStylePrefix} from '../../common/js/dom.js'
  import progressBar from '../../common/vue/progress-bar.vue' //长条形进度条
  import progressCircle from '../../common/vue/progress-circle.vue' //圆形进度条
  import {getLyric} from '../../api/song.js' //获取歌词
  import {Base64} from 'js-base64' //base-64解码
  import Lyric from 'lyric-parser' //歌词解码插件
  import Scroll from '../../common/vue/scroll.vue'
  import playlist from '../playlist/playlist.vue'
  import {getRandom,findSongIndex,debounce} from '../../common/js/util.js'
  import {changePlayModes,collectListLogic} from '../../common/js/mixin.js'
  import {savePlayRecord} from '../../common/js/cache.js'
  const transform = getStylePrefix('transform')
  const transition = getStylePrefix('transition')
  export default {
    mixins:[changePlayModes,collectListLogic],
    data(){
      return {
        canContinuePlay:false, 
        currentTime:0,
        percent:0,
        radius:32,
        lyric:null, //歌词对象(通过lyric-parser插件实例化出来的)
        touch:null,
        currentLyricNum:0, //当前播放的歌词的行数
        currentLyricTxt:'',//当前播放的歌词的内容
        currentShow:'cd',//middle部分当前显示(cd或者歌词)
      }
    },
    created(){
      this.touch = {}
    },
    computed:{
      //定义动画参数
      getParamsInfo(){
         const miniPaddingLeft = 40 //小图标中心距离屏幕左边距离
         const miniPaddingBottom = 30 //小图标中心距离屏幕底部距离
         const normalPaddingTop = 80 //大图标顶端距离顶部距离
         const miniWidth = 40 //小图标宽度
         const normalWidth = window.innerWidth * 0.8 //大图标宽度
         const scale = miniWidth / normalWidth //缩放比例
         return {
           x : - ( window.innerWidth / 2 - miniPaddingLeft ),//横坐标方向移动距离
           y : window.innerHeight - normalPaddingTop - normalWidth / 2 - miniPaddingBottom,//纵坐标方向移动距离
           scale
         }
      },
      //从小图标到大图标动画过程
      animationFromMiniToNormal(){
        let {x,y,scale} = this.getParamsInfo
        //定义动画过程
        return {
          0:{
            transform:`translate3d(${x}px,${y}px,0) scale(${scale})`
          },
          60:{
            transform:`translate3d(0,0,0) scale(${scale})`
          },
          100:{
            transform:`translate3d(0,0,0) scale(1)`
          }
        }
      },
      //从大图标到小图标动画过程
      animationFromNormalToMini(){
        let {x,y,scale} = this.getParamsInfo
        return {
          0:{
            transform:`translate3d(0,0,0) scale(1)`
          },
          100:{
            transform:`translate3d(${x}px,${y}px,0) scale(${scale})`
          }
        }
      },
      //播放/暂停图标
      iconForNormal(){
        return this.isPlaying ? 'icon-pause' : 'icon-play'
      },
      iconForMini(){
        return this.isPlaying ? 'icon-pause-mini' : 'icon-play-mini'
      },
      rotate(){
        return this.isPlaying ? 'play' : 'play pause'
      },
      /*
      以下写到了mixin中
      iconMode(){
        return this.mode == 'sequence' ? 'icon-sequence' : (this.mode == 'loop' ? 'icon-loop' : 'icon-random')
      },
      */
      ...mapState(['isPlaying','isFullScreen','playList','sequenceList','currentIndex','mode']),
      ...mapGetters(['getCurrentSong'])
    },
    methods:{
      showPlaylist(){
        this.$refs.playlist.show()
      },
      mini(){
        this.$store.commit('changeIsFullScreen',false);
      },
      max(){
        this.$store.commit('changeIsFullScreen',true);
      },
      enter(el,done){
        //注册动画效果
        animations.registerAnimation({
          name:'move',
          animation:this.animationFromMiniToNormal,
          presets: {
            duration: 400,// 动画时长
            easing: 'linear'// 动画曲线
          }
        })
        //绑定动画元素
        animations.runAnimation(this.$refs.cdWrapper, 'move', done)
      },
      afterEnter(){
        //解绑
        animations.unregisterAnimation('move')
        this.$refs.cdWrapper.style.animation = ''
      },
      beforeLeave(){},
      leave(el,done){
        animations.registerAnimation({
          name:'out',
          animation:this.animationFromNormalToMini,
          presets: {
            duration: 400,// 动画时长
            easing: 'linear'// 动画曲线
          }
        })
        animations.runAnimation(this.$refs.cdWrapper, 'out', done)
      },
      afterLeave(){
        animations.unregisterAnimation('out')
        this.$refs.cdWrapper.style.animation = ''
      },
      toggle(){
        this.$store.commit('changeIsPlaying',!this.isPlaying)
        this.$nextTick(() => {
          this.isPlaying ? this.$refs.audio.play() : this.$refs.audio.pause()
          //控制歌词是否继续播放
          if (this.lyric) {
            this.lyric.togglePlay()
          }
        })
      },
      //上一首
      prev(){
        if (!this.canContinuePlay) {
          return
        }
        //此时处于播放状态
        this.$store.commit('changeIsPlaying',true)
        if (this.mode == 'loop') {
          this.loop()
          return
        }
        let index = this.currentIndex
        index--
        if (index == -1) {
          index = this.playList.length - 1
        }
        this.$store.commit('changeCurrentIndex',index)
        this.canContinuePlay = false
      },
      //下一首
      next(){
        if (!this.canContinuePlay) {
          return
        }
        this.$store.commit('changeIsPlaying',true)
        if (this.mode == 'loop') {
          this.loop()
          return
        }
        let index = this.currentIndex
        index++
        if (index == this.playList.length) {
          index = 0
        }
        this.$store.commit('changeCurrentIndex',index)
        this.canContinuePlay = false
      },
      //单曲循环
      loop(){
        this.$refs.audio.currentTime = 0
        this.$nextTick(() => {
           this.$refs.audio.play()
           if (this.lyric) {
             this.lyric.seek(0)
           }
        })
      },
      //播放器已经能正常播放
      canplay(){
        this.canContinuePlay = true
        this.$store.commit('changePlayRecord',savePlayRecord(this.getCurrentSong))
      },
      //播放器无法播放时
      error(){
        this.canContinuePlay = true
      },
      //audio播放时间改变时触发
      update(e){
        this.currentTime = e.target.currentTime
        this.percent = this.currentTime / this.getCurrentSong.duration
      },
      changePercent(percent){
        this.$refs.audio.currentTime = this.getCurrentSong.duration * percent
        //如果此时为暂停状态,让其立即播放
        if (!this.isPlaying) {
          this.toggle()
        }
        //实现歌词的进度条变化
        if (this.lyric) {
          this.lyric.seek(this.$refs.audio.currentTime * 1000)
        }
      },
      /*
      以下写到了mixin中
      //改变播放模式
      changeMode(){
        switch(this.mode){
          //点击后变循环播放
          case 'sequence':
            this.$store.commit('changeMode','loop')
            break
          //点击后变随机播放
          case 'loop':
            this.$store.commit('changeMode','random')
            //获取0-9不重复的随机整数
            var arr = getRandom(0,9) 
            var songs = []
            //将有序数组打乱,变成当前的播放列表
            for (var index = 0;index <= 9;index++) {
               songs.push(this.sequenceList[parseInt(arr[index],10)])
            }
            //找到目前播放的歌的序号(否则切换时会改变当前播放的歌)
            this.$store.commit('changeCurrentIndex',this.getCurrentIndex(songs))
            this.$store.commit('changePlayList',songs)
            break
          //点击后变顺序播放
          case 'random':
            this.$store.commit('changeMode','sequence')
            this.$store.commit('changeCurrentIndex',this.getCurrentIndex(this.sequenceList))
            this.$store.commit('changePlayList',this.sequenceList)
            break
          default:
            return
        }
      },
      getCurrentIndex(songs){
        let currentIndex = 0
        songs.forEach((item,index) => {
           if (item.id == this.getCurrentSong.id) {
             currentIndex = index
           }
        })
        return currentIndex
      },
      */
      //audio播放到底时
      end(){
        //如果是循环播放,则让当前audio的播放时间变为0(相当于重新开始播)
        if (this.mode == 'loop') {
           this.$refs.audio.currentTime = 0
           this.$refs.audio.play()
           //单曲循环时,需要在尽头时将歌词重置为开始
           if (this.lyric) {
             this.lyric.seek(0)
           }
        }
        //其他模式直接下一首
        else {
           this.next()
        }
      },
      //歌词切换到下一行时执行的方法
      handleLyric({lineNum,txt}){
        this.currentLyricNum = lineNum
        this.currentLyricTxt = txt
        //播放到超过5行时往上滚动,否则滚到顶就行
        if (lineNum >= 5) { 
          this.$refs.scroll.scrollToElement(this.$refs.lyricP[lineNum-5],1000)
        }else {
          this.$refs.scroll.scrollTo(0,0,1000)
        }
      },
      touchstart(e){
        const touchPoint = e.touches[0]
        this.touch.init = true
        this.touch.startX = touchPoint.pageX
        this.touch.startY = touchPoint.pageY
      },
      touchmove(e){
        if (!this.touch.init) {
          return
        }
        const touchPoint = e.touches[0]
        this.touch.moveX = touchPoint.pageX - this.touch.startX
        this.touch.moveY = touchPoint.pageY - this.touch.startY
        //只支持横向滚动(默认当纵坐标差>横坐标差时,属于纵向滚动)
        if (Math.abs(this.touch.moveY) > Math.abs(this.touch.moveX)) {
          this.touch.scrollY = true //纵向滚动
          return
        }
        this.touch.scrollY = false //非纵向滚动
        this.touch.percent = this.touch.moveX / window.innerWidth //+/-,计算移动的比例
        this.$refs.scroll.$el.style[transition] = '' //清除end时的transition效果
        //左滑动
        if (this.currentShow == 'cd' && this.touch.percent < 0) {
          this.$refs.middleL.style.opacity = 1 - Math.abs(this.touch.percent)
          this.touch.moveX = this.touch.moveX <= -window.innerWidth ? -window.innerWidth : this.touch.moveX
          this.$refs.scroll.$el.style[transform] = `translate3d(${this.touch.moveX}px,0,0)`
        }
        //右滑动
        if (this.currentShow == 'lyric' && this.touch.percent > 0) {
          this.$refs.middleL.style.opacity = Math.abs(this.touch.percent)
          this.touch.moveX = this.touch.moveX >= window.innerWidth ? window.innerWidth : this.touch.moveX
          this.$refs.scroll.$el.style[transform] = `translate3d(${-(window.innerWidth - this.touch.moveX)}px,0,0)`
        }
      },
      touchend(){
        this.$refs.scroll.$el.style[transition] = 'transform 0.3s'
        //左滑动
        if (this.currentShow == 'cd' && this.touch.percent < 0) {
          if (Math.abs(this.touch.percent) < 1/3) {
            this.$refs.middleL.style.opacity = 1
            this.$refs.scroll.$el.style[transform] = `translate3d(0,0,0)`
            this.currentShow = 'cd'
          }else {
            this.$refs.middleL.style.opacity = 0
            this.$refs.scroll.$el.style[transform] = `translate3d(${-window.innerWidth}px,0,0)`
            this.currentShow = 'lyric'
          }
        }
        //右滑动
        if (this.currentShow == 'lyric' && this.touch.percent > 0) {
          if (Math.abs(this.touch.percent) < 1/3) {
            this.$refs.middleL.style.opacity = 0
            this.$refs.scroll.$el.style[transform] = `translate3d(${-window.innerWidth}px,0,0)`
            this.currentShow = 'lyric'
          }else {
            this.$refs.middleL.style.opacity = 1
            this.$refs.scroll.$el.style[transform] = `translate3d(0,0,0)`
            this.currentShow = 'cd'
          }
        }
        this.touch.init = false
      },
      _getLyric(mid){
        getLyric(mid)
        //获取歌词成功时
        .then((result) => {
           const lyricStr = Base64.decode(result.data.lyric) //未格式化的歌词字符串
           /*
           以下加了没用
           //确保当前播放的歌曲的歌词不被多次实例化
           if (this.getCurrentSong.lyricStr != lyricStr) {
             return
           }
           this.$set(this.getCurrentSong,'lyricStr',lyricStr) //动态为当前歌添加歌词字符串属性
           */
           this.lyric = new Lyric(lyricStr,this.handleLyric) //每次播放到下一行时,会调用这个回调函数
           if (this.isPlaying) {
              this.lyric.play() //当处于播放模式时,歌词自动播放(不断切换到下一行,此时会调用上面的handler函数)
           }
        })
        //获取歌词失败时
        .catch(() => {
          this.lyric = null
          this.currentLyricNum = 0
          this.currentLyricTxt = ''
        })
      },
    },
    watch:{
      getCurrentSong(newSong,oldSong){
        //这句代码是切换播放模式时,修改了当前列表和索引,会触发getCurrentSong,但由于依然是当前播放的歌,因此直接返回即可
        if (newSong.id == oldSong.id) return;
        this.$nextTick(() => {
          this.$refs.audio.play()
        })
        //清除掉之前的歌词(否则不同的歌词会混在一起!)
        if (this.lyric) {
          this.lyric.stop()
          this.lyric = null
          this.currentLyricNum = 0
          this.currentLyricTxt = ''
        }
        debounce(() => {
          this._getLyric(newSong.mid)
        },1000)()
      },
      isPlaying(newV){
        this.$store.commit('changeIsPlaying',newV)
        this.$nextTick(() => {
          newV ? this.$refs.audio.play() : this.$refs.audio.pause()
        })
      },
    },
    filters:{
      timeFiltter(val){
        val = Math.floor(val)
        let min = parseInt(val / 60,10)
        min = min >= 10 ? min : `0${min}`
        let sec = val % 60
        sec = sec >= 10 ? sec : `0${sec}`
        return `${min}:${sec}`
      }
    },
    components:{
      progressBar,progressCircle,Scroll,playlist
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 180
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.max-enter-active, &.max-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.max-enter, &.max-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>