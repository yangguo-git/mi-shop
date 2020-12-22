var httpUtil = require('../../../utils/httpUtil');
const app = getApp();
Page({
  data: {
    isChoose:true,
    count: 0,
    productId: "",
    productName: "",
    productNormId: "",
    thumbnailImgUrl: "",
    price: "",
    sub:"",
    province:"",
    city:"",
    district:"",
    address:"",
    phone:"",
    name:"",
    totalPrice:"",
    productPrice:"",
    cost:"--.--",
    lastStrs:'',
    conditionKnow:false,
    btnDisable:true,
    saveProvincecode:'',
    fareTemplateCode:'',
    ishasArr:'',
    productObj:[]
  },
  onLoad: function (options) {
    // console.log(options,'susmits');
    let productObj = JSON.parse(decodeURIComponent(options.productObj));
    let productPrice = 0;
    for(var i in productObj){
      productPrice += productObj[i].count*productObj[i].price/100;
    }
    // //转化
    // var secondPrice = options.price*1;
    // secondPrice = (secondPrice/100).toFixed(2);
    //划线价
    // var huaNumPrice = options.marketPrice*1;
    // huaNumPrice = (huaNumPrice/100).toFixed(2);
    this.setData({
      productObj:productObj,
      // count: options.count,
      // productId: options.productId,
      // productName: options.productName,
      // productNormId: options.productNormId,
      // thumbnailImgUrl: options.thumbnailImgUrl,
      // price:options.price,
      // secondPrice:secondPrice,
      // sub:options.sub,
      productPrice:productPrice.toFixed(2),
      totalPrice:productPrice.toFixed(2),
      // huaNumPrice:huaNumPrice,
      // fareTemplateCode:options.fareTemplateCode
    })
  },
  chooseAddress:function(e){
    getApp().globalData.boo = false;
    //获取授权信息
    let infoAccess = wx.getStorageSync('infoAccess');
    if(infoAccess){
      wx.navigateTo({
        url: '/pages/member/addressManage/addressManage?isCenter=1',
      })
    }else{
      wx.navigateTo({
         url: "/pages/logs/logs?id=add&isCenter=1"
      })
    }
  },
  // add:function(e){
  //   let that = this;
  //   var isCode = that.data.saveProvincecode;
  //   let number = that.data.count;
  //   let count = number*1 + 1;
  //   let price = that.data.price/100;
  //   let productPrice = price*100*count/100;
  //   productPrice = Math.round(productPrice* 100) / 100;
  //   that.setData({
  //     count,
  //     productPrice:productPrice.toFixed(2)
  //   })
  //   //未选择省份时运费为0
  //   if(!isCode){
  //     let allPrice = price*100*count/100 + 0*1;
  //     that.setData({
  //       totalPrice:allPrice.toFixed(2),
  //     })
  //   }
  //   //调接口查运费
  //   if(isCode){
  //     let mailArray = [];
  //     for(var i in that.data.productObj){
  //       mailArray.push({
  //         count:that.data.productObj[i].count,
  //         fareTemplateCode:that.data.productObj[i].fareTemplateCode,
  //         normId:that.data.productObj[i].productNormId,
  //         productId:that.data.productObj[i].productId,
  //         provinceCode:that.data.productObj[i].saveProvincecode,
  //         weight:''
  //       })
  //     }
  //     httpUtil.getData('/minip/order/countFare',mailArray ,'', function(res){
  //       if(res.data == 0 || res.data ){
  //         let totalPrice = res.data*1 + that.data.productPrice*1;//总费用
  //         let setCost = res.data*1;//邮费
  //         that.setData({
  //           cost:setCost.toFixed(2),
  //           totalPrice:totalPrice.toFixed(2)
  //         })
  //         //判断支付按钮
  //         let ishas = that.data.ishasArr;
  //         if(ishas.length>0){
  //           that.setData({
  //             btnDisable:false
  //           })
  //         }else{
  //           that.setData({
  //             btnDisable:true
  //           })
  //         }
  //       }else{
  //           wx.showToast({
  //           title: res.msg || '系统繁忙，请稍候再试',
  //           icon: 'none',
  //           duration: 1000
  //         });
  //         let totalPrice = that.data.productPrice*1;
  //         let setCost = '--.--';
  //         that.setData({
  //           cost:setCost,
  //           totalPrice:totalPrice.toFixed(2)
  //         })
  //         //判断微信支付按钮 
  //         let ishas = that.data.ishasArr;
  //         let btnFlag = that.data.cost;
  //         if(ishas.length>0){
  //            if(btnFlag == "--.--"){
  //             that.setData({
  //               btnDisable:true
  //             })
  //            }else{
  //             that.setData({
  //               btnDisable:false
  //             })
  //            }
  //         }
  //       }
  //     }, function(res) {
  //       wx.showToast({
  //         title: res.msg || '系统繁忙，请稍候再试',
  //         icon: 'none',
  //         duration: 1000
  //       });
  //     })

  //   }
    
  // },
  // reduce:function(e){
  //   let that = this;
  //   let isCode = that.data.saveProvincecode;
  //   let number = that.data.count;
  //   if(number == 1){
  //     return;
  //   }
  //   let count = number*1 - 1;
  //   let price = that.data.price/100;
  //   let productPrice = price*100*count/100;
  //   productPrice = Math.round(productPrice* 100) / 100;
  //   that.setData({
  //     count,
  //     // totalPrice:allPrice.toFixed(2),
  //     productPrice:productPrice.toFixed(2)
  //   })
  //   //未选择省份时运费为0
  //   if(!isCode){
  //     let allPrice = price*100*count/100 + 0*1;
  //     that.setData({
  //       totalPrice:allPrice.toFixed(2),
  //     })
  //   }
  //   //调接口查运费
  //   if(isCode){
  //     let mailParams = {
  //       count:count,
  //       fareTemplateCode:that.data.fareTemplateCode,
  //       normId:that.data.productNormId,
  //       productId:that.data.productId,
  //       provinceCode:that.data.saveProvincecode,
  //       weight:''
  //     };
  //     httpUtil.getData('/minip/order/countFare',mailParams ,'', function(res){
  //       if(res.data == 0 || res.data ){
  //         let totalPrice = res.data*1 + that.data.productPrice*1;//总费用
  //         let setCost = res.data*1;//邮费
  //         that.setData({
  //           cost:setCost.toFixed(2),
  //           totalPrice:totalPrice.toFixed(2)
  //         })
  //         //判断支付按钮
  //         let ishas = that.data.ishasArr;
  //         if(ishas.length>0){
  //           that.setData({
  //             btnDisable:false
  //           })
  //         }else{
  //           that.setData({
  //             btnDisable:true
  //           })
  //         }
  //       }else{
  //           wx.showToast({
  //             title: res.msg || '系统繁忙，请稍候再试',
  //             icon: 'none',
  //             duration: 1000
  //           });
  //           let totalPrice = that.data.productPrice*1;
  //           let setCost = '--.--';
  //           that.setData({
  //             cost:setCost,
  //             totalPrice:totalPrice.toFixed(2)
  //           })
  //           //判断微信支付按钮 
  //           let btnFlag = that.data.cost;
  //           let ishas = that.data.ishasArr;
  //           if(ishas.length>0){
  //              if(btnFlag == "--.--"){
  //               that.setData({
  //                 btnDisable:true
  //               })
  //              }else{
  //               that.setData({
  //                 btnDisable:false
  //               })
  //              }
  //           }
  //       }
  //     }, function(res) {
  //       wx.showToast({
  //         title: res.msg || '系统繁忙，请稍候再试',
  //         icon: 'none',
  //         duration: 1000
  //       });
  //     })

  //   }
  //   // let mailFree = that.data.cost;
  //   // let allPrice = price*100*count/100 + mailFree*1;
  //   // allPrice = Math.round(allPrice* 100) / 100;
  // },
  submitOrder:function(e){//提交订单
    let that = this;
    let province = that.data.province;
    let productObj = that.data.productObj;
    let orderProductList = [];
    let productNormIds = [];
    if(!province){
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none',
        duration: 1000
      })
      return;
    };
    for(var i in productObj){
      productNormIds.push(productObj[i].productNormId)
      orderProductList.push({
        count:productObj[i].count,
        productId:productObj[i].productId,
        productNormId:productObj[i].productNormId,
        thumbnailImgUrl:productObj[i].thumbnailImgUrl,
        productName:productObj[i].productName
      })
    }
    let params = {
      mailAddress:that.data.address,
      mailProvince:that.data.province,
      mailCity:that.data.city,
      mailDistrict:that.data.district,
      mailCost:that.data.cost,
      mailMobile:that.data.phone,
      mailName:that.data.name,
      totalPrice:that.data.productPrice,
      orderType:1,
      orderName:that.data.productObj[0].productName,
      discountPrice:(0).toFixed(2),
      orderProductList:orderProductList
    };
    httpUtil.postData('/minip/order/batch/save', params,'加载中', function(res){
      if(!res.data){
        wx.showToast({
          title: res.msg || '系统繁忙，请稍候再试',
          icon: 'none',
          duration: 1000
        });
        return;
      };
      let postPrice = that.data.huaNumPrice;
      //存划线价
      wx.setStorageSync('saveHuaPrice',postPrice);
      //提交订单之后支付------开始
      let payOrderCode = res.data.orderCode;
      let payTotal = that.data.totalPrice;
      let params = {
        orderCode: payOrderCode,
        productNormIds: productNormIds,
        totalFee: payTotal
      }
      // console.log(params,'orderPay');
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
          // if(that.data.fromsFlag == "333"){//全部
          //   wx.redirectTo({
          //     url: "/pages/member/orderList/orderList?id=1111"
          //   })
          // }else if(that.data.fromsFlag == "666"){//待付款
          //   wx.redirectTo({
          //     url: "/pages/member/unpaidList/unpaidList"
          //   })
          // }else{
          //   wx.redirectTo({
          //     url: "/pages/member/orderList/orderList?id=1111"
          //   })
          // }
          wx.switchTab({
            url: '/pages/center/center' 
          });
          
        },
        'fail':function(err){
          if(err.errMsg == 'requestPayment:fail cancel'){
            // wx.redirectTo({
            //   url: "/pages/member/unpaidList/unpaidList"
            // })
            wx.switchTab({
              url: '/pages/center/center' 
            });
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
    //提交订单之后支付------结束
    // wx.navigateTo({
    //   url: '/pages/member/detailOrider/detailOrider?orderId=' + res.data.orderCode + '&firstPrice=' + postPrice,
    // })
    }, function(res) {
      wx.showToast({
        title: res.msg,
        icon: 'none',
        duration: 1000
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  checkboxChange:function(e){
    let that = this;
    let getArr = e.detail.value;
    that.setData({
      ishasArr:getArr
    })
    // console.log(getArr,'chose');
    if(getArr.length > 0){
      // console.log(that.data.cost);
      let ishasPost = that.data.cost;
      if(ishasPost == '--.--'){
        that.setData({
          btnDisable:true
        })
      }else{
        that.setData({
          btnDisable:false
        })
      }
    }else{
      that.setData({
        btnDisable:true
      })
    }
  },
  knowEvent:function(){
    var backKnow = !this.data.conditionKnow;
    this.setData({
      conditionKnow:backKnow
    })
  },
  onShow: function () {//选择完地址
    let that = this;
    let isChooseAdress = app.globalData.boo;
    if(isChooseAdress){
      let addRessId = app.globalData.addRessId;
      httpUtil.getData('/minip/address', {},'', function(res){
        if(!res.data){
          wx.showToast({
            title: res.msg || '系统繁忙，请稍候再试',
            icon: 'none',
            duration: 1000
          });
          return;
        };
        let addressObj;
        if(addRessId){
          let addRess = res.data.filter(function(item){
            return item.id == addRessId
          });
           addressObj = addRess[0];
        }else{
           addressObj = app.globalData.provinceName;
        }
        httpUtil.getData('/minip/delivery/province', {},'', function(res){
          if(!res.data){
            wx.showToast({
              title: res.msg || '系统繁忙，请稍候再试',
              icon: 'none',
              duration: 1000
            });
            return;
          };
          let chooseText;
          if(addRessId){
             chooseText = addressObj.province.substring(0,2);
          }else{
             chooseText = addressObj.substring(0,2);
          }
          let provinceId = '';
          for(var i = 0;i<res.data.length;i++){
            if(chooseText == res.data[i].districtName.substring(0,2)){
              provinceId = res.data[i].districtId;
              break;
            };
          };
          //存省份code
          that.setData({
            saveProvincecode:provinceId
          })
          //获取运费开始---
          let mailArray = [];
          for(var i in that.data.productObj){
            mailArray.push({
              count:that.data.productObj[i].count,
              fareTemplateCode:that.data.productObj[i].fareTemplateCode,
              normId:that.data.productObj[i].productNormId,
              productId:that.data.productObj[i].productId,
              provinceCode:that.data.saveProvincecode,
              weight:''
            })
          }
          let data = {}
          // console.log(mailArray,'运费参数');
          httpUtil.postData('/minip/order/totalFare',{"totalFares":JSON.stringify(mailArray)} ,'', function(res){
            if(res.data == 0 || res.data ){
              let totalPrice = res.data*1 + that.data.productPrice*1;
              let setCost = res.data*1;
              that.setData({
                cost:setCost.toFixed(2),
                totalPrice:totalPrice.toFixed(2)
              })
              //判断支付按钮
              let ishas = that.data.ishasArr;
              if(ishas.length>0){
                that.setData({
                  btnDisable:false
                })
              }else{
                that.setData({
                  btnDisable:true
                })
              }
            }else{
                wx.showToast({
                title: res.msg || '系统繁忙，请稍候再试',
                icon: 'none',
                duration: 1000
              });
              let totalPrice = that.data.productPrice*1;
              let setCost = '--.--';
              that.setData({
                cost:setCost,
                totalPrice:totalPrice.toFixed(2)
              })
              //判断微信支付按钮 
              let btnFlag = that.data.cost;
              let ishas = that.data.ishasArr;
              if(ishas.length>0){
                 if(btnFlag == "--.--"){
                  that.setData({
                    btnDisable:true
                  })
                 }else{
                  that.setData({
                    btnDisable:false
                  })
                 }
              }
            }
           
          }, function(res) {
            wx.showToast({
              title: res.msg || '系统繁忙，请稍候再试',
              icon: 'none',
              duration: 1000
            });
          },1)
          //获取运费结束---
        }, function(res) {
          wx.showToast({
            title: res.msg || '系统繁忙，请稍候再试',
            icon: 'none',
            duration: 1000
          });
        })
        if(addRessId){
          that.setData({
            isChoose:false,
            name:addressObj.name,
            phone:addressObj.phone,
            address:addressObj.address,
            province:addressObj.province,
            district:addressObj.district,
            city:addressObj.city
          });

        }else{
          that.setData({
            isChoose:false,
            name:app.globalData.saveName,
            phone:app.globalData.savePhone,
            address:app.globalData.saveDetail,
            province:app.globalData.provinceName,
            district:app.globalData.saveDistrict,
            city:app.globalData.saveCity
          });
        }
        
      }, function(res) {
        wx.showToast({
          title: res.msg || '系统繁忙，请稍候再试',
          icon: 'none',
          duration: 1000
        });
      },1)
    };
  },
  goMark:function(){
    wx.navigateTo({
      url: '/pages/mark/mark',
    })
  },
  goInvoice:function(){
    wx.navigateTo({
      url: '/pages/invoice/invoice',
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
  // onShareAppMessage: function () {

  // }
})