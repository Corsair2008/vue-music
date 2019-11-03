<template>
  <div class="listview" ref='listview'>
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <div class="fixed-title">{{fixedTitle}}</div>
    </div>
    <ul>
      <li v-for="group in data" :key="group.title" class="list-group" ref='listGroup'>
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="item in group.items" :key="item.id" class="list-group-item" @click="selectItem(item)">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart.stop.prevent="onShortcutStart" @touchmove.stop.prevent="onShortcutMove" @touchend.stop="onShortcutEnd">
      <ul>
        <li v-for="(item, index) in shortcutList"
            :key="index" :data-index="index"
            class="item"
            :class="{current : currentIndex === index}"
        >
          {{item}}
        </li>
      </ul>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { getData } from 'common/js/dom'
import Loading from '@/base/loading/loading'
import { handleScrollMixin } from 'common/js/mixin'

const ANCHOR_HEIGHT = 18
const TITLE_HEIGHT = 30
const FIXED_TOP = 44

export default {
  name: 'Listview',
  mixins: [handleScrollMixin],
  created () {
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
  },
  data () {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1
    }
  },
  components: {
    Loading
  },
  props: {
    data: {
      type: Array,
      default: null
    }
  },
  computed: {
    shortcutList () {
      return this.data.map((group) => {
        return group.title.substring(0, 1)
      })
    },
    fixedTitle () {
      if (this.scrollY < FIXED_TOP) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  methods: {
    handleScroll (scrollTop) {
      this.scrollY = scrollTop
    },
    selectItem (item) {
      this.$emit('select', item)
    },
    onShortcutStart (e) {
      let anchorIndex = getData(e.target, 'index')
      this.touch.start = true
      this.touch.y1 = e.touches[0].clientY
      this.touch.anchorIndex = parseInt(anchorIndex)
      this._scrollTo(this.touch.anchorIndex)
    },
    onShortcutMove (e) {
      if (!this.touch.start) {
        return
      }
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.touch.y2 = e.touches[0].clientY
        let delta = Math.floor((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT)
        let anchorIndex = this.touch.anchorIndex + delta
        this._scrollTo(anchorIndex)
      }, 5)
    },
    onShortcutEnd () {
      this.touch.start = false
    },
    _calculateHeight () {
      this.listHeight = []
      let list = this.$refs.listGroup
      let height = FIXED_TOP
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },
    _scrollTo (index) {
      if (index < 0 || index >= this.listHeight.length) {
        return
      }
      let height = this.listHeight[index]
      this.scrollY = height
      window.scrollTo(0, height)
    }
  },
  watch: {
    data () {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY (newY) {
      if (newY <= FIXED_TOP) {
        this.currentIndex = 0
        return
      }
      const listHeight = this.listHeight
      for (let i = 0; i < listHeight.length; i++) {
        let heightT = listHeight[i]
        let heightB = listHeight[i + 1]
        if (newY >= heightT && newY < heightB) {
          this.currentIndex = i
          this.diff = heightB - newY
          return
        }
      }
      this.currentIndex = listHeight.length - 2
    },
    diff (newVal) {
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: fixed
      z-index: 80
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: fixed
      top: 44px
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
