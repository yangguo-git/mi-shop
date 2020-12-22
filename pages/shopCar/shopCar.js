var httpUtil = require('../../utils/httpUtil');
Page({

  data: {
      isShow:false,
      noGoods:true,
      allChecked:false,
      isDisabled:true,
      totalPrice:0,
      shopGoods:[]
  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  bindUserNameInput: function (e) {
      this.setData({
          productNumber: e.detail.value
      })
  },
  /********减小商品数量******* */
  reduce: function (e) {
      let id = e.currentTarget.dataset['id'];///minip/cart/edit
      let that = this;
      let count = 1;
      let shopGoods = that.data.shopGoods;
      for(var i = 0;i < shopGoods.length; i ++ ){
          if(shopGoods[i].id == id){
              if(shopGoods[i].count > 1){
                  shopGoods[i].count = shopGoods[i].count - 1;
                  count = shopGoods[i].count;
              }else{
                  return;
              }
          }
        }
        httpUtil.postData('/minip/cart/edit', {id:id,count:count},'加载中', function(res){
            if(res.status&&res.status != 0){
                wx.showToast({
                    title: res.msg || '系统繁忙，请稍候再试',
                    icon: 'none',
                    duration: 1000
                });
                return;
            };
            that.setData({
                shopGoods
            })
            that.getTotalPrice();
        }, function(res) {
            wx.showToast({
                title: res.msg || '系统繁忙，请稍候再试',
                icon: 'none',
                duration: 1000
            });
        })
  },
  /*********添加商品数量************ */
  add: function (e) {
      let id = e.currentTarget.dataset['id'];
      let that = this;
      let count = 0;
      let shopGoods = that.data.shopGoods;
      for(var i = 0;i < shopGoods.length; i ++ ){
            if(shopGoods[i].id == id){
                var shopNumber =  shopGoods[i].isLimit ? shopGoods[i].productLimit : shopGoods[i].stockQty;
                if(shopGoods[i].count >= shopNumber){
                    wx.showToast({
                        title: shopGoods[i].isLimit ? '此商品限购,不能再添加了' : '此商品已到最大库存,不能再添加了',
                        icon: 'none',
                        duration: 1500
                    });
                    return;
                }else{
                    shopGoods[i].count = shopGoods[i].count + 1;
                    count = shopGoods[i].count;
                }
            }
        }
        httpUtil.postData('/minip/cart/edit', {id:id,count:count},'加载中', function(res){
            if(res.status&&res.status != 0){
                wx.showToast({
                    title: res.msg || '系统繁忙，请稍候再试',
                    icon: 'none',
                    duration: 1000
                });
                return;
            };
            that.setData({
                shopGoods
            })
            that.getTotalPrice();
        }, function(res) {
            wx.showToast({
                title: res.msg || '系统繁忙，请稍候再试',
                icon: 'none',
                duration: 1000
            });
        })
  },
  /******删除商品******* */
  deleteGoods:function(e){
      let that = this;
      wx.showModal({
          title: '提示',
          content: '确认删除此商品吗?',
          cancelText:'取消',
          confirmText:'确定',
          success: function (res) {
                if (res.confirm) {
                    let id = e.currentTarget.dataset['id'];
                    httpUtil.postData('/minip/cart/dele', {id:id},'加载中', function(res){
                        if(res.status&&res.status != 0){
                            wx.showToast({
                                title: res.msg || '系统繁忙，请稍候再试',
                                icon: 'none',
                                duration: 1000
                            });
                            return;
                        };
                        let shopGoods = that.data.shopGoods;
                        for(var i = 0;i < shopGoods.length; i ++ ){
                            if(shopGoods[i].id == id){
                            shopGoods.splice(i,1);
                            }
                        };
                        let noGoods = false;
                        if(shopGoods.length == 0){
                            noGoods = true;
                        }
                        that.setData({
                            shopGoods,
                            noGoods
                        })
                        that.getTotalPrice();
                        that.isAllCheck();
                        // this.isDisabled();
                        that.isDisabled();
                    }, function(res) {
                        wx.showToast({
                            title: res.msg || '系统繁忙，请稍候再试',
                            icon: 'none',
                            duration: 1000
                        });
                    })
                
              } else if (res.cancel) {

              }
          }
      })
  },
  /*****选择商品**** */
  chooseGoods(e) {
      let id = e.currentTarget.dataset['id'];
      let shopGoods = this.data.shopGoods;
      for (var i in shopGoods){
          if(shopGoods[i].id == id){
            shopGoods[i].checked = !shopGoods[i].checked;
          }
      };
      this.setData({
        shopGoods
      })
      this.getTotalPrice();
      this.isDisabled();
      this.isAllCheck();
  },
  /******全选按钮******** */
  chooseAllGoods:function(e){
      let allChecked = this.data.allChecked;
      let shopGoods = this.data.shopGoods;
      if(allChecked){
          for(var i in shopGoods){
              shopGoods[i].checked = false;
          }
      }else{
          for(var i in shopGoods){
              shopGoods[i].checked = true;
          }
      }
      this.setData({
          allChecked:!allChecked,
          shopGoods
      })
      this.getTotalPrice();
      this.isDisabled();
  },
  /*******判断是否全选******** */
  isAllCheck:function(e){
        let isCheck = 0;
        let shopGoods = this.data.shopGoods;
        for(var i in shopGoods){
            if(shopGoods[i].checked){
                isCheck ++;
            }
        }
        if(isCheck == shopGoods.length){
            this.setData({
                allChecked:true
            })
        }else{
            this.setData({
                allChecked:false
            })
        }
  },
  /*******获取总价格********* */
  getTotalPrice:function(e){
      let totalPrice = 0;
      let shopGoods = this.data.shopGoods;
      for(var i in shopGoods){
          if(shopGoods[i].checked){
             totalPrice = totalPrice + shopGoods[i].price*shopGoods[i].count;
          }
      }
      this.setData({
        totalPrice
      })
  },
  isDisabled:function(e){
        let shopGoods = this.data.shopGoods;
        let productNum = 0;
        for(var i in shopGoods){
            if(shopGoods[i].checked){
                productNum ++;
            }
        }
        if(productNum >= 1){
            this.setData({
                isDisabled:false
            })
        }else{
            this.setData({
                isDisabled:true
            })
        }
  },
  /**********结算按钮点击********* */
  settlement:function(e){
        let shopGoods = this.data.shopGoods;
        let productObj = [];
        for(var i in shopGoods){
            if(shopGoods[i].checked){
                productObj.push({
                    count:shopGoods[i].count,
                    sub:shopGoods[i].productSubtitle,
                    thumbnailImgUrl:shopGoods[i].thumbnailImgUrl,
                    productId:shopGoods[i].productId,
                    marketPrice:shopGoods[i].marketPrice,
                    fareTemplateCode:shopGoods[i].fareTemplateCode,
                    productName:shopGoods[i].productName,
                    productNormId:shopGoods[i].productNormId,
                    price:shopGoods[i].price
                })
            }
        }
        // console.log('productObj',productObj);
        // console.log('productObj',JSON.stringify(productObj));
        wx.navigateTo({
            url: '/pages/product/submitOrder/submitOrder?productObj=' + encodeURIComponent(JSON.stringify(productObj))
        })
  },
  onShow: function () {
    let that = this;
    httpUtil.getData('/minip/cart/list', {},'加载中', function(res){
        that.setData({
          isShow:true
        });
        if(res.status != 0){
            // wx.showToast({
            //   title: res.msg || '系统繁忙，请稍候再试',
            //   icon: 'none',
            //   duration: 1000
            // });
    //         wx.navigateTo({
    //           url: "/pages/logs/logs?cancel=shop"
    //         })
            return;
        };
        let noGoods = true;
        let shopGoods = [];
        if(res.data.length>0){
            noGoods = false;
            shopGoods = res.data;
        }
        that.setData({
            noGoods,
            shopGoods,
            allChecked:false,
            totalPrice:0,
            isDisabled:true
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
  /**随便逛逛跳转首页*** */
  lookAround:function(){
      wx.switchTab({
        url: '/pages/index/index',
      })
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