<template>
  <scroll ref="scroll" :data="searches" class="wrapper">
    <transition-group name="list" tag="ul">
      <li v-for="(item,index) in searches" :key="item" class="myli">
        <span class="text" @click="selectItem(item)">{{ item }}</span>
        <span class="delete">
          <i class="icon-delete" @click="deleteFromList(item)"></i>
        </span>
      </li>
    </transition-group>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import scroll from '../vue/scroll.vue'
  import {myMixin} from '../js/mixin.js'
  import {mapState} from 'vuex'
  export default {
    mixins:[myMixin],
    created(){
      this.searches = this.historyList
    },
    props:['query'],
    data(){
      return {
        searches:[]
      }
    },
    methods:{
      selectItem(item){
        this.$emit('selectItem',item)
      },
      deleteFromList(item){
        this.$emit('deleteFromList',item)
      },
      //重写mixin里的方法
      changeBottom(list){
        const height = list.length > 0 ? '180px' : '250px'
        this.$refs.scroll.$el.style.height = height
        this.$refs.scroll.refresh()
      },
    },
    watch:{
      historyList:{
        deep:true,
        handler(newV){
          this.searches = newV
        }
      },
      query(newV){
        if (!newV) {
          this.$nextTick(() => {
            this.$refs.scroll.refresh()
          })
        }
      }
    },
    components:{
      scroll
    },
    computed:{
      ...mapState(['historyList'])
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../stylus/variable"

  .list-enter-active, &.list-leave-active
    transition: all 0.3s
  .list-enter, &.list-leave-to
    height: 0
  .wrapper
    height: 250px
    position: absolute
    width: 100%
    overflow: hidden
  .myli 
    display: flex
    align-items: center
    height: 40px
    width: 100%
  .text
    font-size: 12px
    flex: 1
    color: $color-text-l
  .delete
    font-size: $font-size-small
    float: right
    color: $color-text-d
</style>