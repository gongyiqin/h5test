/**
 *
 *
  const optionsLists = {
    categorys: {api: 'getcategory', itemKey: 'category_id'}
  }
 *
 */

import Vue from 'vue'

const upperFirstLetter = (word) => {
  return word.substring(0, 1).toUpperCase() + word.substring(1)
}

// const dealUrl = (url, data) => {
//   if (url.indexOf('/:') === -1) return url
//   if (typeof data === 'string' || typeof data === 'number') data = [data]
//   let names = url.split('/')
//   let index = 0
//   names.forEach((name, i) => {
//     if (name.indexOf(':') === 0) {
//       let val = data ? (Array.isArray(data) ? data[index++] : data[name.substring(1)]) : 0
//       names[i] = val || 0
//     }
//   })
//   console.log('names', names)
//   return names.join('/')
// }

const buildStoreModules = (lists, store) => {
  var keys = Object.keys(lists)
  var state = {}
  var mutations = {}
  var getters = {}
  var actions = {}

  keys.forEach((key) => {
    var Key = upperFirstLetter(key)
    var option = lists[key]
    var itemKey = option.itemKey

    state[key] = Object.assign({loading: false}, option.initAs)

    mutations['update' + Key] = (state, item) => {
      // console.log('update ', Key, item)
      let _item = typeof option.onUpdate === 'function' && option.onUpdate(state, item)
      if (_item) item = _item
      if (itemKey) {
        if (item[itemKey]) Vue.set(state[key], item[itemKey], item)
        else state[key] = item
      } else {
        state[key] = item
      }
    }

    mutations['delete' + Key] = (state, item) => {
      if (!itemKey) return
      Vue.delete(state[key], typeof item === 'object' ? item[itemKey] : item)
    }

    if (option.extraMutations) {
      Object.keys(option.extraMutations).forEach(key => {
        mutations[key] = option.extraMutations[key]
      })
    }

    getters[key] = (state) => {
      if (state[key].loading !== undefined) store.dispatch('init' + Key)
      return state[key]
    }

    actions['init' + Key] = ({commit, state}) => {
      if (state[key].loading === true) return state[key]
      commit('update' + Key, Object.assign({}, state[key], {loading: true}))
      let api = typeof option.api === 'function' ? option.api(state) : option.api
      return Vue.http.get(api).then(({body}) => {
        let items = {}
        if (itemKey && Array.isArray(body.data)) body.data.forEach((item) => { items[item[itemKey]] = item })
        else items = body.data
        commit('update' + Key, items)
        return items
      })
    }
  })
  return {
    state,
    mutations,
    getters,
    actions
  }
}

export default buildStoreModules
