<template>
<div class="progress-circle">
  <svg :width="radius" :height="radius" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" version="1.1">
    <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent"></circle>
    <circle class="progress-circle" r="50" cx="50" cy="50" fill="transparent"
            :stroke-dasharray="dashArray" :stroke-dashoffset="dashOffset">
    </circle>
  </svg>
  <slot></slot>
</div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'ProgressBar',
  data () {
    return {
      dashArray: Math.PI * 100
    }
  },
  props: {
    radius: {
      type: Number,
      default: 100
    },
    percent: {
      type: Number,
      default: 0
    }
  },
  computed: {
    dashOffset () {
      return (1 - this.percent) * this.dashArray
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'

  .progress-circle
    position: relative
    circle
      stroke-width: 8px
      transform-origin: center
      &.progress-background
        stroke: $color-theme-d
        transform: scale(0.9)
      &.progress-circle
        stroke: $color-theme
        transform: scale(0.9) rotate(-90deg)
</style>
