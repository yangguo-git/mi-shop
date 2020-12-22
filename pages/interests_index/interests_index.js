var util = require('../../utils/util.js');
var httpUtil = require('../../utils/httpUtil');
var config = httpUtil.config;
var app = getApp();
var is_scrollto = true;
var id_num = 0,
  kongge_phone, lingshi_ok_price, arr_data_products, arr_data_ptypes, myCouponId = "";

Page({
  data: {
    tengxun_vip_input_value: '',
    show_html: 0,
    addr_2_data: [],
    addr_1_data: [],
    if_show: false,
    is_qq_show: false,
    scroll_x: false,
    phone_type: '',
    maxlength: '13',
    input_type: 'number',
    coupons_1: [],
    coupons_2: [],
    moneytype: 1,
    productId: false,
    phone: '',
    addr_4_data_id: false,
    in_right_top: false,
    in_card_bg_show: false,
    show_summarize: false,
    if_phone_list: false,
    if_phone_yse: true,
    tab_two_click_item: 1,
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    swipeArrs:[]
  },
  onLoad: function (options) {
   let getArrs =  wx.getStorageSync('imgswiperArr');
   getArrs = JSON.parse(getArrs)
   console.log(getArrs)
   if(getArrs.linshiArr){
      this.setData({
        swipeArrs:JSON.parse(getArrs.linshiArr)
      })
   }

  },
  // 腾讯视频VIP视频卡片输入框失去焦点事件
  tengxun_vip_input_blur: function (e) {
    var qq_numble = e.detail.value
    console.log('qq_numble1:', qq_numble, qq_numble.length)
    if (qq_numble.length >= 5 && qq_numble.length <= 12) {
      console.log('qq_numble2:', qq_numble, qq_numble.length)
      this.setData({
        tengxun_vip_input_value: qq_numble
      })
    } else {
      this.setData({
        tengxun_vip_input_value: ''
      })
    }
  },
  hide_is_tengxun_vip: function () {
    this.setData({
      is_tengxun_vip: false
    })
  },
  // 腾讯VIP卡片支付
  is_ten_x_v_pay: function (e) {
    var that = this;
    that.data.is_qq_show = false;
    if (this.data.tengxun_vip_input_value != '') {
      wx.showModal({
        title: that.data.tengxun_vip_input_value,
        content: '是否为该QQ号充值腾讯视频VIP',
        success: function (res) {
          if (res.confirm) {
            that.data.is_qq_show = true;
            that.topUp_success();
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '请输入正确的QQ号码',
      })
    }
  },
  // 充值
  topUp_success: function (e) {
    if (this.data.producttype == 5 && this.data.preferentialtype == 1 && this.data.in_card_bg_show) {
      this.setData({
        is_tengxun_vip: true
      })
      if (!this.data.is_qq_show) {
        return;
      }
    }
    var that = this;
    var url = config.reqUrl + '/v1/product/getPayConfig.do';
    var store_obj = that.data.products.find((item) => {
      //现在购买的商品对象
      return item.productId === that.data.addr_4_data_id
    })
    var _phone = that.data.kongge_phone.replace(/\s*/g, "");
    if (!that.data.in_card_bg_show) {
      // 没使用权益，可以使用优惠券
      var yse_Coupon_list = [];
      try {
        if (that.data.item_coupons_list.length > 0) {
          for (var i = 0; i < that.data.item_coupons_list.length; i++) {
            if (store_obj.originalPrice >= that.data.item_coupons_list[i].couponThreshold) {
              // couponData 优惠金额  couponThreshold  门槛  myCouponId 优惠券id
              yse_Coupon_list.push(that.data.item_coupons_list[i]);
            }
          }
        }
      } catch (er) {}
      // console.log('符合标准的优惠券：', yse_Coupon_list)
      if (yse_Coupon_list.length > 0) {
        var yse_couponData = Math.max.apply(Math, yse_Coupon_list.map(function (o) {
          return o.couponData
        }));
        // console.log('优惠券最大的优惠金额：', yse_couponData)
        var obj_coupon = yse_Coupon_list.find((item) => {
          if (item.couponData === yse_couponData) {
            return item
          }
        })
        // console.log('符合标准并且最大的优惠金额的对象：', obj_coupon)
        var price = store_obj.productPrice - obj_coupon.couponData;
        // console.log('商品原价减去优惠券的优惠金额：', price)

        var data = {
          productId: store_obj.productId,
          number: _phone,
          price: (Math.round(price * 100 * 100) / 100),
          myCouponId: obj_coupon.myCouponId,
        }
      } else {
        var data = {
          productId: store_obj.productId,
          number: _phone,
          price: (Math.round(store_obj.productPrice * 100 * 100) / 100),
          myCouponId: '',
        }
      }

    } else {
      // 使用权益，优惠券不能使用

      if (this.data.tengxun_vip_input_value) {
        // 如果选择的是腾讯VIP视频，并且填写了QQ号码
        var data = {
          productId: store_obj.productId,
          number: _phone,
          price: (Math.round(store_obj.productPrice * 100 * 100) / 100),
          myCouponId: '',
          qqNumber: this.data.tengxun_vip_input_value,
          token: app.token
        }
      } else {
        var data = {
          productId: store_obj.productId,
          number: _phone,
          price: (Math.round(store_obj.productPrice * 100 * 100) / 100),
          myCouponId: '',
        }
      }
    }
    var url = config.reqUrl + '/v1/product/getPayConfig.do';
    util.request(url, 'post', data, '加载中', function (res) {
      if (!res.data) {
        wx.showToast({
          title: res.msg || '系统繁忙，请稍候再试',
          icon: 'none',
          duration: 1000
        });
        return;
      };
      // String productId, String number, Integer price, String myCouponId
      if (res.data.success == true) {
        wx.requestPayment({
          'timeStamp': res.data.body.timeStamp,
          'nonceStr': res.data.body.nonceStr,
          'package': res.data.body.wxPackage,
          'signType': res.data.body.signType,
          'paySign': res.data.body.paySign,
          'success': function (res) {
            that.setData({
              is_tengxun_vip: false
            })
            wx.redirectTo({
              url: "/pages/member/xuni_orderList/xuni_orderList?orderStatus=3"
            })
          }
        })
      } else {
        if (res.data.msg) {
          wx.showModal({
            title: '温馨提示',
            content: res.data.msg,
          })
        }
      }
    }, function (e) {
      wx.showToast({
        title: '网络错误,请稍后再试。。。',
        icon: 'none'
      })
    })
  },
  onShow: function () {
    this.on_data();
    var that = this;
    if (wx.getStorageSync('to_wx55b926152a8c3bef') == true) {
      // wx.navigateTo({
      //   url: 'orderUp_success/orderUp_success?status=' + that.data.in_card_bg_show,
      // })
    }
    if (wx.getStorageSync('phone')) {
      this.setData({
        btn_phone: false
      })
    } else {
      this.setData({
        btn_phone: true
      })
    }
  },
  // 页面加载数据
  on_data: function (e) {
    var that = this;
    var url = config.reqUrl + '/v1/product/index.do';
    util.request(url, 'get', {}, '正在加载数据', function (res) {
      // phone手机号      // hPhones		  历史手机号列表
      // banners		  banner列表
      // products		  产品列表
      // ptypes		    分类列表  位置 1流量， 2话费， 3权益
      // mproducts	 	组合产品列表
      // coupons      优惠卷
      // couponType   1 流量  2  话费
      // couponData   优惠多少钱
      var _data = res.data.body;
      // 价钱排序
      //  _data.products.sort(util.sortNumber('productPrice'))

      that.setData({
        coupons_langth: _data.coupons.length
      })

      for (let i = 0; i < _data.coupons.length; i++) {
        _data.coupons[i].couponData = _data.coupons[i].couponData / 100
        // 优惠券
        if (_data.coupons[i].couponType == 1 || _data.coupons[i].couponType == 3) {
          that.setData({
            coupons_1: that.data.coupons_1.concat(_data.coupons[i]),
          })
        } else if (_data.coupons[i].couponType == 2 || _data.coupons[i].couponType == 3) {
          that.setData({
            coupons_2: that.data.coupons_2.concat(_data.coupons[i]),
            item_coupons_list: that.data.coupons_2.concat(_data.coupons[i])
            //默认优惠券是话费
          })
        }
      }
      var coupons_1_money = Math.max.apply(Math, that.data.coupons_1.map(function (o) {
        return o.couponData
      }));
      var coupons_2_money = Math.max.apply(Math, that.data.coupons_2.map(function (o) {
        return o.couponData
      }));
      that.setData({
        coupons_1_money: coupons_1_money,
        coupons_2_money: coupons_2_money
      });
      for (let i = 0; i < _data.products.length; i++) {
        _data.products[i].originalPrice = _data.products[i].originalPrice / 100;
        _data.products[i].productPrice = _data.products[i].productPrice / 100;
      }
      arr_data_products = _data.products;
      arr_data_ptypes = _data.ptypes;
      that.data.operatorType = 1;
      that.set_data()
      that.setData({
        banners: _data.banners,
        mproducts: _data.mproducts,
        ptypes: _data.ptypes,
      })
      try {
        if (_data.hphones) {
          that.setData({
            hPhones: _data.hphones.slice(0, 3),
            phone_show_list: _data.hphones.slice(0, 3)
          })
        }
        if (_data.phone) {
          that.setData({
            phone: _data.phone,
          })
          that.add_kongge(_data.phone);
        } else {
          that.setData({
            phone: wx.getStorageSync('ss_phone')
          })
          that.add_kongge(wx.getStorageSync('ss_phone'));
        }
      } catch (err) {
      }
    }, function (e) {
      wx.showToast({
        title: '网络错误,请稍后再试。。。',
        icon: 'none'
      })
    })
  },
  // 根据手机号段做数据处理
  set_data: function () {
    var that = this;
    var addr_1_data = [],
      addr_2_data = [],
      addr_3_data = [],
      is_list_data = [];
    arr_data_products.forEach(item => {
      if (item.operatorType && item.operatorType.indexOf(that.data.operatorType) != -1) {
        is_list_data.push(item)
      }
    })
    // is_list_data = arr_data_products
    for (let i = 0; i < arr_data_ptypes.length; i++) {
      if (arr_data_ptypes[i].addr == 1) {
        for (let j = 0; j < is_list_data.length; j++) {
          if (is_list_data[j].productType == arr_data_ptypes[i].productTypes) {
            try {
              is_list_data[j].productPrice = is_list_data[j].productPrice.toFixed(2);
            } catch (e) {}
            addr_1_data.push(is_list_data[j]);
          }
        }
      } else if (arr_data_ptypes[i].addr == 2) {
        for (let j = 0; j < is_list_data.length; j++) {
          if (is_list_data[j].productType == arr_data_ptypes[i].productTypes) {
            try {
              is_list_data[j].productPrice = is_list_data[j].productPrice.toFixed(2);
            } catch (e) {}
            addr_2_data.push(is_list_data[j]);
          }
        }
      } else if (arr_data_ptypes[i].addr == 6) {
        console.log(is_list_data)
        for (let j = 0; j < is_list_data.length; j++) {
          for (let y = 0; y < arr_data_ptypes[i].productTypes.length; y++) {
            if (is_list_data[j].productType == arr_data_ptypes[i].productTypes[y]) {
              addr_3_data.push(is_list_data[j]);
            }
          }
        }
      }
    }
    that.setData({
      addr_1_data: addr_1_data,
      addr_2_data: addr_2_data,
      addr_3_data: addr_3_data,
      // addr_3_data_item: addr_3_data,
      products: is_list_data,
    })
  },
  to_nav: function (e) {
    wx.navigateTo({
      url: '../my/my_coupon/my_coupon',
    })
  },
  // 点击流量，话费充值
  tab_two_click: function (e) {
    // 点击tab清空之前选择的
    this.setData({
      producttype: false,
      preferentialtype: false,
      tab_two_click_item: e.currentTarget.id,
      productId: false,
      in_card_bg_show: false,
      addr_4_data_id: false,
      show_summarize: false,
      in_right_top: false
    })
    let mproducts = this.data.mproducts;
    let productId;
    if (e.currentTarget.id == 1) {
      // 流量
      this.setData({
        item_coupons_list: this.data.coupons_2
      })
      productId = this.data.addr_2_data[0].productId;
      // let aa = { currentTarget: { dataset: { productid: bb}}}
      // this.changeType(aa)
    } else {
      // 话费
      this.setData({
        item_coupons_list: this.data.coupons_1
      })
      productId = this.data.addr_1_data[0].productId;

    }
    let addr_3_data_ay = [];
    for (var i = 0; i < mproducts.length; i++) {
      if (mproducts[i].subPs[0] == productId) {
        for (var j = 0; j < this.data.addr_3_data.length; j++) {
          if (mproducts[i].subPs[1] == this.data.addr_3_data[j].productId) {
            addr_3_data_ay.push(this.data.addr_3_data[j])
          }
        }
      } else if (mproducts[i].subPs[1] == productId) {
        for (var j = 0; j < this.data.addr_3_data.length; j++) {
          if (mproducts[i].subPs[0] == this.data.addr_3_data[j].productId) {
            addr_3_data_ay.push(this.data.addr_3_data[j])
          }
        }
      }
    }
    this.setData({
      addr_3_data_item: addr_3_data_ay,
    })
  },
  show_tt: function () {
    wx.showToast({
      title: '请输入手机号',
      icon: 'none'
    })
  },
  /**
   * 切换数额
   */
  changeType: function (e) {
    var that = this;
    let productId = e.currentTarget.dataset.productid;
    let mproducts = this.data.mproducts;
    var addr_3_data_ay = [];
    for (var i = 0; i < mproducts.length; i++) {
      if (mproducts[i].subPs[0] == productId) {
        for (var j = 0; j < this.data.addr_3_data.length; j++) {
          if (mproducts[i].subPs[1] == this.data.addr_3_data[j].productId) {
            addr_3_data_ay.push(this.data.addr_3_data[j])
          }
        }
      } else if (mproducts[i].subPs[1] == productId) {
        for (var j = 0; j < this.data.addr_3_data.length; j++) {
          if (mproducts[i].subPs[0] == this.data.addr_3_data[j].productId) {
            addr_3_data_ay.push(this.data.addr_3_data[j])
          }
        }
      }
    }
    id_num = productId;
    this.setData({
      producttype: false,
      preferentialtype: false,
      addr_3_data_item: addr_3_data_ay,
      productId: productId,
      in_card_bg_show: false,
      addr_4_data_id: productId,
      in_right_top: false,
      originalPrice: e.currentTarget.dataset.originalprice,
      productContent: e.currentTarget.dataset.productcontent,
      num_productPrice: e.currentTarget.dataset.productprice,
      productName: e.currentTarget.dataset.store_name
    });
    if (that.data.show_summarize == false) {
      that.scrollto();
    }
    try {
      if (!that.data.in_card_bg_show) {
        var store_obj = that.data.products.find((item) => {
          //现在购买的商品对象
          return item.productId === productId
        })
        // 没使用权益，可以使用优惠券
        var yse_Coupon_list = [];
        for (var i = 0; i < that.data.item_coupons_list.length; i++) {
          if (store_obj.originalPrice >= that.data.item_coupons_list[i].couponThreshold) {
            // couponData 优惠金额  couponThreshold  门槛  myCouponId 优惠券id
            yse_Coupon_list.push(that.data.item_coupons_list[i]);
          }
        }
        // console.log('符合标准的优惠券：', yse_Coupon_list)
        if (yse_Coupon_list.length > 0) {
          var yse_couponData = Math.max.apply(Math, yse_Coupon_list.map(function (o) {
            return o.couponData
          }));
          // console.log('优惠券最大的优惠金额：', yse_couponData)
          var obj_coupon = yse_Coupon_list.find((item) => {
            if (item.couponData === yse_couponData) {
              return item
            }
          })
          // console.log('符合标准并且最大的优惠金额的对象：', obj_coupon)
          var price = (store_obj.productPrice * 100 - obj_coupon.couponData * 100) / 100;
          // console.log('商品原价减去优惠券的优惠金额：', price)
          that.setData({
            ok_price: price.toFixed(2)
          })
        } else {
          that.setData({
            ok_price: false
          })
        }
      }
    } catch (err) {
      that.setData({
        ok_price: false
      })
    }
  },
  bind_bottom: function () {

  },
  // 屏幕滚动事件
  scrollto: function () {
    var that = this;
    setTimeout(function () {
      wx.pageScrollTo({
        scrollTop: 80,
        duration: 100
      })
    }, 100)
    this.setData({
      show_summarize: true,
    })
  },
  // 点击权益卡片的事件
  in_card: function (e) {
    if (this.data.show_summarize != true) {
      return
    }
    let id = e.currentTarget.id;
    let producttype = e.currentTarget.dataset.producttype;
    let preferentialtype = e.currentTarget.dataset.preferentialtype;
    this.data.producttype = e.currentTarget.dataset.producttype;
    this.data.preferentialtype = e.currentTarget.dataset.preferentialtype;
    console.log('判断是否为腾讯视频VIP优惠产品', e, producttype, preferentialtype);
    if (producttype == 5 && preferentialtype == 1) {
      this.data.is_tengxun_vip = true
    } else {
      this.data._is_tengxun_vip = false
    }
    console.log('aaaaaaaaaaaa：', this.data.in_right_top, id)
    if (this.data.in_right_top == id) {
      this.setData({
        ok_price: lingshi_ok_price,
        in_card_bg_show: false,
        in_right_top: false,
        addr_4_data_id: id_num
      })
      return
    } else {
      lingshi_ok_price = this.data.ok_price;
      this.setData({
        ok_price: false,
        productContent: e.currentTarget.dataset.productContent,
        in_card_bg_show: true,
        in_right_top: id
      })
    }
    let mproducts = this.data.mproducts;
    let productId = this.data.productId;
    for (let i = 0; i < mproducts.length; i++) {
      if (mproducts[i].subPs[0] == id) {
        if (mproducts[i].subPs[1] == productId) {
          this.setData({
            addr_4_data_id: mproducts[i].pid
          })
        }
      } else if (mproducts[i].subPs[1] == id) {
        if (mproducts[i].subPs[0] == productId) {
          this.setData({
            addr_4_data_id: mproducts[i].pid
          })
        }
      }
    }

  },
  // 转发功能
  onShareAppMessage: function () {
    return {
      title: '',
      imageUrl: 'https://unicomatc.weein.cn/act/share2.png',
      path: 'pages/index/index?action=switch',
      success: function (res) {

      },
    }
  },
  // 手机号码输入框值变动事件
  top_phone_input: function (e) {
    this.setData({
      maxlength: 11
    })
    try {
      var phone = e.detail.value.replace(/\s*/g, "");
    } catch (e) {

    }
    if (phone == '') {
      return
    }
    var arr = [];
    var hPhones = this.data.hPhones;

    if (hPhones instanceof Array) {
      hPhones.find(function (item) {
        var num = item.toString().substring(0, phone.length)
        if (num == phone) {
          arr.push(item)
        }
      })
      if (arr.length == 0) {
        this.setData({
          if_phone_list: false
        })
      } else if (arr.length > 0) {
        this.setData({
          phone_show_list: arr,
          if_phone_list: true
        })
      }
    }
  },
  // 失去焦点
  bindblur: function (e) {
    this.setData({
      input_type: 'number',
      maxlength: 13
    })
    let re = /^1\d{10}$/;
    if (re.test(e.detail.value)) {
      wx.setStorageSync('ss_phone', e.detail.value)
      this.add_kongge(e.detail.value)
    } else {

      this.setData({
        phone_type: '',
        show_summarize: false,
        if_phone_yse: false
      })
    }

  },
  // 添加空格
  add_kongge: function (e) {
    this.if_util_isUnicoms(e)
    try {
      kongge_phone = e.replace(/\s*/g, "");
      var result = [];
      for (var i = 0; i < kongge_phone.length; i++) {
        if (i == 3 || i == 7) {
          result.push(" " + kongge_phone.charAt(i));
        } else {
          result.push(kongge_phone.charAt(i));
        }
      }
      kongge_phone = result.join("");
      this.setData({
        kongge_phone: kongge_phone
      },()=>{
        this.setData({
          input_type: 'number'
        })
      })
    } catch (e) {}
  },
  // 手机号码 焦点事件
  top_phone_focus: function (e) {
    var that = this;
    // console.log('kongge_phone:', that.data.kongge_phone.replace(/\s*/g, ""))
    this.setData({
      input_type: 'text'
    })
    if (e.detail.value == "") {
      this.setData({
        if_phone_list: true
      })
    } else {
      this.setData({
        kongge_phone: that.data.kongge_phone.replace(/\s*/g, ""),
      })
    }
  },
  // 手机号列表点击事件
  item_phone_click: function (e) {
    this.setData({
      maxlength: '13',
      phone: e.target.id,
      if_phone_list: false
    })
    this.add_kongge(e.target.id);
  },
  // 手机号码授权
  phonenumber: function (e) {
    if (!wx.getStorageSync('infoAccess')) {
      wx.navigateTo({
        url: '../logs/logs',
      })
    }
    var that = this;
    this.setData({
      maxlength: '13',
      input_type: 'text',
      if_phone_list: false
    })
    // console.log('wx.getStorageSy:', wx.getStorageSync('phone'))
    if (wx.getStorageSync('phone')) {
      this.add_kongge(wx.getStorageSync('phone'))
      return;
    } else {

      let params = {
        encrypt_data: e.detail.encryptedData,
        iv: e.detail.iv
      }
      var url = config.reqUrl + '/minip/phone'
      util.request(url, 'post', params, '加载中', function (res) {
        if (res.data.status == 0) {
          res.data = res.data.data
          console.log('res', res.data)
          that.add_kongge(res.data)
          wx.setStorageSync('phone', res.data)

          that.setData({
            phone: res.data,
            btn_phone: false
          })
        } else {
          wx.navigateTo({
            url: '/pages/logs/logs',
          })
        }
      })
    }
  },
  // 验证手机号码展示充值可点击公共函数
  if_util_isUnicoms: function (e) {
    // console.log('验证手机号码展示充值可点击公共函数',e)
    var that = this;
    this._promise = new Promise((resolve) => {
      var url = config.reqUrl + '/v1/product/telAttribution.do'
      util.request(url, 'get', {
        'phone': e
      }, '', function (res) {
        if (res.data.body) {
          that.setData({
            if_phone_yse: true,
            phone_type: res.data.body
          })
          let _type = res.data.body.substr(res.data.body.length - 2);
          switch (_type) {
            case '移动': //移动
              that.data.operatorType = 1;
              that.set_data();
              resolve(that.data.operatorType)
              break;
            case '联通':
              that.data.operatorType = 2
              that.set_data();
              resolve(that.data.operatorType)
              break;
            case '电信':
              that.data.operatorType = 3
              that.set_data();
              resolve(that.data.operatorType)
              break;
            default:
              that.data.operatorType = 4
              resolve(that.data.operatorType)
          }
        } else {
          that.setData({
            phone_type: '',
            if_phone_yse: false
          })
        }
      })
    })
  },
  // 手机号列表遮罩层点击事件
  phone_list_bg_click: function () {
    this.setData({
      if_phone_list: false
    })
  },
  // 点击轮播图
  swiper_item_click: function (e) {
    var id = e.target.id
    // console.log(id);
    var item_banners = this.data.banners[id];
    var page = item_banners.page;
    // 类型1、自己小程序、2、其它小程序 3、H5
    switch (item_banners.type) {
      case 1:
        if (page == ('/ages/index/index' || '/pages/preference/preference' || '/pages/gift_card/gift_card' || '/pages/my/my')) {
          wx.switchTab({
            url: page,
          })
        } else {
          wx.navigateTo({
            url: page,
          })
        }
        break;
      case 2:
        wx.navigateToMiniProgram({
          appId: item_banners.appid,
          path: page,
          extraData: {},
          envVersion: 'release',
          success(res) {
            // 打开成功
          }
        })
        break;
      case 3:
        wx.navigateTo({
          url: web + '?url=' + page,
        })
        break;
    }
  },
})