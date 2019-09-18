<template lang="pug">
  .page.page-home.cover-box
    .logo: img(src='/static/images/5.jpeg')
    div.res_list
      div.row.align_center.positon.box(v-for="(item,index) in restaurants" @click="go_restaurant(item,index)")
        div.img
          img(:src='item.thumbUrl')
        div.column.align-between
          span.ml-3 {{item.name}}
          span.ml-3 {{$t('人均消费：')}} <em>{{ item.per }}</em>
          span.ml-3 {{$t('营业时间：')}} {{ item.openTime }}
        div.left
          span  {{$t('>')}}
    Langs
</template>

<i18n>
  目前仅支持通过商家二维码进入点餐，谢谢。:
  en: Only support for ordering through the merchant QR code, thank you.
  th: ในปัจจุบันการสนับสนุนเฉพาะสำหรับการสั่งซื้อผ่านรหัส QR ของที่ร้าน ขอบคุณค่ะ
  ru: В настоящее время, только поддержка заказа через QR-код продавца, спасибо.
  kr: 현재 가게 QR 코드로만 주문 가능합니다. 감사합니다.
  jp: 現在ただ店舗ＱＲコードを通して料理を注文するだけです、ありがとうございます。

</i18n>

<script>
  import { mapState } from 'vuex'
  import Langs from '../components/langs'

  export default {
    components: {
      Langs,
    },
    data() {
      return {
        restaurants: [
          {name: ' 鸭汤裸条店 ', uid: '9b35bad9-d1e7-11e8-a759-02923678cfa4', per: '50 THB', openTime: '10:00am - 10:00pm', table: 1281, thumbUrl: 'https://files.thaiok.menu/r/test0006/002/thumb.jpg'},
          {name: ' Kalare中泰料理  ', uid: 'a8ed445a-8944-475a-b002-96398eb9a2f6', per: '100 THB', openTime: '10:00am - 05:00pm', table: 1199, thumbUrl: 'https://files.thaiok.menu/r/test0005/j028/thumb.jpg'},
          {name: ' Kalare泰式粉条 ', uid: 'ffa8e36d-e4b6-4702-80ea-6bbb46ec993b', per: '50 THB', openTime: '12:00am - 11:30pm', table: 1219, thumbUrl: 'https://files.thaiok.menu/r/test0004/kn016/thumb.jpg'},
          {name: ' Kalare海鲜烧烤 ', uid: '500a04c5-d068-4377-b8b5-e3cba558bb9a', per: '200 THB', openTime: '11:00am - 04:00pm', table: 1231, thumbUrl: 'https://files.thaiok.menu/r/test001/f016/thumb.jpg'},
          {name: ' 殷家曼谷店 ', uid: '5aebbc7a-7c9d-4b10-8bc4-95e3819c886f', per: '200 THB', openTime: '9:00am - 05:00pm', table: 981, thumbUrl: 'https://files.thaiok.menu/r/test0002/e021/thumb.jpg'},
          {name: ' Laemhin Seafood ', uid: '31cdc3c0-078f-473a-8cdb-4ca742474cbd', per: '300 THB', openTime: '10:00am - 10:00pm', table: 958, thumbUrl: 'https://files.thaiok.menu/r/test0008/1404/thumb.jpg'},
          {name: ' Savoey PhuKet ', uid: 'ed45bbf5-2546-473d-aa75-5a44a69c2806', per: '200 THB', openTime: '10:00am - 12:00pm', table: 1067, thumbUrl: 'https://files.thaiok.menu/r/public/j011/thumb.jpg'},
          {name: ' Yong Sea food  ', uid: 'b786d5f7-e609-49c2-b078-a31bd76c0f97', per: '200 THB', openTime: '9:30am - 10:00pm', table: 854, thumbUrl: 'https://files.thaiok.menu/r/test01113/j085/thumb.jpg'},
          {name: ' HONGKONG HOTPOT ', uid: '082c857d-1deb-4679-aa93-db8e3b5353bc', per: '300 THB', openTime: '11:00am - 05:00pm', table: 822, thumbUrl: 'https://files.thaiok.menu/r/qm0017/1.jpg'},
          {name: ' 枕木美食餐厅 Sea food ', uid: '2732385a-4f7e-4503-adb5-e2ea58edb06f', per: '260THB', openTime: '12:00am - 10:00pm', table: 682, thumbUrl: 'https://files.thaiok.menu/r/test0111/j008/thumb.jpg'}
        ],
      }
    },
    computed: {
      ...mapState(['lang']),
    },
    created() {
      console.log(this.restaurantInfo)
    },
    methods: {
      go_restaurant(item) {
        this.$router.push({path: `restaurants/${item.uid}/tables/${item.table}`})
        // window.location.href = `https://h5.thaiok.menu/restaurants/${item.uid}/tables/${item.table}`
      }
    }
  }
</script>

<style lang="sass">
  @import 'setting';
  .cover-box {
    .logo {
      img { display: block; width:100%;height:150px}
  }
    .unavailableNote { padding: 40px 20px 80px; color: $white; text-align: center;}
    .langs { padding-bottom: 100px;}
  }
  .res_list {
    width: 100%;
    height: auto;
    /*border: 1px solid red;*/

  }
  .box{
    padding: 4px;
    background-color: rgba(0,0,0,0.3);
    margin-top: 8px;
    box-shadow:0 0 5px #000000;
    border-radius: 5px;
  }
  .position{
    position: relative;
  }
  .row{
    display: flex;
    flex-direction: row;
  }
  .align_center{
    align-items: center
  }

  .img img{
    width: 90px;
    height: 100%;
  }
  .left{
    position: absolute;
    right:8px
  }
  .ml-3{
    margin-left: 10px;
    em{
    color: $primary;
  }
  }
  .column{
    display: flex;
    flex-direction: column;
    height: 80px
  }
  .align-between{
    justify-content: space-around
  }
</style>
