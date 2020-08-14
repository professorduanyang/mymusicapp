import {mapState,mapGetters} from 'vuex'
import {findSongIndex,getRandom} from './util.js'
import {saveCollectList,deleteFromCollectList} from './cache.js'
import storage from 'good-storage'

//有mini播放器时改变dom底部高度
export const myMixin = {
  //dom加载完毕
  mounted(){
    this.changeBottom(this.playList)
  },
  //组件被激活(keep-alive)
  activated(){
    this.changeBottom(this.playList)
  },
  watch:{
    playList(newV){
      this.changeBottom(newV)
    }
  },
  methods:{
    changeBottom(){
      throw new Error('请重写该方法')
    }
  },
  computed:{
    ...mapState(['playList'])
  }
}

//切换播放模式
export const changePlayModes = {
  computed:{
    //播放模式图标
    iconMode(){
      return this.mode == 'sequence' ? 'icon-sequence' : (this.mode == 'loop' ? 'icon-loop' : 'icon-random')
    },
    modeName(){
      return this.mode == 'sequence' ? '顺序播放' : (this.mode == 'loop' ? '循环播放' : '随机播放')
    },
    ...mapGetters(['getCurrentSong']),
    ...mapState(['mode','sequenceList'])
  },
  methods:{
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
          var max = this.sequenceList.length - 1
          var arr = getRandom(0,max) 
          var songs = []
          //将有序数组打乱,变成当前的播放列表
          for (var index = 0;index <= max;index++) {
             songs.push(this.sequenceList[parseInt(arr[index],10)])
          }
          //找到目前播放的歌的序号(否则切换时会改变当前播放的歌)
          this.$store.commit('changeCurrentIndex',findSongIndex(songs,this.getCurrentSong))
          this.$store.commit('changePlayList',songs)
          break
        //点击后变顺序播放
        case 'random':
          this.$store.commit('changeMode','sequence')
          this.$store.commit('changeCurrentIndex',findSongIndex(this.sequenceList,this.getCurrentSong))
          this.$store.commit('changePlayList',this.sequenceList)
          break
        default:
          return
      }
    },
  }
}

//收藏列表相关的逻辑
export const collectListLogic = {
  methods:{
    getFavoriteCls(song){
      return this.isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite'
    },
    toggleFavorite(song){
      let collectList = []
      if (this.isFavorite(song)) {
        collectList = deleteFromCollectList(song)
      }else {
        collectList = saveCollectList(song)
      }
      this.$store.commit('changeCollectList',collectList)
    },
    isFavorite(song){
      const index = this.collectList.findIndex(item => {
         return item.id === song.id
      })
      return index > -1 //此时表示找到了
    },
  },
  computed:{
    ...mapState(['collectList'])
  }
}