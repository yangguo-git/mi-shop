var httpUtil = require('../../../utils/httpUtil');
const app = getApp();
Page({
  data: {
    orderInfo: '',
    goodsVOList: [],
    afterSaleChoose:false,
    fromsFlag:'',
    firstPrice:'',
    saveCode:'',
    moreFlag:true,
    ishasPiao:false,
    saveMarks:'',
    finishedFlag:false,
    waitFlag:false,
    payFlag:false,
    isPlay:true,
    isComment:0
  },
  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    let that = this;
    let orderId = options.orderId;
    //跳转标记
    let saveMark;
    if(options.flagMark){
        saveMark = options.flagMark;
    }
    //划线价
    let getPostPrice;
    if(options.firstPrice){
       getPostPrice = options.firstPrice;
    }else{
      getPostPrice = wx.getStorageSync('saveHuaPrice');
    }
    
    //获取从哪跳转过来的 333全部   666待付款
    let fromMark = options.fromFlag;
    that.setData({
      fromsFlag:fromMark,
      firstPrice:getPostPrice,
      saveCode:orderId,
      saveMarks:saveMark
    })
    httpUtil.getData('/minip/order/code', {
      orderCode: orderId
    }, '加载中', function (res) {
      if (!res.data) {
        wx.showToast({
          title: res.msg || '系统繁忙，请稍候再试',
          icon: 'none',
          duration: 1000
        });
        return;
      };
      that.setData({
        orderInfo: res.data,
        goodsVOList: res.data.goodsVOList
      })
      //单个商品评价
      if(res.data.goodsVOList.length == 1){
        let getObj = res.data.goodsVOList[0];
        // console.log(getObj);
        let getProductId = getObj.productId;
        //获取是否评价过开始---------------------------productId
        httpUtil.getData('/minip/commont/isCommont', {
          productId: getProductId,
          orderCode:orderId
        }, '', function (res) {
          if (!res.data) {
            // wx.showToast({
            //   title: '',
            //   icon: 'none',
            //   duration: 1000
            // });
            return;
          };
          console.log(res)
          that.setData({
            isComment: res.data,
          })
        }, function (res) {
          wx.showToast({
            title: res.msg || '系统繁忙，请稍候再试',
            icon: 'none',
            duration: 1000
          });
        })
       //获取是否评价过结束---------------
      }
    }, function (res) {
      wx.showToast({
        title: res.msg || '系统繁忙，请稍候再试',
        icon: 'none',
        duration: 1000
      });
    })
  },
  /********选择售后商品********** */
  chooseGoods:function(e){
    let productNormId = e.currentTarget.dataset['id'];
    let goodsVOList = this.data.goodsVOList;
    for(var i in goodsVOList){
      if(goodsVOList[i].productNormId == productNormId){
        if(goodsVOList[i].orderStatus != 401){
          goodsVOList[i].checked = !goodsVOList[i].checked
        }else{
          wx.showToast({
            title: '该商品已经在售后处理中',
            icon: 'none',
            duration: 1000
          });
          return;
        }
      }
    }
    this.setData({
      goodsVOList
    })
  },
  orderPay: function (e) {
    let that = this;
    let goodsVOList = this.data.goodsVOList;
    let productNormIds = [];
    for(var i in goodsVOList){
      productNormIds.push(goodsVOList[i].productNormId)
    }
    let params = {
      orderCode: this.data.orderInfo.orderCode,
      productNormIds: productNormIds,
      totalFee: this.data.orderInfo.payPrice
    }
    console.log(params,'orderPay');
    httpUtil.postData('/minip/order/batch/pay', params, '加载中', function (res) {
      if (!res.data) {
        wx.showToast({
          title: res.msg || '系统繁忙，请稍候再试',
          icon: 'none',
          duration: 1000
        });
        return;
      };
      wx.requestPayment({
        'timeStamp': res.data.timeStamp,
        'nonceStr': res.data.nonceStr,
        'package': res.data.wxPackage,
        'signType': res.data.signType,
        'paySign': res.data.paySign,
        'success': function (res) {
          if(that.data.fromsFlag == "333"){//全部
            wx.redirectTo({
              url: "/pages/member/orderList/orderList?id=1111"
            })
          }else if(that.data.fromsFlag == "666"){//待付款
            wx.redirectTo({
              url: "/pages/member/unpaidList/unpaidList"
            })
          }else{
            wx.redirectTo({
              url: "/pages/member/orderList/orderList?id=1111"
            })
          }
          
        }
      })
    }, function (res) {
      wx.showToast({
        title: res.msg || '系统繁忙，请稍候再试',
        icon: 'none',
        duration: 1000
      });
    })

  },
  copyEvent:function(e){
    console.log(this.data.orderInfo.orderCode);
    wx.setClipboardData({
      data: this.data.orderInfo.orderCode,
      success: function (res) {
          wx.getClipboardData({
              success: function (res) {
                  wx.showToast({
                      title: '内容已复制'
                  })
              }
          })
      }
  })
  },
  deleteOrder:function(e){//删除订单
    let that = this;
    let getCode = that.data.saveCode;
    let postParams = {
      orderCode:getCode
    }
    httpUtil.postData('/minip/order/del',postParams,'加载中', function(res){
      if(!res.data){
          wx.showToast({
            title: '删除成功' || '系统繁忙，请稍候再试',
            icon: 'none',
            duration: 1500,
            success:function(){
              wx.navigateBack();
            }
          });
        return;
      };
    }, function(res) {
      wx.showToast({
        title: res.msg || '系统繁忙，请稍候再试',
        icon: 'none',
        duration: 1000
      });
    },1)
  },
  cancelOrder:function(e){//取消订单
    let that = this;
    let getCode = that.data.saveCode;
    let getSaveMarks = that.data.saveMarks;
    let postParams = {
      orderCode:getCode
    }
    wx.showModal({
      title: '提示',
      content: '确定要取消该订单吗?',
      cancelText:'再考虑下',
      confirmText:'取消订单',
      cancelColor:'#07c160',
      confirmColor:'#000000',
      success: function (res) {
        if (res.confirm) {
          httpUtil.postData('/minip/order/cancel',postParams,'加载中', function(res){
            if(!res.data){
                wx.showToast({
                  title: '取消成功' || '系统繁忙，请稍候再试',
                  icon: 'none',
                  duration: 1500,
                  success:function(){
                    wx.navigateBack();
                  }
                });
              return;
            };
          }, function(res) {
            wx.showToast({
              title: res.msg || '系统繁忙，请稍候再试',
              icon: 'none',
              duration: 1000
            });
          },1)

        } else if (res.cancel) {
          
        }
        
      }
    })
  },
  goforcustomer:function(){//联系客服
    wx.navigateTo({
      url: '/pages/member/commonProblem/commonProblem',
    })
    //相关显示隐藏
    this.setData({
      finishedFlag:false,
      waitFlag:false,
      payFlag:false
    })
  },
  lookLogistics:function(e){//查看物流
    let that = this;
    let getCode = that.data.saveCode;
    wx.navigateTo({
      url: '/pages/member/logisticsDetails/logisticsDetails?orderId=' + getCode,
    })
    //相关显示隐藏
    this.setData({
      finishedFlag:false,
      waitFlag:false,
      payFlag:false
    })
  },
  /********取消申请售后******** */
  cancleAfter:function(e){
    let afterSaleChoose = this.data.afterSaleChoose;
    let goodsVOList = this.data.goodsVOList;
    for(var i in goodsVOList){
        goodsVOList[i].checked = false
    }
    this.setData({
      afterSaleChoose:false,
      goodsVOList,
      finishedFlag:false,
      waitFlag:false,
      payFlag:false
    })
    
  },
  afterServer:function(){
    let that = this;
    let afterSaleChoose = this.data.afterSaleChoose;
    let goodsVOList = this.data.goodsVOList;
    let orderInfo = this.data.orderInfo;
    let orderArray = [];
    if(!afterSaleChoose){
      that.setData({
        afterSaleChoose:true
      })
      console.log(that.data.afterSaleChoose)
      return;
    }
    let alreadyChoose = 0;
    for(var i in goodsVOList){
      if(goodsVOList[i].checked){
        alreadyChoose ++;
        orderArray.push({
          refundFee:goodsVOList[i].subtotal,
          productNormId:goodsVOList[i].productNormId,
          isDealAll:false
        })
      }else{
        if(goodsVOList[i].orderStatus == 401){
          alreadyChoose ++ ;
        }
      }
    }
    if(orderArray.length == 0){
      wx.showToast({
        title: '请选择需要申请售后的商品',
        icon: 'none',
        duration: 1000
      });
      return;
    }

    if(alreadyChoose == goodsVOList.length){
      orderArray[0].refundFee = orderArray[0].refundFee*1 + orderInfo.mailCost*1
      for(var i in orderArray){
        orderArray[i].isDealAll = true;
      }
    }

    let getCode = that.data.saveCode;
    wx.navigateTo({
      url: '/pages/member/aftersaleService/aftersaleService?orderId=' + getCode + '&orderArray=' + encodeURIComponent(JSON.stringify(orderArray)),
    })
    //相关显示隐藏
    this.setData({
      finishedFlag:false,
      waitFlag:false,
      payFlag:false
    })
  },
  playStar:function(){//评价
    let getCode = this.data.saveCode;
    let goodList = this.data.goodsVOList;
    if(goodList.length == 1){
      let postObj = JSON.stringify(goodList[0]);
      wx.navigateTo({
        url: '/pages/addComments/addComments?postObj='+ encodeURIComponent(postObj) + '&getCode='+ getCode
      })
    }else if(goodList.length > 1){//多个商品
      wx.navigateTo({
        url: '/pages/manyComment/manyComment?getCode=' + getCode
      })
    }
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  finishMore:function(){//已完成 点击更多
     let setFan = !this.data.finishedFlag;
     this.setData({
       finishedFlag:setFan
     })
  },
  waitMore:function(){//待收货 点击更多
    let setFan = !this.data.waitFlag;
    this.setData({
      waitFlag:setFan
    })
  },
  payMore:function(){//待付款点击更多
    let setFan = !this.data.payFlag;
    this.setData({
      payFlag:setFan
    })
  },
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    let isBoo = app.globalData.boo;
    let orderId = this.data.saveCode;
    if(isBoo){
      httpUtil.getData('/minip/order/code', {
        orderCode: orderId
      }, '加载中', function (res) {
        if (!res.data) {
          wx.showToast({
            title: res.msg || '系统繁忙，请稍候再试',
            icon: 'none',
            duration: 1000
          });
          return;
        };
        that.setData({
          orderInfo: res.data,
          goodsVOList: res.data.goodsVOList,
          afterSaleChoose:false
        })
      }, function (res) {
        wx.showToast({
          title: res.msg || '系统繁忙，请稍候再试',
          icon: 'none',
          duration: 1000
        });
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      finishedFlag:false
    })
  },
   /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }

})