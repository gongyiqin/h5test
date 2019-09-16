<template lang="pug">
.page.page-home.cover-box
  .logo: img(src='/static/images/5.jpeg')
  div.res_list
    div.row.align_center.positon.box
      div.img
        img(src='/static/images/5.jpeg')
      div
        span.ml-3 {{$t('餐厅名称')}}
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
  computed: {
    ...mapState(['lang']),
  },
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
  border: 1px solid white;
  padding: 4px;
  background-color: rgba(0,0,0,0.3);
  margin-top: 8px;
  box-shadow: black
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
  margin-left: 10px
}
</style>
