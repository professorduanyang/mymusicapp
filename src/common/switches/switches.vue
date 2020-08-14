<template>
  <ul class="switches">
    <li class="switch-item" :class="{'active':currentTitleIndex === index}" v-for="(title,index) in titles" :key="index" @click="selectTitle(title,index)">
      <span>{{ title }}</span>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
  export default {
    props:{
      titles:{
        type:Array
      },
      currentTitleIndex:{
        type:Number,
        default:0
      }
    },
    methods:{
      selectTitle(title,index){
        this.$emit('switches',title,index)
      },
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../stylus/variable"

  .switches
    display: flex
    align-items: center
    width: 240px
    margin: 0 auto
    border: 1px solid $color-highlight-background
    border-radius: 5px
    .switch-item
      flex: 1
      padding: 8px
      text-align: center
      font-size: $font-size-medium
      color: $color-text-d
      &.active
        background: $color-highlight-background
        color: $color-text
</style>