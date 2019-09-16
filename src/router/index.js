import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/pages/index'
import RestaurantDetail from '@/pages/restaurant/index'
import RestaurantTables from '@/pages/restaurant/tables'
import RestaurantMenu from '@/pages/restaurant/menu'
import MenuDetail from '@/pages/restaurant/menu-detail'

import Cart from '@/pages/cart/index'
import OrderResult from '@/pages/cart/order-result'

import UcenterIndex from '@/pages/ucenter/index'
import UcenterOrders from '@/pages/ucenter/orders'
import OrderDetail from '@/pages/ucenter/order'

Vue.use(Router)

let pages = [
  { path: '/', component: Home, name: 'Home', meta: {title: 'Home', class: 'p-home'} },
  { path: '/restaurants/:restaurant_id', component: RestaurantDetail, name: 'RestaurantDetail', meta: {title: 'PageTitle.RestaurantDetail', class: 'p-restaurant'} },
  { path: '/restaurants/:restaurant_id/tables', component: RestaurantTables, name: 'RestaurantTables', meta: {title: 'PageTitle.RestaurantTables', class: 'p-tables'} },
  { path: '/restaurants/:restaurant_id/tables/:table_id', component: RestaurantMenu, name: 'RestaurantMenu', meta: {title: 'PageTitle.RestaurantMenu', class: 'p-menus'} },
  { path: '/restaurants/:restaurant_id/tables/:table_id/:menu_id', component: MenuDetail, name: 'MenuDetail', meta: {title: 'PageTitle.MenuDetail', class: 'p-menu'} },
  { path: '/restaurants/:restaurant_id/cart', component: Cart, name: 'Cart', meta: {title: 'PageTitle.Cart', class: 'p-cart'} },
  { path: '/order-result/:order_id', component: OrderResult, name: 'OrderResult', meta: {title: 'PageTitle.OrderResult', class: 'p-order-result'} },
  { path: '/orders/:order_id', component: OrderDetail, name: 'OrderDetail', meta: {title: 'PageTitle.OrderDetail', class: 'p-order-detail'} },
  { path: '/ucenter', component: UcenterIndex, name: 'UcenterIndex', meta: {title: 'PageTitle.UcenterIndex', class: 'p-ucenter'} },
  { path: '/ucenter/orders', component: UcenterOrders, name: 'UcenterOrders', meta: {title: 'PageTitle.UcenterOrders', class: 'p-ucenter-orders'} },
]

export default new Router({
  routes: pages,
  mode: 'history',
  linkActiveClass: 'active',
  // base: '/portal',
  scrollBehavior: function (to, from, savedPosition) {
    return savedPosition || { x: 0, y: 0 }
  },
})
