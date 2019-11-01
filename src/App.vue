<template>
  <div id="app">
    <div class="wrapper">
      <m-header></m-header>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
      <player></player>
    </div>
  </div>
</template>

<script>
import MHeader from './components/m-header/m-header'
import Player from './components/player/player'
export default {
  name: 'App',
  components: {
    MHeader,
    Player
  }
}
</script>

<style lang="stylus" scoped>
.wrapper
  z-index: 0
  overflow: hidden
</style>
