<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input ref="query" class="box" v-model="query" :placeholder="placeholder"/>
    <i class="icon-dismiss" v-show="query.trim().length" @click="clear()"></i>
  </div>
</template>

<script>
  import {debounce} from '../js/util.js'
  export default {
    data(){
      return {
        query:''
      }
    },
    props:{
      placeholder:{
        type:String,
        default:''
      },
    },
    methods:{
      clear(){
        this.query = ''
      },
    },
    watch:{
      //debounce(fn,delay)返回一个function,需要手动调用
      query(newV){
        debounce(() => {
          this.$emit('querySelect',newV)
        },200)()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../stylus/variable.styl"

  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 6px
    height: 40px
    background: $color-highlight-background
    border-radius: 6px
    .icon-search
      font-size: 24px
      color: $color-background
    .box
      flex: 1
      margin: 0 5px
      line-height: 18px
      background: $color-highlight-background
      color: $color-text
      font-size: $font-size-medium
      &::placeholder
        color: $color-text-d
    .icon-dismiss
      font-size: 16px
      color: $color-background
</style>