/**
 * @return {boolean}
 */
export function nextTime(minuCurrent, dateTimeArray) {
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
