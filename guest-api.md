# thaiok api for guest client

## Base Url

https://api.thaiok.menu/{version}/guest/

version 为版本号

## 1. Response Wrapper

http status 200 的情况下，返回值包装为如下结构

```
{
  "code": "", //空字符串表示成功， 其他值也都表示失败，并且是具体原因
  "data": jsondata, // 需要返回的值
}
```

 用户没有权限会返回 http status 401

## 2. API 定义

### 2.1 用户状态

#### 2.1.1 通过获取当前用户

- GET session
- Params: wxcode?
- Response: User

#### 2.1.2 修改当前用户信息

- POST updateuserinfo
- POST Data:
  > name   用户名称
  > avatar 用户头像
  > gender 用户性别

### 2.2 餐厅

#### 2.2.1 获取餐厅

- GET restaurants/{restaurant_id}
- Params:
  > restaurant_id： 餐厅 ID
- Response: Restaurant
- Response fail: RESTAURANT_NOT_FOUND //餐厅不存在

#### 2.2.2 获取餐桌状态

- GET tables/{table_id}/status
- Params:
  > table_id: 餐桌的 ID
- Response:

```JSON
{
  "status": "inuse/available/locked",  // 状态值
  "people": [User, ...]   // 在共同点餐的人
}
```

- Response Fail code: TABLE_NOT_FOUND //餐桌不存在

#### 2.2.3 获取用户位置

- GET restaurants/{restaurant_id}/usertable
- Params:
  > restaurant_id: 餐厅ID
- Response:  null or
```JSON
  {
    "table_id": 0,
    "passcode": ""
  }
```

### 2.3 点餐

#### 2.3.1 用户进入餐桌

- POST tables/{table_id}/enter
- Params:
  > table_id: 当前餐桌的 ID
- Post Data:
  > pers? : 人数，第一次进入必须填写
  > passcode?: 进入码（4 位数字）， 最先进入者无需填写，后面加入需填写
- Response:

```JSON
{
  "passcode": ""
}
```

- Response fail:
  > PASSCODE_WRONG // 密码错误
  > TABLE_IS_LOCKED // 餐桌处于锁定状态，不能进入
  > TABLE_NOT_FOUND // 餐桌不存在
  > PERS_NOT_EXISTS // 第一次进入餐桌必须提供人数参数

#### 2.3.2 用户退出点餐

- POST tables/{table_id}/quit
- Params:
  > table_id: 当前餐桌的 ID
- Response:

```JSON
{
  "passcode": ""
}
```

#### 2.3.3 添加或者删除菜品

- POST tables/{table_id}/menu
- Params:
  > table_id
- Post Data:

  > menu_id: 菜品 ID

  > quantity: 数量 1 OR -1

  > package?: {attr2_key: "", attr2_key: ""}, （可选）

  > favorites?: [...]， （可选）

- Response:

```JSON
{
  "key":{
    "menu_id": 0,
    "quantity": 0,
    "package": {"attr2_key": "", "attr2_key": ""},
    "favorites": [MLF, ...],
    "price": 0,
    "normal_price": 0,
    "unit": "cup/piece/kg/100g"  // 单位

  },
  ...
}
```

- Response fail:
  > MENU_NO_PRICE 没有价格

#### 2.3.4 提交订单

订单提交成功后，服务端会清空购物车内容，并记录当前订单号，方便后续加菜

- POST tables/{table_id}/order
- Params:
  > table_id
- Post Data:
  > lang: 用户选择的语言
  > invoice: 发票抬头， (可选项)
- Response:

```JSON
  {
    "id": "" //订单ID
  }
```

- Response Fail code:
  > MENU_IS_EMPTY // 购物车为空

#### 2.3.5 获取订单详情

- GET orders/{order_id}
- Params:
  > order_id 订单 ID
- Response: Order
- Response fail:
  > ORDER_NOT_FOUND 表示订单不存在
- http status 401 表示无权查看该订单

#### 2.3.6 获取当前订单列表

- GET orders
- Query:
  > page? : 当前页码
- Response:

```JSON
{
  "current_page": 0,
  "page_size": 0,
  "page_count": 0,
  "items": [Order, ...]
}
```

## 3. Data Structure

### 3.1 Multiple Language Field (MLF)， 可能存在多个结构中

```JSON
{
  "local": "",  //泰文
  "cn": "",   //中文
  "en": ""  //英文
}
```

### 3.2 User

```JSON
{
  "id": "",  //匿名时为空，其他为真实ID
  "name": "",  // 匿名是为：Guest， 其它为真实显示名称
  "avatar": "https://xxx" //用户头像，没有则为空字符串
}
```

### 3.3 Table

```JSON
{
  "id": 0,
  "code": "", // 桌号 用于显示，也可以用于排序，从小到大排列
  "name": MLF,
  "status": "available/inuse/locked",
  "capacity": 0  // 可以容纳的人数
}
```

### 3.4 MenuItem

