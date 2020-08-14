<template>
  <div id="app">
    <MHeader/>
    <Tab/>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <Player></Player>
    
  </div>
</template>

<script>
  import MHeader from './components/m-header/m-header.vue'
  import Tab from './components/tab/tab.vue'
  import Player from './components/player/player.vue'
  import Login from './views/Login.vue'
  export default {
    components:{
      MHeader,
      Tab,
      Player,
      Login
    }
  };
</script>


