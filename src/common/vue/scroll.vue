<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  export default {
    props:{
      //默认纵向滚动
      scrollY:{
        type:Boolean,
        default:true
      },
      //默认滚动时触发scroll事件
      probeType:{
        type:Number,
        default:1
      },
      //默认派发click事件
      click:{
        type:Boolean,
        default:true
      },
      //数据
      data:{
        type:Array,
        default:null
      },
      //是否需要监听scroll事件
      listenScroll:{
        type:Boolean,
        default:false
      },
      //是否监听上拉事件
      pullup:{
        type:Boolean,
        default:false
      },
      //监测到数据变化后多长时间刷新
      scrollDelay:{
        type:Number,
        default:20
      }
    },
    mounted(){
      setTimeout(() => {
        this.initScroll();
      },20);
    },
    methods:{
      initScroll(){
        if (this.$refs.wrapper) {
           this.scroll = new BScroll(this.$refs.wrapper,{
              scrollY:this.scrollY,
              probeType:this.probeType,
              click:this.click
           });
        }
        if (this.listenScroll) {
          let that = this;//子组件this.$emit传值给父组件
          this.scroll.on('scroll',(pos) => {
             that.$emit('myscroll',pos);
          });
        }
        if (this.pullup) {
          this.scroll.on('scrollEnd',() => {
             //当滚动的距离达到最大滚动距离时就触发
             if ( Math.abs(this.scroll.y) >= Math.abs(this.scroll.maxScrollY)) {
                this.$emit('pullupEvent')
             }
          })
        }
      },
      refresh(){
        this.scroll && this.scroll.refresh()
      },
      scrollTo(){
        this.scroll && this.scroll.scrollTo.apply(this.scroll,arguments);
      },
      scrollToElement(){
        this.scroll && this.scroll.scrollToElement.apply(this.scroll,arguments);
      }
    },
    watch:{
      data(){
        setTimeout(() => {
          this.refresh()
        },this.scrollDelay)
      }
    }
  }
</script>