```JSON
{
  "id": 0,
  "name": MLF,  // 名称
  "content": MLF, // 介绍html格式
  "thumb_img": "https://url",  // 缩略图
  "swiper_img": ["https://url", ...],  // 轮播图
  "price": 0, // 起始价
  "normal_price":0,  // 起始价的原价，大于或者等于起始价，拿来划掉的
  "unit": "",
  "selected": { "attr": "", "attr2": ""},
  "weight": 0, // 用于排序，从大到小排列,
  "category_id": 0,
  "favorites": [Favorite,...],  // 口味选项， 比如： 少放辣椒，多放辣椒，不要香菜 等等
  "attributes": {
    "attr_key1": {
      "name": MLF,
      "values": {
        "v_key1": {
          "name": MLF,
          "weight": 10  // 用于该属性的值的显示排序，大的在前
        },
        "v_key2": {
          "name": MLF,
          "weight": 0
        }
      },
      "weight": 10
    },
    "attr_key2": {
      "name": MLF,
      "values": {
        "v_key1": {
          "name": MLF,
          "weight": 0
        },
        "v_key2": {
          "name": MLF,
          "weight": 0
        }
      },
      "weight": 0  // 用于多个属性排序， 大的在前
    },
    ...
  },
  "price_array": {
    "attr_key1:v_key1_attr_key2:v_key1": {
      "price": 0,
      "normal_price": 0,
      "unit": ""
    },
    "attr_key1:v_key1_attr_key2:v_key2": {
      "price": 0,
      "normal_price": 0,
      "unit": ""
    },
    ....
  }
}
// 说明： 属性有多个维度，每个维度有多个值， 这样形成一个价格矩阵。 价格key值（price_array）由属性key及属性值key拼接而成， 算法如下： {属性KEY}:{属性值的KEY} 作为每个属性值才参与计算的值（AV_key）， 最后的价格Key值由组合的AV_key，排序后下划线拼接而成。
```


### 3.5 Restaurant

```JSON
{
  "id": "",
  "name": MLF,
  "content": MLF,
  "status": "Open/Closed", // 餐厅状态，是否处于营业时间
  "tables": [Table...],
  "menu": [
    {
      "id": 0,  // 菜品类别ID
      "name": MLF,  // 菜品泪奔名称
      "weight": 0, // 类别顺序，大的在前
      "thumb_img": "https://url",  // 分类的缩略图
      "items": [MenuItem, ...]
    }
  ]
}
```

### 3.6 Order

```JSON
{
  "id": "", // 字符串
  "restaurant_id": "",
  "restaurant_name": MLF,
  "table_id": "",
  "table_name": MLF,
  "price": 0, // 实际售价
  "normal_price": 0, // 原价
  "pay_price": 0,  //实际支付的价格,
  "service_charge": 0,  //服务费,
  "tax": 0,  //税费,
  "discount": 0,  //折扣,
  "is_paid": true, // or false
  "pay_method": "cash", //支付方式 creditcard cash online 等，目前
  "pers": 0, // 用餐人数
  "remark": {
    "xxx added 2000-10-1 12:10:01": {
      "user": "", // 提交订单着名称
      "invoice": "",  //是否要发票的说明
      "timestamp": "" // 时间戳
    }
  },
  "items": [OrderItem, ...],
  "created_at": "", //订单创建时间
  "paydate": "" //订单支付时间

}
```

### 3.7 OrderItem

```JSON
{
  "id": 0,
  "order_id": 0,
  "menu_id": 0,
  "quantity": 0, // 数量
  "price": 0,  //价格
  "normal_price": 0,  //原价
  "tags": "xxx added at yyyy-mm-dd hh:mm:ss",
  "info": {, // 菜单的名称 口味，规格等
    "name": MLF,
    "package": Package,
    "favorites": [Favorite,]
  }
}
```

### 3.8 套餐 Package

```JSON
{
  "code": "",
  "name": MLF,
  "price": 0,
  "normal_price": 0
}
```

### 3.8 套餐 Favorite

```JSON
{
  "code": "",
  "name": MLF,
}
```

## 4. Pages and path

### 4.1 餐厅首页， 用户通过扫码进入该地址

Path: /restaurants/{restaurant_id}

### 4.2 餐厅选座位

Path: /restaurants/{restaurant_id}/tables

### 4.3 餐厅点餐, 该地址有可能用户通过分享链接或者桌上扫码直接进入

Path: /restaurants/{restaurant_id}/tables/{table_id}?passcode=xxxx

### 4.4 查看历史订单

Path: /orders

### 4.5 查看订单详情

Path: /orders/{order_id}

### 4.6 个人信息

Path: /account

##  泰想去登录说明

 客户端登录地址为： https://account.thaiok.menu/login?return_url=xxxxx

登录完成会返回 return_url 指定的页面，并且获得 cookie 登录凭证，cookie 名为：apptoken
浏览器发送任何 http 请求之前，需要从 cookie 读取 token 的值，并添加到 http header 中发送，名称为 oktoken。
任何 api 返回时都会在 Response header 里带上新的 oktoken， 客户端需求保存该 token 到 cookie 中，并在下次请求中使用
javascript  示例代码如下：

```Javascript
import axios from 'axios'
const utils = require('../utils')

const request = axios.create();
let api_url = config.api_url
request.interceptors.request.use(config=>{
    config['baseURL'] = api_url
    config['timeout'] = 60006

    let token = utils.getCookie('oktoken')
    token = token.length>0?token:utils.getCookie('apptoken')

    config['headers'] = {
        'Content-Type':'application/json',
        'oktoken':token
    }
    return config;
}, error=>{
    return Promise.reject(error);
})
request.interceptors.response.use(res=>{

    if (res && res.data && res.data.code == ""){
        //handle header
        if ('oktoken' in res.headers){
            utils.setCookie('apptoken', res.headers['oktoken'], 30)
        }
    }

    return res && res.data ? res.data :null

}, error=>{

    return Promise.reject(error)
})
export {
    request
}
```
