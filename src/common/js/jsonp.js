var count = 0

export default function jsonp (url, data, opt) {
  var prefix = opt.prefix || '__jp'
  var id = opt.name || (prefix + (count++))
  var param = opt.param || 'callback'
  var script = document.createElement('script')
  var target = document.getElementsByTagName('script')[0] || document.head
  var timeout = opt.timeout || 60000

  function cleanup () {
    if (window[id]) {
      window[id] = null
    }
    script.parentNode.removeChild(script)
  }

  function parse (data) {
    let url = ''
    for (var k in data) {
      let value = data[k] !== undefined ? data[k] : ''
      url += `&${k}=${encodeURIComponent(value)}`
    }
    return url ? url.substring(1) : ''
  }

  url += (url.indexOf('?') < 0 ? '?' : '&') + parse(data)
  url += (url.indexOf('?') < 0 ? '?' : '&') + param + '=' + encodeURIComponent(id)

  var promise = new Promise((resolve, reject) => {
    script.src = url
    target.parentNode.insertBefore(script, target)
    script.onerror = function () {
      if (window[id] === null) {
        reject(new Error('Timeout'))
      } else {
        reject(new Error('data format err'))
        cleanup()
      }
    }
    script.timer = setTimeout(() => {
      cleanup()
    }, timeout)
    window[id] = (data) => {
      resolve(data)
      clearTimeout(script.timer)
      cleanup()
    }
  })

  return promise
}
