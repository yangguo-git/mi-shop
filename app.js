const httpUtil = require('./utils/httpUtil');
App({
  onLaunch: function (options) {
    this.re_num=0;
    wx.getSystemInfo({
      success (res) {
        console.log(res.platform)//devtools   ios   android
        wx.setStorageSync('client',res.platform);
      }
    })
  },

  getInfoAccess_promise() {
    return new Promise(rr => {
      wx.login({
        success: (res) => {
          var re_login_fc = () => {
            httpUtil.postData('/minip/login', {
              code: res.code
            }, '', function (res) {

              if (res.status == 0) {
                if(res.data.infoInside == ""){
                  wx.navigateTo({
                    url: "/pages/logs/logs"
                  })
                  rr(false)
                }else{
                  wx.setStorageSync('infoAccess', res.data.infoInside);
                  // wx.setStorageSync('userInfos', JSON.stringify(res.data));
                  // console.log('getInfoAccess_promise','app.js');
                  rr(true)
                }
              } else {
                if(this.re_num<10){
                  // setTimeout(() => re_login_fc(), 1200);
                }
                this.re_num++
              }

            }, function (err) {
              if(this.re_num<10){
                // setTimeout(() => re_login_fc(), 1200);
              }
              this.re_num++
            },1)
          }
          re_login_fc()
        }
      })
    })
  },
  navLog() {
    wx.navigateTo({
      url: '/pages/logs/logs?cancel=navlog',
    })
  },
  globalData: {
    userInfo: null,
    addRessStatus: false
  }
})