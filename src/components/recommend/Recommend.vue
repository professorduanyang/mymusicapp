<template>
  <div class="recommend" ref="recommend">
    <!--关键点:BScroll为什么加在这,而不是直接加在第17行?-->
    <!--因为better-scroll的父盒子必须定宽/定高!第5行的盒子定高100%满足条件-->
    <BScroll ref="scroll" class="recommend-content" :data="hotSongs">
      <div>
        <div class="slider-wrapper">
          <Slider v-if="slidersArr.length">
             <div v-for="(item,index) in slidersArr" :key="index">
                <a :href="item.linkUrl">
                  <!--图片加载事件-->
                  <img :src="item.picUrl" @load="loadImg">
                </a>
             </div>
          </Slider>
        </div> 
        <div class="recommend-list">
          <h1 class="list-title">热门歌曲推荐</h1>
          <ul>
            <li v-for="(song,index) in hotSongs" :key="index" class="item" @click="selectItem(song)">
              <div class="icon">
                <img width="60" height="60" v-lazy="song.imgurl">
              </div>
              <div class="text">
                <h2 class="name" v-html="song.creator.name"></h2>
                <p class="desc" v-html="song.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <template class="loading-container" v-show="isLoading">
        <Loading></Loading>
      </template>
    </BScroll>
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getSlidersAndSongs} from '../../api/recommend.js'
  import {ERR_OK} from '../../api/config.js'
  //加载组件
  import Loading from '../../common/loading/loading.vue'
  //轮播图组件
  import Slider from '../slider/slider.vue'
  //封装的better-scroll组件
  import BScroll from '../../common/vue/scroll.vue'
  //引入mixin
  import {myMixin} from '../../common/js/mixin.js'
  export default {
    mixins:[myMixin],
    data(){
      return {
         slidersArr:[],
         hotSongs:[],
         //首图片是否加载
         load:false,
         //异步请求是否完成
         isLoading:true
      }
    },
    created(){
      this.isLoading = true;
      getSlidersAndSongs().then((result) => {
         //模拟延时(loading图片)
         window.setTimeout(() => {
           if(result[0].status == 200) {
              this.hotSongs = result[0].data.data.list;
           }
           if(result[1].data && result[1].data.slider.length) {
              this.slidersArr = result[1].data.slider;
           }
           this.isLoading = false;
         },1000);
      });
    },
    methods:{
      loadImg(){
        if (!this.load) {
           this.$refs.scroll.refresh();
           this.load = true;
        }
      },
      //重写mixin中的方法
      changeBottom(list){
        const bottom = list.length > 0 ? '60px' : ''
        this.$refs.recommend.style.bottom = bottom
        this.$refs.scroll.refresh()
      },
      selectItem(disc){
        const id = parseInt(disc.dissid)
        this.$store.commit('changeCurrentDisc',disc)
        this.$router.push({
          name:'disc',
          params:{id}
        })
      }
    },
    components:{
      Slider,BScroll,Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable.styl"

  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%,0,0)
  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>