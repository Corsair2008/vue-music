<template>
<div class="song-list">
  <ul>
    <li class="item" v-for="(song, index) in songList" :key="song.id" @click="selectItem(song, index)">
      <div class="content">
        <h2 class="name">{{song.name}}</h2>
        <p class="desc">{{getDesc(song)}}</p>
      </div>
    </li>
  </ul>
</div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'SongList',
  props: {
    songList: {
      type: Array,
      default: null
    }
  },
  methods: {
    getDesc (song) {
      return `${song.singer} - ${song.album}`
    },
    selectItem (item, index) {
      this.$emit('select', item, index)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .song-list
    .item
      display: flex
      align-items: center
      box-sizing: border-box
      height: 64px
      font-size: $font-size-medium
      .content
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          no-wrap()
          color: $color-text
        .desc
          no-wrap()
          margin-top: 4px
          color: $color-text-d
</style>
