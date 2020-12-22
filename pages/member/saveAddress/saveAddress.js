var httpUtil = require('../../../utils/httpUtil');
var Util = require('../../../utils/util');
const app = getApp();
Page({
  data: {
    index: 0,
    region: ['请选择所在地区'],
    customItem: '',
    name:'',
    phone:'',
    detail:'',
    province:'',
    district:'',
    city:'',
    isCenter:'',
    saveText:''
  },
  onLoad:function(options){
    if(options.isCenter){
       this.setData({
        isCenter:options.isCenter
       })
       if(options.isCenter == 1){
          this.setData({
            saveText:'保存并使用'
          })
       }else if(options.isCenter == 2){//中心
          this.setData({
            saveText:'保存收货地址'
          })
       }
    }
    
  },
  saveAddress:function(e){
    let that = this;
    let isJudge = that.data.isCenter;
    if(this.data.name == '' ||this.data.phone ==''||this.data.detail == ''||this.data.province == ''||this.data.district == ''||this.data.city==''){
      wx.showToast({
        title:'请将信息填写完整',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    //手机号验证
    var phoneReg = /^1[3456789]\d{9}$/;
    if(!phoneReg.test(this.data.phone)){
      wx.showToast({
        title:'手机号格式不正确',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    // let params = {
    //   name:this.data.name,
    //   phone:this.data.phone,
    //   detail:this.data.detail,
    //   province:this.data.province,
    //   district:this.data.district,
    //   city:this.data.city
    // };
    // httpUtil.postData('/minip/address/save', params , '加载中', function(res){
    //   if(res.status == 0){
    //     wx.showLoading({
    //       title: '保存成功',
    //     });
    //     getApp().globalData.boo = true;
    //     wx.navigateBack();
    //   }else{
    //     wx.showToast({
    //       title: res.msg || '系统繁忙，请稍候再试',
    //       icon: 'none',
    //       duration: 1000
    //     });
    //   };
    // }, function(res) {
    //   wx.showToast({
    //     title: res.msg || '系统繁忙，请稍候再试',
    //     icon: 'none',
    //     duration: 1000
    //   });
    // })
    let getProvince = that.data.province;
    getApp().globalData.provinceName = getProvince;
    getApp().globalData.savePhone = that.data.phone;
    getApp().globalData.saveDetail = that.data.detail;
    getApp().globalData.saveCity = that.data.city;
    getApp().globalData.saveDistrict = that.data.district;
    getApp().globalData.saveName = that.data.name;
    that.commonSave(isJudge);
    getApp().globalData.addRessId = '';
  },
  input_name:function(e){
    this.setData({
      name:e.detail.value.trim()
    });
  },
  input_phone:function(e){
    this.setData({
      phone:e.detail.value.trim()
    });
  },
  bindAddressInput:function(e){
    this.setData({
      detail:e.detail.value
    })
    
  },
  bindRegionChange: function (e) {
    let region = e.detail.value;
    this.setData({
      region,
      province:region[0],
      city:region[1],
      district:region[2]
    })
  },
  getAdress:function(){
    let that = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.address']) {
          wx.chooseAddress({
            success(res) {
              let wxRegion = [res.provinceName,res.cityName,res.countyName];
              let province = res.provinceName;
              let city = res.cityName;
              let district = res.countyName;
              if(res){
                that.setData({
                  region:wxRegion,
                  name:res.userName,
                  phone:res.telNumber,
                  detail:res.detailInfo,
                  province:province,
                  city:city,
                  district:district
                })
                //yg
                let isJudge = that.data.isCenter;
                if(isJudge == 2){
                  that.commonSave(isJudge);
                }else{//确认订单页
                  let getProvince = that.data.province;
                  getApp().globalData.provinceName = getProvince;
                  getApp().globalData.savePhone = that.data.phone;
                  getApp().globalData.saveDetail = that.data.detail;
                  getApp().globalData.saveCity = that.data.city;
                  getApp().globalData.saveDistrict = that.data.district;
                  getApp().globalData.saveName = that.data.name;
                  that.commonSave(isJudge);
                  getApp().globalData.addRessId = '';
                }
                
              }
            }
          })
        } else {
          if (res.authSetting['scope.address'] == false) {
            wx.openSetting({
              success(res) {
                console.log(res.authSetting)
              }
            })
          } else {
            wx.chooseAddress({
              success(res) {
                let wxRegion = [res.provinceName,res.cityName,res.countyName];
                let province = res.provinceName;
                let city = res.cityName;
                let district = res.countyName;
                if(res){
                  that.setData({
                    region:wxRegion,
                    name:res.userName,
                    phone:res.telNumber,
                    detail:res.detailInfo,
                    province:province,
                    city:city,
                    district:district
                  })
                  //yg
                  let isJudge = that.data.isCenter;
                  if(isJudge == 2){
                    that.commonSave(isJudge);
                  }else{
                    let getProvince = that.data.province;
                    getApp().globalData.provinceName = getProvince;
                    getApp().globalData.savePhone = that.data.phone;
                    getApp().globalData.saveDetail = that.data.detail;
                    getApp().globalData.saveCity = that.data.city;
                    getApp().globalData.saveDistrict = that.data.district;
                    getApp().globalData.saveName = that.data.name;
                    that.commonSave(isJudge);
                    getApp().globalData.addRessId = '';
                  }
                }
              },
              fail:function(){
                wx.showToast({
                  title: '请打开通讯地址权限后重试',
                  icon:'none',
                  duration:2000
                })
              }

            })
          }
        }
      }
    })

  },
  commonSave:function(flag) {
    let that = this;
    let params = {
      name:that.data.name,
      phone:that.data.phone,
      detail:that.data.detail,
      province:that.data.province,
      district:that.data.district,
      city:that.data.city
    };
    httpUtil.postData('/minip/address/save', params , '', function(res){
      if(res.status == 0){
        wx.showLoading({
          title: '保存成功',
        });
        getApp().globalData.boo = true;
        if(flag == 2){//中心
          wx.navigateBack();
          // wx.navigateTo({
          //   url: "/pages/member/addressManage/addressManage"
          // })
        }else{
          wx.navigateBack({
            delta: 2
          });
        }
      }else{
        wx.showToast({
          title: res.msg || '系统繁忙，请稍候再试',
          icon: 'none',
          duration: 1000
        });
      };
    }, function(res) {
      wx.showToast({
        title: res.msg || '系统繁忙，请稍候再试',
        icon: 'none',
        duration: 1000
      });
    })
  },
  getPhoneNumber:function(e){//手机号授权

    if(e.detail.errMsg == 'getPhoneNumber:ok'){
      let that = this;
    let params = {
      encrypt_data: e.detail.encryptedData,
      iv: e.detail.iv
    }
    httpUtil.postData('/minip/phone', params, '', function (res) {
      if (!res.data) {
        wx.showToast({
          title: res.msg || '系统繁忙，请稍候再试',
          icon: 'none',
          duration: 1000
        })
        //跳转到登录页
        wx.navigateTo({
          url: "/pages/logs/logs?id=addflag"
        })
        return;
      }
      //获取到手机
      if(res.data){
          that.setData({
            phone:res.data,
          })
      }
    }, function (res) {
      wx.showToast({
        title: res.msg || '系统繁忙，请稍候再试',
        icon: 'none',
        duration: 1000
      })
    }, 1)
    return;

    }else{
      // wx.showToast({
      //   title:'未获取到手机号',
      //   icon: 'none',
      //   duration: 1000
      // })
    }
  }
})