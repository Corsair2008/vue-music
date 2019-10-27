const timeExp = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g

const STATE_PAUSE = 0
const STATE_PLAY = 1

const tagRegMap = {
  title: 'ti',
  artist: 'ar',
  album: 'al',
  offset: 'offset',
  by: 'by'
}

function noop () {}

export default class Lyric {
  constructor (lyric, handler = noop) {
    this.lyric = lyric
    this.tags = {}
    this.lines = []
    this.handler = handler
    this.curLine = 0
    this.state = STATE_PAUSE

    this._init()
  }

  _init () {
    this._initTag()
    this._initLines()
  }

  _initTag () {
    for (let tag in tagRegMap) {
      const matches = this.lyric.match(new RegExp(`\\[${tagRegMap[tag]}:([^\\]]*)]`, 'i'))
      if (matches) {
        this.tags[tag] = matches && matches[1]
      } else {
        this.tags[tag] = ''
      }
    }
  }

  _initLines () {
    const lines = this.lyric.split('\n')
    const offset = parseInt(this.tags['offset']) || 0
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      let result = timeExp.exec(line)
      if (result) {
        const txt = line.replace(timeExp, '').trim()
        if (txt) {
          this.lines.push({
            time: result[1] * 60 * 1000 + result[2] * 1000 + (result[3] || 0) * 10 + offset,
            txt
          })
        }
      }
    }

    this.lines.sort((a, b) => {
      return a.time - b.time
    })
  }

  _findCurLine (time) {
    for (let i = 0; i < this.lines.length; i++) {
      if (time <= this.lines[i].time) {
        return i
      }
    }
    return this.lines.length - 1
  }

  _callHandler (i) {
    if (i < 0) {
      return
    }
    return this.handler({
      txt: this.lines[i].txt,
      lineNum: i
    })
  }

  _playRest () {
    let line = this.lines[this.curLine]
    let delay = line.time - (+new Date() - this.startStamp)

    this.timer = setTimeout(() => {
      this._callHandler(this.curLine++)
      if (this.curLine < this.lines.length && this.state === STATE_PLAY) {
        this._playRest()
      }
    }, delay)
  }

  play (startTime = 0, skipLast) {
    if (!this.lines.length) {
      return
    }

    this.state = STATE_PLAY
    this.startStamp = +new Date() - startTime
    this.curLine = this._findCurLine(startTime)

    if (!skipLast) {
      this._callHandler(this.curLine - 1)
    }

    if (this.curLine < this.lines.length) {
      clearTimeout(this.timer)
      this._playRest()
    }
  }

  togglePlay () {
    var now = +new Date()
    if (this.state === STATE_PLAY) {
      this.stop()
      this.pauseStamp = now
    } else {
      this.play((this.pauseStamp || now) - (this.startStamp || now), true)
      this.pauseStamp = 0
    }
  }

  stop () {
    clearTimeout(this.timer)
    this.state = STATE_PAUSE
  }

  seek (offset) {
    this.play(offset)
  }
}
