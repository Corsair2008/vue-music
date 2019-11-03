<template>
  <div id="app">
    <div class="wrapper">
      <m-header></m-header>
      <keep-alive exclude="Detail">
        <router-view></router-view>
      </keep-alive>
      <player></player>
      <m-footer></m-footer>
    </div>
  </div>
</template>

<script>
import MHeader from './components/m-header/m-header'
import Player from './components/player/player'
import MFooter from './components/m-footer/m-footer'
export default {
  name: 'App',
  components: {
    MHeader,
    Player,
    MFooter
  }
}
</script>

<style lang="stylus" scoped>
</style>
