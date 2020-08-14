<template>
  <div class="search" v-show="!isFullScreen">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" :placeholder="placeholder" @querySelect="querySelect"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query.trim().length">
      <div class="shortcut">
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li class="item" v-for="(hotkey,index) in hotKeys" :key="index" v-text="hotkey.k" @click="selectItem(hotkey.k)"></li>
          </ul>
        </div>
        <div class="search-history" v-show="historyList.length">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear" @click="clear">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <search-list @selectItem="selectItem" @deleteFromList="deleteFromList" :query="query"></search-list>
          <confirm :confirmText="confirmText" :affirmBtnName="affirmBtnName" :isShow="isShow" @cancel="cancel" @affirm="affirm"></confirm>
        </div>
      </div>
    </div>
    <div ref="searchResult" class="search-result" v-show="query.trim().length">
      <suggest ref="suggest" :keywords="query" :pageSize="pageSize" @insertIntoList="insertIntoList"></suggest>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import searchBox from '../../common/search-box/search-box.vue'
  import suggest from '../suggest/suggest.vue'
  import searchList from '../../common/search-list/search-list.vue'
  import {searchForHotKeys} from '../../api/search.js'
  import {saveHistory} from '../../common/js/cache.js'
  import storage from 'good-storage'
  import {mapState} from 'vuex'
  import {myMixin} from '../../common/js/mixin.js'
  import confirm from '../../common/confirm/confirm.vue'
  export default {
    mixins:[myMixin],
    created(){
      this._searchForHotKeys()
    },
    components:{
      searchBox,suggest,searchList,confirm,
    },
    data(){
      return {
        placeholder:'热门歌曲搜索',
        query:'',//关键字
        pageSize:30,//每页条数
        hotKeys:[],//显示的前10条热搜
        isShow:false,//弹窗默认隐藏
        confirmText:'确定删除所有历史数据吗',
        affirmBtnName:'清除'
      }
    },
    methods:{
      _searchForHotKeys(){
        searchForHotKeys().then(res => {
          if (res.data.hotkey.length) {
            this.hotKeys = res.data.hotkey.slice(0,10)
          }
        }) 
      },
      selectItem(query){
        this.$refs.searchBox.query = query
      },
      querySelect(query){
        this.query = query
      },
      insertIntoList(query){
        const list = saveHistory(query) //存入到storage中
        this.$store.commit('changeHistoryList',list) //存入到vuex中
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
      clear(){
        this.isShow = true
      },
      cancel(){
        this.isShow = false
      },
      affirm(){
        this.isShow = false
        storage.remove('historyList')
        this.$store.commit('changeHistoryList',[])
      },
      //重写mixin里的方法
      changeBottom(list){
        const bottom = list.length ? '60px' : ''
        this.$refs.searchResult.style.bottom = bottom
        this.$refs.suggest.myRefresh()
      },
    },
    computed:{
      ...mapState(['historyList','isFullScreen'])
    },
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable.styl"
  @import "../../common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      z-index :200
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>