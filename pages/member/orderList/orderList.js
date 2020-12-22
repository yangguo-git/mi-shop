var httpUtil = require('../../../utils/httpUtil');
const app = getApp();
Page({
  data: {
    itemname:'',
    orderList:[],
    afterSaleChoose:'',
    isShow:false,
    isGuige:''
  },
  onLoad: function (options) {
    let that = this;
    httpUtil.getData('/minip/order', {},'加载中', function(res){
      if(!res.data){
        if(res.status == "20002"){
          wx.showToast({
            title: res.msg || '系统繁忙，请稍候再试',
            icon: 'none',
            duration: 1000
          });
          wx.redirectTo({
            url: "/pages/logs/logs"
          })
        }else{
          wx.showToast({
            title: res.msg || '系统繁忙，请稍候再试',
            icon: 'none',
            duration: 1000
          });
        }
        return;
      };
      let isShow = false;
      if(res.data.length>0){
        isShow = true;
      }
      that.setData({
        orderList:res.data,
        isShow
      });
    }, function(res) {
      wx.showToast({
        title: res.msg || '系统繁忙，请稍候再试',
        icon: 'none',
        duration: 1000
      });
    })
  },
  lookDetail:function(e){
    let orderCode = e.currentTarget.dataset.id;
    let flagMark = e.currentTarget.dataset.mark;
    wx.navigateTo({
      url: '/pages/member/detailOrider/detailOrider?orderId=' + orderCode + '&flagMark=' + flagMark + '&fromFlag=333',
    })
  },
  againToPurchaseFn(e){
    wx.navigateTo({
      url: '/pages/interests_index/interests_index'
    })
  },
  lookLogistics:function(e){
    let orderCode = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/member/logisticsDetails/logisticsDetails?orderId=' + orderCode,
    })
  },
  afterServer:function(e){
    let orderCode = e.currentTarget.dataset.id;
    let afterSaleChoose = this.data.afterSaleChoose;
    let orderList = this.data.orderList;
    if(orderCode != afterSaleChoose){
      this.setData({
        afterSaleChoose:orderCode
      });
      return;
    }
    // refundFee productNormId
    let orderArray = [];
    let alreadyChoose = 0;
    let chooseShop = orderList.filter(function(item){
      return item.orderCode == orderCode;
    });
    for(var i in chooseShop){
      for(var j in chooseShop[i].goodsVOList){
        if(chooseShop[i].goodsVOList[j].checked){
          alreadyChoose ++;
          orderArray.push({
            refundFee:chooseShop[i].goodsVOList[j].subtotal,
            productNormId:chooseShop[i].goodsVOList[j].productNormId,
            isDealAll:false
          })
        }else{
          if(chooseShop[i].goodsVOList[j].orderStatus == 401){
            alreadyChoose ++;
          }
        }
      }
    };
    if(orderArray.length == 0){
      wx.showToast({
        title: '请选择需要申请售后的商品',
        icon: 'none',
        duration: 1000
      });
      return;
    }
    if(chooseShop[0].goodsVOList.length == alreadyChoose){
      orderArray[0].refundFee = orderArray[0].refundFee*1 + chooseShop[0].mailCost*1
      for(var i in orderArray){
        orderArray[i].isDealAll = true;
      }
    }
    wx.navigateTo({
      url: '/pages/member/aftersaleService/aftersaleService?orderId=' + orderCode + '&orderArray=' + encodeURIComponent(JSON.stringify(orderArray)),
    })
  },
  /*******取消售后****** */
  cancleAfter:function(e){
    let orderList = this.data.orderList;
    for(var i in orderList){
        for(var j in orderList[i].goodsVOList){
          orderList[i].goodsVOList[j].checked = false;
        }
    }
    this.setData({
      orderList,
      afterSaleChoose:''
    })
  },
  /********选择售后商品********** */
  chooseGoods:function(e){
    let productNormId = e.currentTarget.dataset['id'];
    let orderCode = e.currentTarget.dataset['ordercode'];
    let orderList = this.data.orderList;
    let afterSaleChoose = this.data.afterSaleChoose;
    if(afterSaleChoose == orderCode){
      for(var i in orderList){
        if(orderList[i].orderCode == orderCode){
          for(var j in orderList[i].goodsVOList){
            // orderList[i].goodsVOList[j].checked = false;
            if(orderList[i].goodsVOList[j].productNormId == productNormId){
              if(orderList[i].goodsVOList[j].orderStatus != 401){
                orderList[i].goodsVOList[j].checked = !orderList[i].goodsVOList[j].checked
              }else{
                wx.showToast({
                  title: '该商品已经在售后处理中',
                  icon: 'none',
                  duration: 1000
                });
                return;
              }
            };
          }
        }else{
          for(var j in orderList[i].goodsVOList){
            orderList[i].goodsVOList[j].checked = false;
          }
        }
      }
      this.setData({
        orderList
      })
    }else{
      let flagMark = e.currentTarget.dataset.mark;
      wx.navigateTo({
        url: '/pages/member/detailOrider/detailOrider?orderId=' + orderCode + '&flagMark=' + flagMark + '&fromFlag=333',
      })
    }
    
  },
  orderPay:function(e){
    let orderCode = e.currentTarget.dataset.id;
    let currentObj = e.currentTarget.dataset.obj;
    let productNormIds = [];
    console.log("currentObj",currentObj)
    //直接支付开始
    let payOrderCode = orderCode;
    for(var i in currentObj.goodsVOList){
      productNormIds.push(
        currentObj.goodsVOList[i].productNormId
      )
    }
    let payTotal = currentObj.payPrice;
    let payParams = {
      orderCode: payOrderCode,
      productNormIds: productNormIds,
      totalFee: payTotal
    }
    console.log(payParams);
    httpUtil.postData('/minip/order/batch/pay', payParams, '加载中', function (res) {
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
            wx.redirectTo({
              url: "/pages/member/orderList/orderList"
            })
        }
      })
    }, function (res) {
      wx.showToast({
        title: res.msg || '系统繁忙，请稍候再试',
        icon: 'none',
        duration: 1000
      });
    })
    //直接支付结束
    // wx.navigateTo({
    //   url: '/pages/member/detailOrider/detailOrider?orderId=' + orderCode +'&fromFlag=333',
    // })
  },
  sureGet:function(e){
    let that = this;
    let orderCode = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '你确定要收货吗?',
      success: function (res) {
        if (res.confirm) {
          httpUtil.postData('/minip/order/receipt', {orderCode:orderCode},'加载中', function(res){
            if(!res.data){
              wx.showToast({
                title: res.msg || '系统繁忙，请稍候再试',
                icon: 'none',
                duration: 1000
              });
              // 刷新页面开始
              httpUtil.getData('/minip/order', {},'加载中', function(res){
                if(!res.data){
                  wx.showToast({
                    title: res.msg || '系统繁忙，请稍候再试',
                    icon: 'none',
                    duration: 1000
                  });
                  return;
                };
                let isShow = false;
                if(res.data.length>0){
                  isShow = true;
                }
                that.setData({
                  orderList:res.data,
                  isShow
                });
              }, function(res) {
                wx.showToast({
                  title: res.msg || '系统繁忙，请稍候再试',
                  icon: 'none',
                  duration: 1000
                });
              })
              // 刷新页面结束
              return;
            };
          }, function(res) {
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 1000
            })
          },1)
        }
      }
    })
  },
  deleteOrder:function(e){//删除订单
    let that = this;
    let orderCode = e.currentTarget.dataset.id;
    let postParams = {
      orderCode:orderCode
    }
    httpUtil.postData('/minip/order/del',postParams,'加载中', function(res){
      if(!res.data){
          wx.showToast({
            title: '删除成功' || '系统繁忙，请稍候再试',
            icon: 'none',
            duration: 1500,
            success:function(){
              // 刷新页面开始
              httpUtil.getData('/minip/order', {},'', function(res){
                if(!res.data){
                  wx.showToast({
                    title: res.msg || '系统繁忙，请稍候再试',
                    icon: 'none',
                    duration: 1000
                  });
                  return;
                };
                let isShow = false;
                if(res.data.length>0){
                  isShow = true;
                }
                that.setData({
                  orderList:res.data,
                  isShow
                });
              }, function(res) {
                wx.showToast({
                  title: res.msg || '系统繁忙，请稍候再试',
                  icon: 'none',
                  duration: 1000
                });
              })
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    httpUtil.getData('/minip/order', {},'加载中', function(res){
      if(!res.data){
        wx.showToast({
          title: res.msg || '系统繁忙，请稍候再试',
          icon: 'none',
          duration: 1000
        });
        return;
      };
      let isShow = false;
      if(res.data.length>0){
        isShow = true;
      }
      that.setData({
        orderList:res.data,
        afterSaleChoose:'',
        isShow
      });
    }, function(res) {
      wx.showToast({
        title: res.msg || '系统繁忙，请稍候再试',
        icon: 'none',
        duration: 1000
      });
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})