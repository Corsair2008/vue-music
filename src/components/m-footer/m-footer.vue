<template>
<div :class="footerCls"></div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
export default {
  name: 'MFooter',
  computed: {
    footerCls () {
      if (!this.playlist || !this.playlist.length) {
        return
      }
      const paddingTop = this.playlist.length > 0 ? 'padding' : ''
      return paddingTop
    },
    ...mapGetters([
      'playlist'
    ])
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .padding
    padding-top: 60px
</style>
