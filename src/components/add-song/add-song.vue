<template>
  <transition name="slide">
    <div class="add-song" v-show="isShow">
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close">
          <i class="icon-close" @click.stop="hide()"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box ref="searchBox" :placeholder="placeholder" @querySelect="querySelect"></search-box>
      </div>
      <div class="shortcut" v-show="!query.trim().length">
        <switches :titles="titles" :currentTitleIndex="currentTitleIndex" @switches="switches"></switches>
        <div class="list-wrapper">
          <scroll ref="playRecordScroll" :data="playRecord" class="list-scroll" v-show="currentTitleIndex == 0">
             <div class="list-inner">
               <song-list :songs="playRecord" @select="select"></song-list>
             </div>
          </scroll>
          <scroll ref="historyListScroll" :data="historyList" class="list-scroll" v-show="currentTitleIndex == 1">
             <div class="list-inner">
               <search-list @deleteFromList="deleteFromList" @selectItem="selectItem" class="wrapper"></search-list>
             </div>
          </scroll>
        </div>
      </div>
      <div class="search-result" v-show="query.trim().length">
        <suggest :keywords="query" :pageSize="pageSize" @insertIntoList="insertIntoList"></suggest>
      </div>
      <top-tip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">已添加到播放列表</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {saveHistory} from '../../common/js/cache.js'
  import storage from 'good-storage'
  import searchBox from '../../common/search-box/search-box.vue'
  import suggest from '../suggest/suggest.vue'
  import switches from '../../common/switches/switches.vue'
  import songList from '../../common/vue/song-list.vue'
  import searchList from '../../common/search-list/search-list.vue'
  import scroll from '../../common/vue/scroll.vue'
  import topTip from '../../common/top-tip/top-tip.vue'
  import {mapState} from 'vuex'
  import Song from '../../common/js/song.js'
  export default {
    data(){
      return {
        query:'',
        pageSize:30,
        isShow:false,
        placeholder:'请输入搜索内容',
        titles:['最近播放','搜索历史'],
        currentTitleIndex:0,
      }
    },
    watch:{
      //tab标签页切换时scroll需要手动刷新(v-show)
      currentTitleIndex(newV){
        this.$nextTick(() => {
           newV == 0 ? this.$refs.playRecordScroll.refresh() : this.$refs.historyListScroll.refresh()
        })
      },
      query(newV){
        if (newV.trim().length === 0) {
          this.$nextTick(() => {
            this.currentTitleIndex == 0 ? this.$refs.playRecordScroll.refresh() : this.$refs.historyListScroll.refresh()
          })
        }
      }
    },
    computed:{
      ...mapState(['playRecord','historyList'])
    },
    methods:{
      show(){
        this.isShow = true
        //add-song组件显示隐藏切换时手动刷新scroll
        this.$nextTick(() => {
          this.currentTitleIndex == 0 ? this.$refs.playRecordScroll.refresh() : this.$refs.historyListScroll.refresh()
        })
      },
      hide(){
        this.isShow = false
      },
      querySelect(query){
        this.query = query
      },
      insertIntoList(query){
        const list = saveHistory(query) //存入到storage中
        this.$store.commit('changeHistoryList',list) //存入到vuex中
        this.$refs.topTip.show() //显示提示窗
      },
      switches(title,index){
        this.currentTitleIndex = index
      },
      select(song,index){
        this.$store.dispatch('insertSong',new Song(song)) //之前往顺序/播放列表中添加的都是Song实例对象,这里也得是,否则监测不到
      },
      deleteFromList(item){
        let historyList = storage.get('historyList',[])
        let i = historyList.findIndex((content,index) => {
           return content === item
        })
        if (i > -1) {
           var res = historyList.splice(i,1)
        }
        storage.set('historyList',historyList)
        this.$store.commit('changeHistoryList',historyList)
      },
      selectItem(query){
        this.query = query
        this.$refs.searchBox.query = query
      },
    },
    components:{
      searchBox,suggest,switches,songList,searchList,scroll,topTip
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .header
      position: relative
      height: 44px
      text-align: center
      .title
        line-height: 44px
        font-size: $font-size-large
        color: $color-text
      .close
        position: absolute
        top: 0
        right: 8px
        .icon-close
          display: block
          padding: 12px
          font-size: 20px
          color: $color-theme

    .search-box-wrapper
      margin: 20px
    .shortcut
      .list-wrapper
        position: absolute
        top: 165px
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 30px
    .search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
    .tip-title
      text-align: center
      padding: 18px 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        font-size: $font-size-medium
        color: $color-text

  .wrapper
    position: relative
    height: 100%!important
</style>