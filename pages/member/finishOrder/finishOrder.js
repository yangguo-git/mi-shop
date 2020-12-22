var httpUtil = require('../../../utils/httpUtil');
const app = getApp();
Page({
  data: {
    orderList:'',
    afterSaleChoose:false,
    isShow:false
  },
  onLoad: function (options) {
    let that = this;
    httpUtil.getData('/minip/order', {"orderStatus":304},'加载中', function(res){
      if(!res.data){
        //开始
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
        //结束
        return;
      };
      let isShow = false;
        if(res.data.length>0){
          isShow = true;
          console.log(res.data);
        }
        that.setData({
          orderList:res.data,
          isShow:isShow
        });
    }, function(res) {
      wx.showToast({
        title: res.msg || '系统繁忙，请稍候再试',
        icon: 'none',
        duration: 1000
      });
    })
  },
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
  lookDetail:function(e){
    let orderCode = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/member/detailOrider/detailOrider?orderId=' + orderCode,
    })
  },
  lookLogistics:function(e){//查看物流
    let orderCode = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/member/logisticsDetails/logisticsDetails?orderId=' + orderCode,
    })
  },
  onReady: function () {

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
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    let isBoo = app.globalData.boo;
    if(isBoo){
      httpUtil.getData('/minip/order', {"orderStatus":304},'加载中', function(res){
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
      },1)
    }
  }
})