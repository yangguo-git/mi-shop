// pages/member/receiptList/receiptList.js
var httpUtil = require('../../../utils/httpUtil');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList:'',
    isShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    httpUtil.getData('/minip/order', {"orderStatus":302},'加载中', function(res){
      if(!res.data){
        // wx.showToast({
        //   title: res.msg || '系统繁忙，请稍候再试',
        //   icon: 'none',
        //   duration: 1000
        // });
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
  sureGet:function(e){
    let orderCode = e.currentTarget.dataset.id;
    let that = this;
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
              //刷新页面开始
              httpUtil.getData('/minip/order', {"orderStatus":302},'加载中', function(res){
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
              //刷新页面结束
              return;
            };
            // wx.navigateTo({
            //   url: '/pages/center/center'
            // })
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
  afterServer:function(e){
    let orderCode = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/member/aftersaleService/aftersaleService?orderId=' + orderCode,
    })
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
    let isBoo = app.globalData.boo;
    if(isBoo){
      httpUtil.getData('/minip/order', {"orderStatus":302},'加载中', function(res){
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
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  }
})