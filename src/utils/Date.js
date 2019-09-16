/**
 * @return {boolean}
 */
export function InTime(startTime, endTime) {
  // eslint-disable-next-line camelcase
  let my_date = new Date().getTime()
  let startArray = startTime.split(':')
  let endArray = endTime.split(':')
  let b = new Date()
  let e = new Date()
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
