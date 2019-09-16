// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import VueScrollTo from 'vue-scrollto'

import vuexI18n from 'vuex-i18n'
import vuxLocales from './locales/all.yml'
import componentsLocales from './locales/components.yml'
import App from './App'

import { LoadingPlugin, AlertPlugin, ConfirmPlugin, ToastPlugin, LocalePlugin } from 'vux'

import 'vux/src/styles/reset.less'
import 'vux/src/styles/1px.less'

import buildStoreModule from './utils/build-store-module'

import router from './router'

const ApiRoot = process.env.API_ROOT
const AppVersion = process.env.APP_VERSION

Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(VueResource)
Vue.use(VueScrollTo)

const store = new Vuex.Store({
  strict: true,
  state: {
    // token: {},
    pageMetas: {title: ' ', class: 'p-home', hollowNavbar: true},
    headerActions: [], // {component, props} | {action, icon, label}
    lang: '',
    passcode: '',
    tableId: 0,
    pers: 0,
    quantity: {uninited: true},
    restaurant_id: '',
    EnterParams: {},
  },
  mutations: {
    updatePageMetas(state, payload) {
      state.pageMetas = payload
    },
    justUpdate(state, payload) { // {name: 'xxx', data} | {xxx: data}
      if (Object.keys(payload).indexOf('name') > -1) {
        let validKeys = Object.keys(payload).filter(_key => _key !== 'name')
        if (!validKeys.length) return
        state[payload.name ? payload.name : validKeys[0]] = payload[validKeys[0]]
      } else {
        Object.keys(payload).forEach(key => {
          state[key] = payload[key]
        })
      }
    },
    setLang(state, lang) {
      state.lang = lang === 'zh-CN' ? 'cn' : (lang === 'th' ? 'local' : lang)
    },
    updateQuantity(state, payload) {
      let id = payload.menu_id
      if (id) { // 变更单个菜品 quantity
        let item = payload
        if (!state.quantity[id]) state.quantity[id] = (item.package || item.favorites) ? {total: item.quantity, items: []} : {total: item.quantity}
        else state.quantity[id].total += item.quantity
        if (item.package || item.favorites) state.quantity[id].items.push(item)
      } else { // 重写整个 quantity 对象
        state.quantity = payload
      }
    },
  },
  getters: {
    quantity(state) {
      // console.log('get quantity', state.quantity)
      if (state.quantity.uninited) store.dispatch('initCartItems')
      return state.quantity
    }
  },
})

const optionsLists = {
  userinfo: {api: 'session'},
  restaurantInfo: {
    initAs: {loading: false, id: 0, name: {}, image_url: [], content: {}},
    api: state => `restaurants/${store.state.restaurant_id}`,
    extraMutations: {
      updateTableStatus(state, data) {
        state.restaurantInfo.tables[data.index].status = data.status
      },
    },
    onUpdate(state, data) {
      let menuMap = {}
      let unEmptyCates = []
      if (data.menu && data.menu.length) {
        data.menu.forEach(cate => {
          if (cate.items.length) {
            unEmptyCates.push(cate)
            cate.items.forEach(it => { menuMap[it.id] = it })
          }
        })
      }
      window.menuMap = menuMap
      data.menu = unEmptyCates
      return data
    }
  },
  cartItems: {
    api: state => `restaurants/${store.state.restaurant_id}/cart`,
    extraMutations: {
      updateCartMenu(state, data) {
        store.commit('updateQuantity', Vue.prototype._$initQuantity(data))
        state.cartItems.menu = data
      }
    },
    onUpdate(state, data) {
      // 同步更新 quantity
      if (data != null && data.loading === undefined) store.commit('updateQuantity', Vue.prototype._$initQuantity(data.menu))
    },
  },
}
// 生成 state: *, getters: *,  mutations: update*, actions: init*
store.registerModule('options', buildStoreModule(optionsLists, store))

Vue.use(vuexI18n.plugin, store)

const finalLocales = {
  'en': Object.assign(vuxLocales['en'], componentsLocales['en']),
  'zh-CN': Object.assign(vuxLocales['zh-CN'], componentsLocales['zh-CN']),
  'th': Object.assign(vuxLocales['th'], componentsLocales['th']),
  'ru': Object.assign(vuxLocales['ru'], componentsLocales['ru']),
  'jp': Object.assign(vuxLocales['jp'], componentsLocales['jp']),
  'kr': Object.assign(vuxLocales['kr'], componentsLocales['kr']),
}

