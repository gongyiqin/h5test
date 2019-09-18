<template lang="pug">
  .page.page-order-result.flexCenter
    .result-infos
      h1 <i class="iconfont if-xiadanqueren"></i> {{$t('订单支付成功')}}
      p {{$t('您的订单已提交至收银台，店家会尽快处理')}}
      span.note
        router-link(:to='`/orders/${$route.params.order_id}`' replace) {{$t('{n}秒后进入订单详情页面', {n: timer})}}

</template>

<i18n>
  订单提交成功:
  en: Success
  th: สั่งซื้อสำเร็จ
  ru: Успешная подача заказа
  kr: 주문을 제출했습니다.
  jp: 注文書提出が成功しました

  您的订单已提交至收银台，店家会尽快处理:
  en: We got it, please wait a moment...
  th: ใบสั่งของท่านได้ส่งต่อให้ที่ร้านแล้วค่ะ
  ru: Ваш заказ отправлен в кассу, и хозяин обработает его как можно скорее
  kr: 주문을 이미 카운터에 제출했으니 빨리 처리해 드리겠습니다.
  jp: お客様の注文書は既にレジに提出しました、店舗はできるだけ早めに処理します

  '{n}秒后进入订单详情页面':
  en: 'Redirecting to detai page'
  th: 'กำลังเข้าสู่หน้าสั่งอาหาร'
  ru: '{n} секунд для входа на страницу с информацией о заказе'
  kr: '{n}초 후에 주문 확인을 하겠습니다.'
  jp: '{n}秒の後に注文書の詳しい情況のページに入ります'
</i18n>

<script>
  export default {
    data() {
      return {
        timer: 3,
      }
    },
    mounted() {
      this._$updateTitle(this.$t('订单提交成功'))
      const theTimer = setInterval(() => {
        if (this.timer > 1) this.timer--
        else {
          clearInterval(theTimer)
          this.$router.replace('/orders/' + this.$route.params.order_id)
        }
      }, 1000)
    }
  }
</script>

<style lang="scss">
  @import 'setting';
  .page-order-result { text-align: center;
    h1 { margin: 0 0 20px; font-size: 40px;
      .iconfont { display: block; margin: 0 auto 15px; width: 80px; height: 80px; border-radius: 100%;
        background: #7589AC; color: $white; border: 1px solid $white;
        font-size: 48px; line-height: 80px; text-align: center;
      }
    }
    .result-infos { padding-bottom: 100px;
      p { font-size: 16px; }
      .note { display: block; margin-top: 40px; font-size: 12px; color: #DDD;
        a { color: $white; }
      }
    }
  }
</style>
