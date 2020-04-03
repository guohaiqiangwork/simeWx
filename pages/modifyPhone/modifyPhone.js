const app = getApp()
const ajax_url = app.globalData.ajax_url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bar_Height: wx.getSystemInfoSync().statusBarHeight,
    ishideback: false,
    my_class: true,
    yzmButtonName: '获取验证码',
    onOff: true, //验证码开关,
    mobile: ''
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
   
  },
  // 手机号
  inputMobile: function(e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  //验证码
  inputCode: function(e) {
    this.setData({
      code: e.detail.value
    })
  },
  // 获取验证码
  getYzm: function(e) {
    let that = this;
    let yzm = that.data.yzm;
    let telephone = that.data.mobile;
    if (!telephone) {
      // wx.showModal({
      //   content: '请输入正确手机号',
      //   confirmColor: '#6928E2',
      //   showCancel: false,
      // })
      wx.showToast({
        title: '请输入正确手机号',
        icon: 'none',
        duration: 1000,
      })
      return;
    }
    if (telephone.length < 11 || !(/^1[3456789]\d{9}$/.test(telephone))) {
      // wx.showModal({
      //   content: '请输入正确手机号',
      //   confirmColor: '#6928E2',
      //   showCancel: false,
      // })

      wx.showToast({
        title: '请输入正确手机号',
        icon: 'none',
        duration: 1000,
      })
      return;
    }
    if (!that.data.onOff) {
      return;
    } else {
      let times = 60;
      var data = {
        phone: telephone
      };
      wx.showLoading({
        title: '获取中',
      })
      // 获取验证码
      wx.request({
        url: ajax_url + '/wx/send/messages',
        method: "POST",
        data: data,
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值 
        },
        success: function(res) {
          console.log(JSON.stringify(res))
          wx.hideLoading();
          if (res.data.code == '200') {
            wx.showToast({
              title: '获取验证码成功',
              icon: 'success',
              duration: 2000
            })
            that.data.setInter = setInterval(function() {
              times--;
              if (times < 1) {
                that.setData({
                  yzmButtonName: "重新获取"
                });
                that.data.onOff = true;
                clearInterval(that.data.setInter);
              } else {
                that.setData({
                  yzmButtonName: times + 's'
                });
                that.data.onOff = false;
              }
            }, 1000);
          } else {
            // wx.showModal({
            //   content: res.data.message,
            //   confirmColor: '#6928E2',
            //   showCancel: false,
            // })

            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 1000,
            })
          }
        }
      })
    }
  },

  // 保存姓名
  getName: function() {
    var _this = this;
    var dataBase = {
      mobile: _this.data.mobile,
      code: _this.data.code
    };
    wx.request({
      url: ajax_url + '/mb/updateMobile/' + wx.getStorageSync('useId'),
      method: "post",
      data: dataBase,
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.code == '200') {
          // wx.showModal({
          //   content: '保存成功',
          //   confirmColor: '#6928E2',
          //   showCancel: false,
          // })
          wx.showToast({
            title: '保存成功',
            icon: 'none',
            duration: 1000,
          })
          wx.navigateBack({
            delta: 1,
          })
        } else {
          // wx.showModal({
          //   content: res.data.message,
          //   confirmColor: '#6928E2',
          //   showCancel: false,
          // })
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 1000,
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})