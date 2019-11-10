export default class Song {
  constructor ({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
}

export function createSong (songInfo, songUrl) {
  return new Song({
    id: songInfo.id,
    mid: songInfo.mid,
    singer: filterSinger(songInfo.singer),
    name: songInfo.name,
    album: songInfo.album.name,
    duration: songInfo.interval ? songInfo.interval : 300,
    image: songInfo.album.mid ? `http://y.gtimg.cn/music/photo_new/T002R300x300M000${songInfo.album.mid}.jpg?max_age=2592000` : '/static/image/defaultImg.jpg',
    url: songUrl
  })
}

export function createDiscSong (discSong, songUrl) {
  return new Song({
    id: discSong.songid,
    mid: discSong.songmid,
    singer: filterSinger(discSong.singer),
    name: discSong.songname,
    album: discSong.albumname,
    duration: discSong.interval ? discSong.interval : 300,
    image: discSong.albummid ? `http://y.gtimg.cn/music/photo_new/T002R300x300M000${discSong.albummid}.jpg?max_age=2592000` : '/static/image/defaultImg.jpg',
    url: songUrl
  })
}

export function createJaySong (song) {
  return new Song({
    id: song.id,
    mid: song.copyrightId,
    singer: song.singerName,
    name: song.songName,
    album: song.albumName,
    duration: song.interval ? song.interval : 300,
    image: song.cover ? song.cover : '/static/image/defaultImg.jpg',
    url: song.mp3
  })
}

function filterSinger (singer) {
  if (!singer) {
    return ''
  }
  let ret = []
  singer.forEach(s => {
    ret.push(s.name)
  })
  return ret.join('/')
}
