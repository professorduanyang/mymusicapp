<template>
  <div class="singer" ref="singer">
    <Listview :data="map" @fatherComMethod="showSingerDetail" ref="scroll" :refresh="refresh"></Listview>
    <transition name="slide">
      <router-view/>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getSingers} from '../../api/singer.js';
  import Singer from '../../common/js/singer.js';
  import Listview from '../../common/vue/listview.vue';
  import {mapMutations} from 'vuex';//vuex语法糖
  import {myMixin} from '../../common/js/mixin.js'
  const default_length = 10;
  export default {
     mixins:[myMixin],
     data(){
       return {
         map:[],
         refresh:false
       }
     },
     created(){
       this.getHotSingers();
     },
     methods:{
       getHotSingers(){
          getSingers().then((result) => {
             let list = result.data.list.length && result.data.list;
             //console.log(list);
             let map = {hot:[],notHot:[]};
             //默认前10条为hot
             for (let index = 0;index < default_length;index ++) {
                map.hot.push(new Singer(list[index].Fsinger_id,list[index].Fsinger_name,list[index].Fsinger_mid));
             }
             //设置后90条
             let obj = {};
             for (let index = default_length;index < list.length;index ++) {
                //歌手名非字母开头不要
                if (!/[a-zA-Z]/.test(list[index].Findex)) continue;
                if (!obj[list[index].Findex]) {
                   obj[list[index].Findex] = {
                      title:list[index].Findex,
                      items:[]
                   };
                }
                obj[list[index].Findex].items.push(new Singer(list[index].Fsinger_id,list[index].Fsinger_name,list[index].Fsinger_mid));
             }
             //排序(应该有更简单的排序方法)
             //当前字母跟已有的字母依次比较,找到第一个比其靠前的塞到它前面,一个都没有塞到最后一位
             for (let key in obj) {
                var flag = true;
                for (let index = 0;index < map.notHot.length;index ++) {
                   if (obj[key].title < map.notHot[index].title) {
                      map.notHot.splice(index,0,obj[key]);
                      flag = false;
                      break;
                   }
                }
                if (flag) {
                   map.notHot.push(obj[key]);
                }
             }
             let myMap = [];
             myMap.push({title:'热门歌曲',items:map.hot});
             map.notHot.forEach((no) => {
                myMap.push({title:no.title,items:no.items});
             });
             this.map = myMap;
          })
       },
       showSingerDetail(singer){
         const id = parseInt(singer.id);
         this.changeCurrentSinger(singer);
         this.$router.push({
           name:'singerDetail',
           params:{id}
         });
       },
       //重写mixin里的方法
       changeBottom(list){
         const bottom = list.length > 0 ? '40px' : ''
         this.$refs.singer.style.bottom = bottom
         this.refresh = true
       },
       ...mapMutations(['changeCurrentSinger'])
     },
     components:{
       Listview
     }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%,0,0)
</style>

