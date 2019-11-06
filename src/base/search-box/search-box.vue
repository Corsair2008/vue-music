<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input class="box" v-model="query" :placeholder="placeholder">
    <i class="icon-dismiss" v-show="query" @click="clear"></i>
  </div>
</template>

<script type="text/ecmascript-6">
import { debounce } from 'common/js/util'
export default {
  name: 'SearchBox',
  data () {
    return {
      query: ''
    }
  },
  props: {
    placeholder: {
      type: String,
      default: '随便搜搜吧'
    }
  },
  methods: {
    clear () {
      this.query = ''
    },
    setQuery (query) {
      this.query = query
    }
  },
  created () {
    this.$watch('query', debounce((newVal) => {
      this.$emit('query', newVal)
    }, 200))
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

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
      line-height: 26px
      outline: none
      background: $color-highlight-background
      color: $color-text
      font-size: $font-size-l
      &::placeholder
        color: $color-text-d
    .icon-dismiss
      font-size: 24px
      color: $color-background
</style>
