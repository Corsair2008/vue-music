<template>
<div class="search-list">
  <transition-group tag="ul" name="list">
    <li class="search-item" v-for="item in list" :key="item" @click="selectItem(item)">
      <span class="text" v-html="item"></span>
      <span class="icon" @click.stop="deleteItem(item)">
        <i class="icon-delete"></i>
      </span>
    </li>
  </transition-group>
</div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'searchList',
  props: {
    list: {
      type: Array,
      default: null
    }
  },
  methods: {
    selectItem (item) {
      this.$emit('select', item)
    },
    deleteItem (item) {
      this.$emit('delete', item)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-list
    margin-bottom: 10px
    .search-item
      display: flex
      align-items: center
      height: 30px
      font-size: $font-size-medium
      color: $color-text-d
      &.list-enter-active, &.list-leave-active
        transition: all .1s
      &.list-enter, &.list-leave-to
        height: 0
      .text
        flex: 1
      .icon
        extend-click()
        .icon-delete
          font-size: $font-size-small
</style>
