<template>
  <div class="rank" ref="rank">
    <Scroll class="toplist" ref="scroll">
      <ul>
        <li v-for="(item,index) in topList" class="item" :key="index" @click="selectItem(item)">
          <div class="icon">
            <img width="100" height="100" v-lazy="item.picUrl">
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song,i) in item.songList" :key="i">
              <span>{{ i+1 }}</span>
              <span>{{ song|myFilter }}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!topList.length">
        <Loading></Loading>
      </div>
    </Scroll>
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getTopList} from '../../api/rank.js'
  import Scroll from '../../common/vue/scroll.vue'
  import Loading from '../../common/loading/loading.vue'
  import {myMixin} from '../../common/js/mixin.js'
  import {mapState} from 'vuex'
  export default {
    mixins:[myMixin],
    created(){
      setTimeout(() => {
        this._getTopList()
      },1000)
    },
    data(){
      return {
        topList:[]
      }
    },
    methods:{
      _getTopList(){
        getTopList().then(result => {
          this.topList = result.data.topList
        }) 
      },
      //重写mixin里方法
      changeBottom(){
        const bottom = this.playList.length > 0 ? '60px' : ''
        this.$refs.rank.style.bottom = bottom
        this.$refs.scroll.refresh()
      },
      selectItem(item){
        this.$store.commit('changeTopList',item)
        this.$router.push({
          name:'topList',
          params:{
            id:parseInt(item.id)
          }
        })
      }
    },
    filters:{
      myFilter(song){
        return `${song.songname}--${song.singername}`
      }
    },
    computed:{
      ...mapState(['playList'])
    },
    components:{
      Scroll,Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"
  
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)

  .rank
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .toplist
      height: 100%
      overflow: hidden
      .item
        display: flex
        margin: 0 20px
        padding-top: 20px
        height: 100px
        &:last-child
          padding-bottom: 20px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .song
            no-wrap()
            line-height: 26px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>