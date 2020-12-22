var httpUtil = require('../../../utils/httpUtil');
var Util = require('../../../utils/util');
Page({
  data: {
    index: 0,
    region: ['请选择', '请选择', '请选择'],
    id:'',
    customItem: '',
    name:'',
    phone:'',
    detail:'',
    province:'',
    district:'',
    city:'',
    saveId:'',
    isCenter:'',
    saveText:''
  },
  onLoad:function(options){
    let that = this;
    let getParams;
    if(options.id){
        getParams = options.id;
    }else{
        let getCun = wx.getStorageSync('saveId');
        getParams = getCun;
    }
    //设置
    if(options.isCenter){
        that.setData({
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
    httpUtil.getData('/minip/address', {},'加载中', function(res){
      if(!res.data){
        wx.showToast({
          title: res.msg || '系统繁忙，请稍候再试',
          icon: 'none',
          duration: 1000
        });
        return;
      };
      let addRess = res.data.filter(function(item){
        return item.id == getParams
      });
      let addressObj = addRess[0];
      that.setData({
        id:getParams,
        region: [addressObj.province,addressObj.city,addressObj.district],
        customItem: '',
        name:addressObj.name,
        phone:addressObj.phone,
        detail:addressObj.address,
        province:addressObj.province,
        district:addressObj.district,
        city:addressObj.city
      });
    }, function(res) {
      wx.showToast({
        title: res.msg || '系统繁忙，请稍候再试',
        icon: 'none',
        duration: 1000
      });
    })
  },
  delete:function(e){
    let params = {
      status:0,
      id:this.data.id
    };
    httpUtil.postData('/minip/address/update', params , '加载中', function(res){
      if(res.status == 0){
        wx.showLoading({
          title: '删除成功',
        });
        getApp().globalData.boo = true;
        wx.navigateBack();
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
  saveAddress:function(e){
    let that = this;
    let getEditid = this.data.id;
    let getCenter = this.data.isCenter;
    if(this.data.name == ''||this.data.phone == ''||this.data.detail == '' ||this.data.province == ''||this.data.district == ''||this.data.city==''){
      wx.showToast({
        title:'请将信息填写完整',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    //手机号正则验证
    var phoneReg = /^1[3456789]\d{9}$/;
    if(!phoneReg.test(this.data.phone)){
      wx.showToast({
        title:'手机号格式不正确',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    let getProvince = that.data.province;
    getApp().globalData.provinceName = getProvince;
    getApp().globalData.savePhone = that.data.phone;
    getApp().globalData.saveDetail = that.data.detail;
    getApp().globalData.saveCity = that.data.city;
    getApp().globalData.saveDistrict = that.data.district;
    getApp().globalData.saveName = that.data.name;
    getApp().globalData.addRessId = '';
    that.commonEdit(getEditid,getCenter);
    // let params = {
    //   name:this.data.name,
    //   phone:this.data.phone,
    //   detail:this.data.detail,
    //   province:this.data.province,
    //   district:this.data.district,
    //   city:this.data.city,
    //   isDefault:0,
    //   status:1,
    //   id:this.data.id
    // };
    
    // httpUtil.postData('/minip/address/update', params , '加载中', function(res){
    
    //   if(res.status == 0){
    //     wx.showLoading({
    //       title: '修改成功',
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
              let getEditid = that.data.id;
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
                //保存
                let isJudge = that.data.isCenter;
                if(isJudge == 2){//中心
                  that.commonEdit(getEditid,2);
                }else{
                  let getProvince = that.data.province;
                  getApp().globalData.provinceName = getProvince;
                  getApp().globalData.savePhone = that.data.phone;
                  getApp().globalData.saveDetail = that.data.detail;
                  getApp().globalData.saveCity = that.data.city;
                  getApp().globalData.saveDistrict = that.data.district;
                  getApp().globalData.saveName = that.data.name;
                  that.commonEdit(getEditid,1)
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
                let getEditid = that.data.id;
                let isJudge = that.data.isCenter;
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
                  //设置
                  if(isJudge == 2){
                    that.commonEdit(getEditid,2)
                  }else{
                    let getProvince = that.data.province;
                    getApp().globalData.provinceName = getProvince;
                    getApp().globalData.savePhone = that.data.phone;
                    getApp().globalData.saveDetail = that.data.detail;
                    getApp().globalData.saveCity = that.data.city;
                    getApp().globalData.saveDistrict = that.data.district;
                    getApp().globalData.saveName = that.data.name;
                    that.commonEdit(getEditid,1);
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
  commonEdit:function(getEditid,flag) {
    let that = this;
    let params = {
      name:that.data.name,
      phone:that.data.phone,
      detail:that.data.detail,
      province:that.data.province,
      district:that.data.district,
      city:that.data.city,
      isDefault:0,
      status:1,
      id:getEditid
    };
    console.log(params,'编辑参数');
    httpUtil.postData('/minip/address/update', params , '', function(res){
      if(res.status == 0){
        wx.showLoading({
          title: '修改成功',
        });
        getApp().globalData.boo = true;
        // wx.navigateBack();
        let getpages = getCurrentPages();//当前页面栈
        if(flag == 2){
          wx.navigateBack();
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
          let getId = that.data.id;
          wx.setStorageSync('saveId',getId);
          wx.navigateTo({
            url: "/pages/logs/logs?id=editflag"
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