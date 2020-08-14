<template>
  <scroll ref="scroll" class="suggest" :data="result" :pullup="pullup" @pullupEvent="pullupEvent">
   <ul class="suggest-list">
      <li ref="myli" class="suggest-item" v-for="(item,index) in result" :key="index" @click="setIntoList(item)">
        <div class="icon">
          <i :class="getClsIcon(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getContent(item)"></p>
        </div>
      </li>
      <loading v-show="isShow"></loading>
   </ul>
   <no-result :title="title" v-show="!result.length"></no-result>
  </scroll>
</template>

<script>
  import {searchForKeywords} from '../../api/search.js'
  import scroll from '../../common/vue/scroll.vue'
  import loading from '../../common/loading/loading.vue'
  import Song from '../../common/js/song.js'
  import {getInteger} from '../../common/js/util.js'
  import noResult from '../../common/no-result/no-result.vue'

  //歌曲假数据
  const arr = [
    //逆战
    {url:'http://isure.stream.qqmusic.qq.com/C400000kGTyb0yeXbX.m4a?guid=2200175159&vkey=4BFC4F9631437D974EA38E58578B8C3D6A32DC81021226F4D58810530B12107C24561A8DAB0BA07E158D55CDA1FB34949FCE8CB8DE2CBAD6&uin=0&fromtag=66',duration:231},
    //红色高跟鞋
    {url:'http://isure.stream.qqmusic.qq.com/C400004fS9LN2mFNi0.m4a?guid=2200175159&vkey=409E39527EB2B5F2EF7446D46D8DF6C1FF35470CA5A9FB3913CECCD2E1D02872EF70F8C7674231052F8EF9BB51B4DBB38A52799D2A6B2094&uin=0&fromtag=66',duration:206},
    //夜空中最亮的星
    {url:'http://isure.stream.qqmusic.qq.com/C400002EHg2B2FPi71.m4a?guid=2200175159&vkey=FE0217EBE0AA12627E3D2B4D72E0C02F9BFBE5EBE309D5676D2CF87E2BE1BAFC590F7C6D253916F4002C3F5C634A1FE05D48B280058588E1&uin=0&fromtag=66',duration:252},
    //一生所爱
    {url:'http://isure.stream.qqmusic.qq.com/C400002bos190MSN3s.m4a?guid=2200175159&vkey=78720E49CE2E84A913D5932F1AE59C81D0039140A3F3922AED5E4931C73C6068F6DB4181266B19FE57F974DEF5387FA7992579CB98D06E96&uin=0&fromtag=66',duration:273},
    //这就是爱
    {url:'http://isure.stream.qqmusic.qq.com/C400001gyX5c2TK6ig.m4a?guid=2200175159&vkey=3D04CFC037E76D4C7D0E7BEE0F33F583D8AB3CCDDCD01EC96FE2A1C857D349E66292C9BD4382EB7309DD5C8DF7D3C138B5B58446F6019C79&uin=0&fromtag=66',duration:336},
    //牵手
    {url:'http://isure.stream.qqmusic.qq.com/C400001KsgVp1Aulul.m4a?guid=2200175159&vkey=4D4524FB82588FA127937338614D965D579EBA6580A258B47DDFB44350537DFEB49B1ECC724921528CFD732E56C6505FC376A3A0C9DA529C&uin=0&fromtag=66',duration:347},
    //铁血丹心
    {url:'http://isure.stream.qqmusic.qq.com/C400003C6YQj1asJkJ.m4a?guid=2200175159&vkey=477916B46CD505F271CD79F2169A026AA628D25066FDBC07BADF7C423B1F5053F4F8C4425714C03A50EEFC681DB089F102B4D94962513ECD&uin=0&fromtag=66',duration:174},
    //最美的太阳
    {url:'http://isure.stream.qqmusic.qq.com/C400001wVhi42xj3FS.m4a?guid=2200175159&vkey=7E7163977AA3C6A550AD19FC86499CB5736692BB71F0BF9DA88B39BD00A9235CA5CFFFC3E8ACB685BC62F6E45136358A4F31639175237232&uin=0&fromtag=66',duration:256},
    //明天过后
    {url:'http://isure.stream.qqmusic.qq.com/C400002k2ySj3oWVVB.m4a?guid=2200175159&vkey=93ED4F91DE67458B18149A26825CA45EAC0E10DA658222012CD29413EE318A01E5030902E8D684D182505BA2B8A9C726076CA8D93EE388EC&uin=0&fromtag=66',duration:303},
    //看魔
    {url:'http://isure.stream.qqmusic.qq.com/C400001qVbX03coWjv.m4a?guid=2200175159&vkey=162231DFB5BAB54E3E790D71A28180DD9C44EB94759067A3FCF97C720DDF947A40291DF1B0B0AC010EC4482A9C69F8F4084DEBB0E88FA60A&uin=0&fromtag=66',duration:215}
  ]

  export default {
    mounted(){
      //console.log(this.$refs.scroll)
    },
    props:{
      //关键字
      keywords:{
        type:String
      },
      pageSize:{
        type:Number,
        default:20
      }
    },
    data(){
      return {
        pullup:true,//监听上拉事件
        pageNum:1,//当前页
        result:[],
        isShow:false,//控制loading的显示隐藏
        hasMore:true,//判断是否还有更多的数据
        title:'没有更多数据了',
      }
    },
    watch:{
      keywords(newV){
        //搜索字发生变化时:先将一切置为初始,然后重新搜索
        this.result = []
        this.pageNum = 1
        this.hasMore = true
        this.isShow = false
        this.$refs.scroll.scrollTo(0,0) //滚动到从头开始
        this.search(newV)
      }
    },
    methods:{
      getClsIcon(item){
         return 'icon-mine'
      },
      getContent(item){
         if (item.singer && item.singer[0]) {
            return `${item.singer[0].name}--${item.songname}`
         }
      },
      search(keywords) {
         this.isShow = true
         searchForKeywords(keywords,this.pageNum,this.pageSize).then(res => {
            const data = res.data.data.song
            const arr = data.list
            this.result = this.result.concat(arr)
            this.isShow = false
            if (data.curpage * data.curnum >= data.totalnum) {
              this.hasMore = false
            }
         })
      },
      pullupEvent(){
        if (this.isShow) return;
        if (this.hasMore) {
          this.pageNum++
          this.search(this.keywords)
        }
      },
      setIntoList(song){
        //将点击数据存入播放列表和顺序列表
        this.$store.dispatch('insertSong',new Song({
           id:song.songid,
           mid:song.songmid,
           songname:song.songname,
           singer:song.singer,
           album:song.albumname,
           image:'https://y.gtimg.cn/music/photo_new/T002R300x300M000000dcZ9I1nzO62.jpg?max_age=2592000',
           duration:arr[getInteger(0,9)].duration,
           url:arr[getInteger(0,9)].url
        }))
        //派发事件(该组件只是显示搜索列表,不关心其他事情)
        this.$emit('insertIntoList',this.keywords)
      },
      myRefresh(){
        this.$refs.scroll.refresh()
      },
    },
    components:{
      scroll,loading,noResult
    }
  } 
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>