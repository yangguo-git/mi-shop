Page({
  data: {
    isPeople:true,
    isCompany:false,
    isActive:0,
    isNeed:false,
    receivePhone:'',
    receiveMail:'',
    personName:'',
    companyName:'',
    companyCode:'',
    companyAdress:'',
    companyPhone:'',
    companyBank:'',
    companyBankaccount:'',
  },
  onLoad: function (options) {

  },
  radioChange:function(e){
    console.log(e.detail.value)
    if(e.detail.value == 1){
      this.setData({
        isNeed:true,
        isActive:0,
        isPeople:true,
        isCompany:false
      })
    }else{
      this.setData({
        isNeed:false
      })
    }
  },
  changeEvent:function(e){
    var getStatus = e.currentTarget.dataset;
    if(getStatus.status == 1){//公司
      this.setData({
        isPeople:false,
        isCompany:true,
        isActive:getStatus.status
      })
    }else{
      this.setData({
        isPeople:true,
        isCompany:false,
        isActive:getStatus.status
      })
    }
  },
  input_name:function(e){
    this.setData({
      receivePhone:e.detail.value.trim()
    });
  },
  input_mail:function(e){
    this.setData({
      receiveMail:e.detail.value.trim()
    });
  },
  personInput:function(e){
    this.setData({
      personName:e.detail.value.trim()
    });
  },
  comInputName:function(e){
    this.setData({
      companyName:e.detail.value.trim()
    });
  },
  comInputCode:function(e){
    this.setData({
      companyCode:e.detail.value.trim()
    });
  },
  comInputAdress:function(e){
    this.setData({
      companyAdress:e.detail.value.trim()
    });
  },
  comInputPhone:function(e){
    this.setData({
      companyPhone:e.detail.value.trim()
    });
  },
  comInputBank:function(e){
    this.setData({
      companyBank:e.detail.value.trim()
    });
  },
  comInputAccount:function(e){
    this.setData({
      companyBankaccount:e.detail.value.trim()
    });
  },
  getWechat:function(){
    let that = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.invoiceTitle']) {
          wx.chooseInvoiceTitle({
            success(res) {
              if(res){
                console.log(res)
                let getCode = res.type;
                if(getCode == 1){//个人
                  that.setData({
                    personName:res.title,
                    isPeople:true,
                    isCompany:false,
                    isActive:0
                  })
                }else if(getCode == 0){//单位
                  that.setData({
                    companyAdress:res.companyAddress,
                    companyCode:res.taxNumber,
                    companyName:res.title,
                    companyBank:res.bankName,
                    companyBankaccount:res.bankAccount,
                    isPeople:false,
                    isCompany:true,
                    isActive:1
                  })
                }
              }
            }
          })
        } else {
          if (res.authSetting['scope.invoiceTitle'] == false) {
            wx.openSetting({
              success(res) {
                console.log(res.authSetting)
              }
            })
          } else {
            wx.chooseInvoiceTitle({
              success(res) {
                if(res){
                  console.log(res)
                  let getCode = res.type;
                  if(getCode == 1){//个人
                    that.setData({
                      personName:res.title,
                      isPeople:true,
                      isCompany:false,
                      isActive:0
                    })
                  }else if(getCode == 0){//单位
                    that.setData({
                      companyAdress:res.companyAddress,
                      companyCode:res.taxNumber,
                      companyName:res.title,
                      companyBank:res.bankName,
                      companyBankaccount:res.bankAccount,
                      isPeople:false,
                      isCompany:true,
                      isActive:1
                    })
                  }
                }
              },
              fail:function(){
                wx.showToast({
                  title: '请打开发票抬头权限后重试',
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
  sureMark:function(){
    let phoneReg = /^1[3456789]\d{9}$/;//手机号
    //邮箱
    let mailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    let that = this;
    if(that.data.isActive == 1){//公司
      if(that.data.companyName == ''){
        wx.showToast({
          title:'请填写公司名称',
          icon: 'none',
          duration: 1000
        })
        return;
      }
      if(that.data.companyCode == ''){
        wx.showToast({
          title:'请填写纳税人识别号',
          icon: 'none',
          duration: 1000
        })
        return;
      }
    }else{//个人
      if(that.data.personName == ''){
        wx.showToast({
          title:'请填写姓名',
          icon: 'none',
          duration: 1000
        })
        return;
      }
    }
    //公共部分
    let getCommonePhone = this.data.receivePhone;
    let getCommoneMail = this.data.receiveMail;
    if(getCommonePhone == ''){
      wx.showToast({
        title:'请填写手机号码',
        icon: 'none',
        duration: 1000
      })
      return;
    }else{
      if(!phoneReg.test(getCommonePhone)){
        wx.showToast({
          title:'手机号格式不正确',
          icon: 'none',
          duration: 1000
        })
        return;
      }

    }
    if(getCommoneMail == ''){
      wx.showToast({
        title:'请填写邮箱',
        icon: 'none',
        duration: 1000
      })
      return;
    }else{
      if(!mailReg.test(getCommoneMail)){
        wx.showToast({
          title:'邮箱格式不正确',
          icon: 'none',
          duration: 1000
        })
        return;
      }

    }

    //调接口


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