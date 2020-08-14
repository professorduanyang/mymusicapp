import Vue from 'vue'
import Vuex from 'vuex'
import {findSongIndex} from './common/js/util.js'
import storage from 'good-storage' 

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token:'',
    currentSinger:{},//当前选中的歌手信息
    currentDisc:{},//当前disc信息
    topList:{},//排行版信息
    historyList:storage.get('historyList',[]),//搜索历史纪录
    playRecord:storage.get('playRecord',[]),//播放历史记录
    collectList:storage.get('collectList',[]),//收藏列表
    //---播放器信息---
    isPlaying:false,//正在播放
    isFullScreen:false,//全屏显示
    mode:'sequence',//播放顺序
    playList:[],//播放列表
    sequenceList:[],//顺序播放时的列表
    currentIndex:-1,//当前索引
    //-------
  },
  mutations: {
    setToken(state,token){
      state.token = token
    },
  	changeCurrentSinger(state,singer){
  	  state.currentSinger = singer
    },
    changeCurrentDisc(state,disc){
      state.currentDisc = disc
    },
    changeTopList(state,topList){
      state.topList = topList
    },
    changeHistoryList(state,historyList){
      state.historyList = historyList
    },
    changePlayRecord(state,playRecord){
      state.playRecord = playRecord
    },
    changeCollectList(state,collectList){
      state.collectList = collectList
    },
    changeIsPlaying(state,isPlaying){
      state.isPlaying = isPlaying
    },
    changeIsFullScreen(state,isFullScreen){
      state.isFullScreen = isFullScreen
    },
    changeMode(state,mode){
      state.mode = mode
    },
    changePlayList(state,list){
      state.playList = list
    },
    changeSequenceList(state,list){
      state.sequenceList = list
    },
    changeCurrentIndex(state,index){
      state.currentIndex = index
    },
  },
  actions: {
    //点击搜索列表添加到播放/顺序列表
    insertSong({commit,state},song){
      let playList = state.playList.slice(0) //播放列表
      let sequenceList = state.sequenceList.slice(0) //顺序列表
      let currentIndex = state.currentIndex //播放列表的索引(不关注顺序列表的索引)
      let currentSong = playList[currentIndex] //当前播放的歌曲
      //---播放列表---
      let pIndex = findSongIndex(playList,song) //先找找看当前播放列表中有没有即将要插入的这首歌(这步要放在插入之前,否则就没意义了)
      currentIndex++
      playList.splice(currentIndex,0,song) //将歌插入到播放列表当前播放的歌的下一首
      if (pIndex > -1) { //表示当前播放列表中原本就有插入的这首歌,此时需要将原有的歌删除
        if (currentIndex > pIndex) { //插入的歌的索引在原有这首歌的后面
          playList.splice(pIndex,1) //删除原有的歌,当前播放索引向前挪一位
          currentIndex--
        }else { //插入的歌的索引在原有这首歌的前面
          playList.splice(pIndex + 1,1) //由于插入歌的位置在原有的歌之前,导致原有歌所在的索引向后移动了一位
        }
      }
      //---顺序列表---
      let sIndex = findSongIndex(sequenceList,song)
      let currentSequenceIndex = findSongIndex(sequenceList,currentSong)
      currentSequenceIndex++
      sequenceList.splice(currentSequenceIndex,0,song)
      if (sIndex > -1) {
        if (currentSequenceIndex > sIndex) {
          sequenceList.splice(sIndex,1)
        }else {
          sequenceList.splice(sIndex + 1,1)
        }
      }
      //---提交到state中---
      commit('changePlayList',playList)
      commit('changeSequenceList',sequenceList)
      commit('changeCurrentIndex',currentIndex)
      commit('changeIsPlaying',true)
      commit('changeIsFullScreen',true)
    },
    //删除播放列表中某首歌(播放列表和顺序列表都要删,播放列表是当前播放的歌曲顺序,顺序列表是显示在页面列表中的)
    deleteSong({commit,state},song){
      const pIndex = findSongIndex(state.playList,song)
      const sIndex = findSongIndex(state.sequenceList,song)
      let playList = state.playList.slice(0)
      let sequenceList = state.sequenceList.slice(0)
      let currentIndex = state.currentIndex
      playList.splice(pIndex,1) 
      sequenceList.splice(sIndex,1)
      if (pIndex < currentIndex || currentIndex == playList.length) {
        currentIndex--
        if (currentIndex < 0) {
          currentIndex = 0
        }
      }
      commit('changePlayList',playList)
      commit('changeSequenceList',sequenceList)
      commit('changeCurrentIndex',currentIndex)
      const isPlay = state.playList.length ? true : false //没有歌曲的话就不用播了
      commit('changeIsPlaying',isPlay)
    },
    //删除全部播放列表
    deleteAllSongs({commit,state}){
      commit('changePlayList',[])
      commit('changeSequenceList',[])
      commit('changeCurrentIndex',-1)
      commit('changeMode','sequence')
      commit('changeIsPlaying',false)
      commit('changeIsFullScreen',false)
    },
  },
  getters:{
    getCurrentSong(state){
      return state.playList[state.currentIndex] || {}
    }
  }
})
