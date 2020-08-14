<template>
  <Scroll class="listview" :data="data" ref="myScroll" :listenScroll="listenScroll" :probeType="probeType" @myscroll="myscroll">
    <!--左侧视图列表-->
    <ul ref="myViewList">
      <li v-for="(group,i) in data" :key="i" class="list-group">
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li v-for="(item,x) in group.items" :key="x" class="list-group-item" @click="emitFatherCom(item)">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!--右侧文字列表-->
    <div>
      <ul @touchstart="startEvent" @touchmove.stop.prevent="moveEvent" class="list-shortcut">
        <li v-for="(item,index) in textList" :key="index" class="item" :data-index="index" :class="{'current':index==listviewIndex}">
          {{ item }}
        </li>
      </ul>
    </div>
    <!--固定列显示当前区域-->
    <div ref="currentArea" class="list-fixed" v-show="currentTitle!=''">
      <div class="fixed-title">{{ currentTitle }}</div>
    </div>
  </Scroll>
</template>

<script>
  const textListSpace = 18//右侧文字列表间隔距离18
  const titleHeight = 30//每块区域的标题头高度为30
  import Scroll from './scroll.vue'
  export default {
    props: {
      data: {
        type: Array,
      },
      refresh:{
        type:Boolean,
        default:false
      }
    },
    data(){
      return {
        probeType:3,//非节流阀(看better-scroll文档)
        textList:[],//右侧文字列表
        touchObject:{},
        listenScroll:true,
        scrollList:[],//左侧列表
        scrollY:-1,
        listviewIndex:0,//左侧列表索引(默认第一个)
        currentTitle:'热门歌曲',//固定列内容
        diff:-1,//nextAreaHeight与scrollY之差
      }
    },
    created(){
      //生成右侧的字母列表
      this.data.forEach((mydata) => {
        this.textList.push(mydata.title.substr(0,1));
      });
      console.log('字母列表',this.textList);
    },
    mounted(){
      //依次计算每块区域的高度
      this.getScrollListHeight();
    },
    methods:{
      startEvent(e){
        this.touchIndex = e.target.getAttribute('data-index');//点击的索引
        this.$refs.myScroll.scrollToElement(this.$refs.myViewList.children[this.touchIndex]);//点哪去哪
        this.touchObject.startY = e.touches[0].pageY;//记录起始点击位置
      },
      moveEvent(e){
        this.moveIndex = 0;
        this.touchObject.currentY = e.touches[0].pageY;//记录移动过程的位置
        this.moveIndex = parseInt(this.touchIndex) + parseInt((this.touchObject.currentY - this.touchObject.startY) / textListSpace);
        this.$refs.myScroll.scrollToElement(this.$refs.myViewList.children[this.moveIndex]);
      },
      myscroll(pos){
        this.scrollY = pos.y;//记录滚动点的位置
      },
      getScrollListHeight(){
        let childrenList = this.$refs.myViewList.children;
        let height = 0;
        this.scrollList.push(height);
        for (let index = 0;index < childrenList.length;index++) {
           height += childrenList[index].offsetHeight;
           this.scrollList.push(height);
        }
      },
      emitFatherCom(item){
        this.$emit('fatherComMethod',item);
      },
    },
    components:{
      Scroll
    },
    watch:{
      scrollY(newVal){
        //下拉到顶(better-scroll组件相对于初始位置向上滚动时,newVal为负,反之为正)
        if (newVal > 0) {
           this.listviewIndex = 0;
           this.currentTitle = '';//此时不需要显示固定列了
           return;
        }
        //在中间滚动
        for (let index = 0;index < this.scrollList.length;index ++) {
           let prevAreaHeight = this.scrollList[index];
           let nextAreaHeight = this.scrollList[index + 1];
           if (-newVal >= prevAreaHeight && -newVal < nextAreaHeight) {
              this.listviewIndex = index;
              this.currentTitle = this.data[index].title;//设置固定列内容
              this.diff = nextAreaHeight - Math.abs(newVal);//设置高度差
              return;
           }
        }
        //上拉到底(此时滚动的距离已经超过最后一块区域的总高度了)
        if (-newVal > this.scrollList[this.scrollList.length-1]) {
          this.listviewIndex = this.data.length - 1;
          this.currentTitle = this.data[this.data.length - 1].title;
        }
      },
      diff(newVal){
        //console.log('高度差',newVal);
        if (newVal >= titleHeight) {
           this.fixTop = 0;
        }
        else {
           this.fixTop = newVal - titleHeight;
        }
        this.$refs.currentArea.style.transform = 'translate3d(0,'+this.fixTop+'px,0)';
      },
      refresh(newV){
        if (newV) {
          this.$refs.myScroll.refresh()
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../stylus/variable"
  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
