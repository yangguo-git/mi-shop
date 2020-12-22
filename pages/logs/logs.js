const httpUtil = require('../../utils/httpUtil');
Page({
  data: {
    isShow: true,
    jumpFlag:'',
    isCenter:'',
    btnshowFlag:'',
    cancelFlag:''
  },
  bindGetUserInfo: function (e) {
    var saveThis = this;
    var wxLogin = httpUtil.wxLogin();
    wxLogin().then((res) => {
      console.log(res,'获取code')
      let params = {
        code: res.code,
        raw_data: e.detail.rawData,
        signature: e.detail.signature,
        encrypt_data: e.detail.encryptedData,
        iv: e.detail.iv
      };
      httpUtil.postData('/minip/login', params, '加载中', function (res) {
        console.log(res);
        if (!res.data) {
          wx.showToast({
            title: res.msg || '系统繁忙，请稍候再试',
            icon: 'none',
            duration: 1000
          })
          return;
        }else{
          if(res.data.infoInside){
            wx.showToast({
              title: '授权成功',
              icon: 'none',
              duration: 1000
            })
            wx.setStorageSync('infoAccess',res.data.infoInside);
            wx.setStorageSync('userInfos',JSON.stringify(res.data));
          }else{
            wx.showToast({
              title: '授权失败,请重试',
              icon: 'none',
              duration: 1000
            })
            return;
          }
          //跳转
          console.log('saveThis.data',saveThis.data)
          if(saveThis.data.jumpFlag){
            let getFlag = saveThis.data.jumpFlag;
            let saveCenter = saveThis.data.isCenter;
            if(getFlag == 'add'){
              wx.redirectTo({
                url: '/pages/member/addressManage/addressManage?isCenter=1'
              })
            }else if(getFlag == 'addflag'){
              wx.navigateBack();
            }else if(getFlag == 'editflag'){
              wx.navigateBack();
            }else if(getFlag == '8'){
              wx.redirectTo({
                url: '/pages/member/addressManage/addressManage?isCenter='+saveCenter
              })
            }

          }else{
            let pages = getCurrentPages();
            let prevPage = pages[ pages.length - 2 ];  
            let getbtnFlag = saveThis.data.btnshowFlag;
            prevPage.setData({
              postIshow:'postdetail',
              btnshowFlag:getbtnFlag
            })
            wx.navigateBack();
          }
        }

      }, function (res) {
        wx.showToast({
          title: res.msg || '系统繁忙，请稍候再试',
          icon: 'none',
          duration: 1000
        })
      }, 1)
    });
  },

  getPhoneNumber: function (e) {
    let params = {
      encrypt_data: e.detail.encryptedData,
      iv: e.detail.iv
    }
    httpUtil.postData('/minip/phone', params, '加载中', function (res) {
      if (!res.data) {
        wx.showToast({
          title: res.msg || '系统繁忙，请稍候再试',
          icon: 'none',
          duration: 1000
        })
        return;
      }

    }, function (res) {
      wx.showToast({
        title: res.msg || '系统繁忙，请稍候再试',
        icon: 'none',
        duration: 1000
      })
    }, 1)
    return;
   
  },
  onLoad: function (e) {
    if(e.btnshowFlag){
      this.setData({
        btnshowFlag:e.btnshowFlag
      })
    }
    
    //添加判断
    if(e.id || e.isCenter || e.cancel){
      this.setData({
        jumpFlag:e.id ||'',
        isCenter:e.isCenter||'',
        cancelFlag:e.cancel||''
      })
    }
  },
  handleCancel(){
    let getCancel = this.data.cancelFlag;
    if(getCancel == "shop" ||getCancel == "navlog"){
      wx.switchTab({
        url: '/pages/index/index'
      })
    }else{
      wx.navigateBack();
    }
    
  }
})