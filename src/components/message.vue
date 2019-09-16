<template>
  <div></div>
</template>

<i18n>
餐桌已被移动:
 en: The table has been moved
 th: โต๊ะถูกย้าย
 ru: Стол был перемещен
 kr: 테이블이 이동되었습니다
 jp: テーブルが移動されました
</i18n>

<script>
import Stomp from 'stompjs'
import { mapState, mapGetters } from 'vuex'

export default {
  data() {
    return {
      stompClient: null,
      subscription: null
    }
  },
  computed: {
    ...mapState(['tableId']),
    ...mapGetters(['restaurantInfo', 'cartItems'])
  },
  watch: {
    tableId: function(val) {
      if (val === 0) {
        this.socket_close()
      }
      if (val && this.restaurantInfo.message && val !== 0) {
        this.start_client()
      }
    },
    restaurantInfo: function(val) {
      if (val && this.tableId !== 0) {
        this.start_client()
      }
    }
  },
  // created: function() {
  //   if (this.tableId) {
  //     this.start_client()
  //   }
  // },

  destroyed: function() {
    this.socket_close()
  },
  methods: {
    socket_close: function() {
      if (this.subscription) {
        this.subscription.unsubscribe()
        console.log('Open Connection')
      }
    },
    start_client: function() {
      var url = this.restaurantInfo.message.server
      var login = this.restaurantInfo.message.login
      var pwd = this.restaurantInfo.message.password

      var client = Stomp.client(url)

      let that = this

      client.connect(login, pwd, function(frame) {
        that.subscription = client.subscribe(
          '/topic/guest-' + that.restaurantInfo.id + '-' + that.tableId,
          that.handle_message
        )
      })

      client.debug = null
      that.stompClient = client
    },
    handle_message: function(frame) {
      var response = JSON.parse(frame.body)
      let that = this
      if (response.action === 'table_update') {
        let newTable = response.data.table

        if (newTable.status !== 'InUse') {
            // eslint-disable-next-line camelcase
          let cart_id = newTable.cart_id

            // eslint-disable-next-line camelcase
          if (cart_id === this.cartItems.id) {
            let url = process.env.SITE_BASE
            that.$vux.alert.show({
              title: that.$t('提示'),
              content: that.$t('餐桌已被移动'),
              maskZIndex: 100,
              onHide () {
                window.location.href = url + '/restaurants/' + that.restaurantInfo.id
              }
            })
          }
        }
      }
    }
  }
}
</script>
