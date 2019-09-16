// 一些零碎的 function

const Validate = (data, rules) => { // ruls = {name: []}
  let valid = true
  let msgs = []
  Object.keys(data).forEach(name => {
    let val = typeof data[name] === 'string' ? data[name].trim() : data[name]
    let _rules = rules._all ? rules._all.concat(rules[name] || []) : rules[name]
    let label = rules._labels ? (rules._labels[name] || name) : name
    for (let i = 0, len = _rules.length; i < len; i++) {
      let rule = _rules[i]

      if (val === '') {
        if (rule.required) {
          valid = false
          msgs.push(rule.msg || label + '不能为空')
        }
        break
      } else {
        let ruleKey = Object.keys(rule)[0]
        if (ruleKey === 'minlength') {
          if (val.length < rule.minlength) {
            valid = false
            msgs.push(rule.msg || label + '长度不得小于 ' + rule.minlength + ' 位')
            break
          }
        } else if (ruleKey === 'length') {
          if (val.length !== rule.length) {
            valid = false
            msgs.push(rule.msg || label + '长度须等于 ' + rule.length + ' 位')
            break
          }
        } else if (ruleKey === 'mobileCN') {
          if (!/^1[0-9]{10}$/.test(val)) {
            valid = false
            msgs.push(rule.msg || '手机号输入不正确')
            break
          }
        } else if (ruleKey === 'min') {
          if (isNaN(Number(val)) || Number(val) < rule.min) {
            valid = false
            msgs.push(rule.msg || label + '不得小于' + rule.min)
            break
          }
        } else if (ruleKey === 'regexp') {
          if (!rule.regexp.test(val)) {
            valid = false
            msgs.push(rule.msg || label + '格式不正确')
            break
          }
        }
      }
    }
  })
  return new Promise((resolve, reject) => {
    if (valid) resolve()
    else reject(msgs)
  })
}

const parseUrl = (url) => {
  let _url = url
  let res = {}
  if (url.indexOf('://') > 3 || url.indexOf('//') === 0) _url = url.split('//')[1]
  if (_url.indexOf('?') > -1) {
    _url.split('?')[1].split('&').forEach(item => {
      let attr = item.split('=')
      res[attr[0]] = attr[1]
    })
    _url = _url.split('?')[0]
  }
  let _urlParts = _url.split('/')
  // if (_urlParts[0].indexOf('.') > 0) {
  res.host = _urlParts[0]
  _urlParts.splice(0, 1)
  // }
  if (_urlParts.length > 1) {
    for (let i = 0, len = _urlParts.length; i < len; i = i + 2) {
      res[_urlParts[i]] = _urlParts[i + 1] || ''
    }
  }
  return res
}

// 处理形如 /a/b/:c/:d 的 url,
// data: [1,2] | {c: '', d: ''}
// 按顺序替换,不足用 0 填充
const dealUrl = (url, data) => {
  if (url.indexOf('/:') === -1) return url
  if (typeof data === 'string' || typeof data === 'number') data = [data]
  let names = url.split('/')
  let index = 0
  names.forEach((name, i) => {
    if (name.indexOf(':') === 0) {
      let val = data ? (Array.isArray(data) ? data[index++] : data[name.substring(1)]) : 0
      names[i] = val || 0
    }
  })
  return names.join('/')
}

const timeFormat = (fmt, timeStr) => {
  // 'yyyy-MM-dd hh:mm:ss'
  var date = typeof timeStr === 'string' ? new Date(timeStr) : new Date()
  var o = {
    'yyyy': date.getFullYear(),
    'M': date.getMonth() + 1,
    'd': date.getDate(),
    'h': date.getHours(),
    'm': date.getMinutes(),
    's': date.getSeconds(),
    'S': date.getMilliseconds(),
  }
  // console.log('o', JSON.stringify(o))
  return fmt.replace('yyyy', o.yyyy)
    .replace('MM', o.M > 9 ? o.M : '0' + o.M)
    .replace('dd', o.d > 9 ? o.d : '0' + o.d)
    .replace('hh', o.h > 9 ? o.h : '0' + o.h)
    .replace('mm', o.m > 9 ? o.m : '0' + o.m)
    .replace('ss', o.s > 9 ? o.s : '0' + o.s)
    // .replace('M', o.M)
    // .replace('d', o.d)
    // .replace('h', o.h)
    // .replace('m', o.m)
    // .replace('s', o.s)
    .replace('S', o.S)
}
const InTime = (startTime, endTime) => {
  // eslint-disable-next-line camelcase
  function getLocalTime(i) {
    if (typeof i !== 'number') return
    var d = new Date()
    var len = d.getTime()
    var offset = d.getTimezoneOffset() * 60000
    var utcTime = len + offset
    return new Date(utcTime + 3600000 * i)
  }

// eslint-disable-next-line camelcase
  let my_date = getLocalTime(7).getTime()
  let startArray = startTime.split(':')
  let endArray = endTime.split(':')
  let b = getLocalTime(7)
  let e = getLocalTime(7)
  b.setHours(startArray[0])
  b.setMinutes(startArray[1])
  b.setSeconds(startArray[2])
  e.setHours(endArray[0])
  e.setMinutes(endArray[1])
  e.setSeconds(startArray[2])
  // eslint-disable-next-line camelcase
  if (my_date >= b.getTime() && my_date <= e.getTime()) {
    return true
    // eslint-disable-next-line camelcase
  } else {
    return false
  }
}

const nextTime = (minuCurrent, dateTimeArray) => {
  // eslint-disable-next-line camelcase
  let currentTimeIndex = dateTimeArray.indexOf(minuCurrent)
  let t = ''
  if (dateTimeArray[currentTimeIndex + 1] === undefined) {
    let hours = Math.floor(dateTimeArray[0] / 60 / 60)
    let minutes = parseInt(dateTimeArray[0] / 60) % 60
    let seconds = dateTimeArray[0] % 60
    hours = hours < 10 ? '0' + hours : hours
    minutes = minutes < 10 ? '0' + minutes : minutes
    seconds = seconds < 10 ? '0' + seconds : seconds
    t = hours + ':' + minutes + ':' + seconds
    return t
  } else {
    let hours = Math.floor(dateTimeArray[currentTimeIndex + 1] / 60 / 60)
    let minutes = parseInt(dateTimeArray[currentTimeIndex + 1] / 60) % 60
    let seconds = dateTimeArray[currentTimeIndex + 1] % 60
    hours = hours < 10 ? '0' + hours : hours
    minutes = minutes < 10 ? '0' + minutes : minutes
    seconds = seconds < 10 ? '0' + seconds : seconds
    t = hours + ':' + minutes + ':' + seconds
    return t
  }
}
// const storage = () => {
//   const local = window.localStorage
//   return {
//     save(key, data, expiredAfter) {
//       let now = new Date().getTime()
//       let _data = {data, expiredAt: now + expiredAfter, createAt: now}
//       local.setItem({key, JSON.stringify(_data)})
//     }
//   }
// }

export { Validate, parseUrl, dealUrl, timeFormat, InTime, nextTime }