for (let i in finalLocales) {
  Vue.i18n.add(i, finalLocales[i])
}

// console.log('vuxLocales', Vue.i18n.keyExists('vux.actionsheet.cancel'))

// 默认语言配置
Vue.use(LocalePlugin)

const nowLocale = Vue.locale.get()
const lang = /zh/.test(nowLocale) ? 'zh-CN' : (/th/.test(nowLocale) ? 'th' : (/ru/.test(nowLocale) ? 'ru' : (/jp/.test(nowLocale) ? 'jp' : (/kr/.test(nowLocale) ? 'kr' : 'en'))))

Vue.i18n.set(lang)
store.commit('setLang', lang)

Vue.use(LoadingPlugin)
Vue.use(AlertPlugin)
Vue.use(ConfirmPlugin)
Vue.use(ToastPlugin, {position: 'bottom'})

// const restaurantName = ['RestaurantTables', 'RestaurantMenu', 'MenuDetail', 'Cart']
router.beforeEach((to, from, next) => {
  let storeRestId = store.state.options.restaurantInfo.id
  let needCacheRouterInfo = (!storeRestId || storeRestId !== to.params.restaurant_id) && (!from.name || !from.params.restaurant_id) && to.params.restaurant_id
  if (needCacheRouterInfo && !store.state.EnterParams.params) {
    store.commit('justUpdate', {restaurant_id: to.params.restaurant_id, EnterParams: {path: to.path, params: Object.assign({}, to.query, to.params)}})
  }
  if (needCacheRouterInfo && to.name !== 'RestaurantDetail') next(`/restaurants/${to.params.restaurant_id}`)
  else {
    if (from.name !== null) store.commit('justUpdate', {EnterParams: {}})
    next()
  }
})

router.afterEach((to, from) => {
  store.commit('justUpdate', {pageMetas: to.meta})
  Vue.prototype._$updateTitle(to.meta.title)
})

Vue.prototype._$updateTitle = function(title, asChild) {
  title = Vue.i18n.translate(title)
  document.title = (title ? title + ' | ' : '') + (asChild ? document.title : 'ThaiOK Menu')
  if (store.state.pageMetas.title !== title) store.commit('justUpdate', {pageMetas: Object.assign({}, store.state.pageMetas, {title})})
}

Vue.prototype._$initQuantity = (cartItems) => {
  let quantity = {}
  Object.keys(cartItems || {}).forEach(key => {
    let item = cartItems[key]
    let menuId = item.menu_id
    let goods = window.menuMap[menuId]
    let hasOptions = (goods.price_array && Object.keys(goods.price_array).length) || (goods.favorites && Object.keys(goods.favorites).length)
    item._key = key
    if (!quantity[menuId]) quantity[menuId] = hasOptions ? {total: item.quantity, items: []} : {total: item.quantity, item}
    else quantity[menuId].total += item.quantity
    if (hasOptions) quantity[menuId].items.push(item)
  })
  // console.log('quantity', quantity)
  return quantity
}

// http 请求
Vue.http.options.root = `${ApiRoot}/${AppVersion}/guest`
Vue.http.interceptors.push((request) => {
  Vue.$vux.loading.show({text: '数据加载中'})
  request.credentials = true
  request.headers.set('Accept', 'application/json')
  // console.log('request', request.method, request.url, request.params)

  return (res) => {
    Vue.$vux.loading.hide()
    // console.log('response', res.body)
    if (res.status !== 200 && res.status !== 401) {
      let msg = Vue.i18n.translate('apiError.unknown')
      if (res.body) {
        if (res.body.indexOf('<!DOCTYPE html>') === 0) {
          let reses = /.*<p class="break-long-words trace-message">(.*)<\/p>.*/.exec(res.body)
          if (reses.length > 1) msg = reses[1]
        } else {
          msg = res.body
        }
      }
      Vue.$vux.alert.show({title: '提示', content: msg})
    } else if (res.status === 200) {
      if (res.body.code !== '') {
        Vue.$vux.alert.show({title: '提示', content: Vue.i18n.translate('apiError.' + res.body.code)})
        throw new Error(res.body.code)
      }
    }
  }
})

FastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
