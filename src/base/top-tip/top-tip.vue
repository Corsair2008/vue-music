<template>
<transition appear name="drop">
  <div class="top-tip" v-show="showFlag" @click.stop="hide">
    <slot></slot>
  </div>
</transition>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'TopTip',
  props: {
    delay: {
      type: Number,
      default: 1000
    }
  },
  data () {
    return {
      showFlag: false
    }
  },
  methods: {
    show () {
      this.showFlag = true
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.hide()
      }, this.delay)
    },
    hide () {
      this.showFlag = false
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .top-tip
    position: fixed
    top: 0
    width: 100%
    z-index: 500
    background: $color-dialog-background
    &.drop-enter-active, &.drop-leave-active
      transition: all .5s
    &.drop-enter, &.drop-leave-to
      transform: translateY(-100%)
</style>
