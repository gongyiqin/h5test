<template lang="pug">
.page.page-ucenter
  .user-box
    img(:src='userinfo.avatar || "/static/images/avatar-default.png"')
    span {{userinfo.name || $t('匿名用户')}}
  ul.navi
    router-link(to='/ucenter/orders' tag='li'): a(href='#') {{$t('我的订单')}}

  .account-actions(v-if='userinfo.id')
    a.button.logout(:href='logoutUrl' @click.prevent='logout') {{$t('退出登录')}}
  .social-login(v-else)
    .hr-title: span {{$t('使用以下账号登录')}}
    a(:href='loginUrl'): i.iconfont.if-facebook
    a(:href='loginUrl'): i.iconfont.if-line
    a(:href='loginUrl'): i.iconfont.if-zhifubao
    a(:href='loginUrl'): i.iconfont.if-weixin
</template>

<i18n>
匿名用户:
  en: Anonymous
  th: ไม่ระบุชื่อ
  ru: Анонимный пользователь
  kr: 익명 고객
  jp: 匿名ユーザー

我的订单:
  en: My orders
  th: รายการที่สั่งของฉัน
  ru: Мой заказ
  kr: 나의 주문
  jp: 私の注文書

退出登录:
  en: Logout
  th: ตกลงออกจากระบบ
  ru: Выход из системы
  kr: 로그아웃
  jp: ログアウト

使用以下账号登录:
  en: Please login first
  th: ใช้บัญชีนี้เข้าสู่ระบบ
  ru: Войдите в систему, используя следующую учетную запись
  kr: 아래 계정으로 로그인 합니다
  jp: 下記のアカウントを使用しますか

确定要退出登录吗？:
  en: Are you sure to logout?
  th: ตกลงออกจากระบบ
  ru: Вы уверены, что хотите выйти?
  kr: 로그아웃 하시겠습니까?
  jp: ログインをログアウトしますか？
</i18n>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    const accountPath = process.env.ACCOUNT_ROOT
    return {
      loginUrl: `${accountPath}/login?return_url=${location.href}`,
      logoutUrl: `${accountPath}/logout?return_url=${location.href}`,
    }
  },
  computed: {
    ...mapGetters(['userinfo']),
  },
  methods: {
    logout() {
      this.$vux.confirm.show({
        title: this.$t('提示'),
        content: this.$t('确定要退出登录吗？'),
        onConfirm() {
          location.href = this.logoutUrl
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import 'setting';
.user-box { padding: 30px 0;
  img { display: block; margin: 0 auto; border-radius: 100%; width: 100px; height: 100px; }
  span { display: block; padding-top: 20px; text-align: center; font-size: 20px; }
}

.navi { background: rgba(0,0,0,.3); border-radius: 5px; margin: 15px; padding-left: 15px;
  li { font-size: 15px; border-top: 1px solid rgba(255,255,255,.1);
    &:first-child { border-top: none; }
    a { display: block; padding: 12px 15px 12px 0; color: $white; }
  }
}
.social-login { padding-top: 80px; text-align: center;
  .hr-title { margin: 0 15px 30px; }
  a { display: inline-block; padding: 0 20px; color: $white;
    i { width: 50px; height: 50px; overflow: hidden; border-radius: 5px; line-height: 56px; font-size: 56px;
      background: #46B036; text-align: center;
      &:before { position: relative; top: -3px; left: -3px; }
      &.if-facebook { background: #3B589C; }
      &.if-line { background: #01B901; }
      &.if-zhifubao { background: #01AAEF; }
      &.if-weixin { background: #46B036; }
    }
  }
}

.account-actions { padding: 20px 15px;
  a.logout { display: block; text-align: center; background: none; border: 1px solid rgba(255,255,255,.3); border-radius: 30px;
    color: rgba(255,255,255,.8);
  }
}
</style>

