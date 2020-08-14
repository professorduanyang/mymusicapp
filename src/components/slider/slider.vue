<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots" >
      <span v-for="(dot,index) in dots" :key="index" class="dot" :class="{active:currentPage===index}"></span>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  export default {
    data(){
      return {
        slider:{},
        dots:0,
        currentPage:0
      }
    },
    props:{
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000
      }
    },
    mounted(){
       //初始化轮播宽度(父盒子定宽,子盒子宽度一定要大于父盒子)
       this.initSliderWidth(false);
       //初始化点盒子
       this.initDots(),
       //初始化滚动(better-scroll初始化)
       this.initScroll();
       if (this.autoPlay) {
         //设置自动轮播效果
         this.autoplaySliders();
       }
       //监听页面尺寸变化事件
       window.addEventListener('resize',() => {
          this.initSliderWidth(true);
          this.slider.refresh();
       });
    },
    methods:{
      initSliderWidth(isResize){
        //console.log(isResize);
        this.children = this.$refs.sliderGroup.children;
        let width = 0;
        let sliderWidth = this.$refs.slider.offsetWidth;
        for (let i = 0; i < this.children.length; i++) {
          if (!this.hasClass(this.children[i],'slider-item')) {
            this.addClass(this.children[i],'slider-item');
          }
          this.children[i].style.width = sliderWidth + 'px';
          width += sliderWidth;
        }
        //如果要循环,首尾各加一张图片
        if (this.loop && !isResize) {
          width += sliderWidth * 2;
        }
        this.$refs.sliderGroup.style.width = width + 'px';
      },
      initScroll(){
        this.slider = new BScroll(this.$refs.slider,{
           scrollX: true,
           scrollY: false,
           momentum: false,
           snap: {
            loop: this.loop,
            threshold: 0.3,
            speed: 400
           },
           click: true
        });
        //better-scroll自带的监视滚动结束事件
        this.slider.on('scrollEnd',() => {
          //better-scroll自带的当前页属性(pageX表示横向的)
          let page = this.slider.currentPage.pageX;
          if (this.loop) {
             page -= 1;
          }
          this.currentPage = page;
          //如果手动滚动和自动轮播同时触发的话,可能一下会滚了两张图,效果很奇怪,因此处理一下
          if (this.autoPlay) {
             window.clearInterval(this.timer);//每次滚动结束先清理一下定时器
             this.autoplaySliders();//再开启重新自动滚动
          }
        });
      },
      initDots(){
        this.dots = this.$refs.sliderGroup.children.length;
      },
      autoplaySliders(){
        this.timer = window.setInterval(() => {
          //console.log(this.children.length);//7(接口返回5张,通过上面BS的options中的loop,使其首尾各自动加一)
          this.currentPage += 1;
          if (this.currentPage == this.children.length - 2) {
             this.currentPage = 0;
          }
          //better-scroll自带的方法goToPage(x,y,time),x是横向页码,y是纵向页码,time是动画执行时间(这里设置成跟上面滚动的speed一致)
          this.slider.goToPage(this.currentPage,0,400);
        },this.interval);
      },
      hasClass(el,className){
        return el.className.split(' ').includes(className);
      },
      addClass(el,className){
        let currentClass = el.className.split(' ');
        currentClass.push(className);
        el.className = currentClass.join(' ');
      }
    },
    destroyed(){
       window.clearInterval(this.timer);
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"

  .slider
    min-height: 1px
    width: 100%
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>