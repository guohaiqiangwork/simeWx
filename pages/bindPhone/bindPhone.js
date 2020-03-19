// pages/bindPhone/bindPhone.js
const app = getApp()
const ajax_url = app.globalData.ajax_url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    yzmButtonName: '获取验证码',
    onOff: true, //验证码开关,
    phone: '', //手机号码
    code: '', //验证码
  },
  phoneInput: function(e) {
    var _this = this;
    _this.setData({
      phone: e.detail.value
    })
  },
  codeInput: function(e) {
    var _this = this;
    _this.setData({
      code: e.detail.value
    })
  },
  // 获取验证码
  getYzm: function(e) {
    let that = this;
    let yzm = that.data.yzm;
    let telephone = that.data.phone;
    if (telephone.length < 11 || !(/^1[3456789]\d{9}$/.test(telephone))) {
      wx.showModal({
        content: '请输入正确手机号',
        confirmColor: '#6928E2',
        showCancel: false,
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
            wx.showModal({
              content: res.data.message,
              confirmColor: '#6928E2',
              showCancel: false,
            })
          }
        }
      })
    }
  },
  // 手机号登录
  goLogin: function(e) {
    var _this = this
    if (_this.data.phone.length != 11) {
      wx.showModal({
        content: '请输入正确手机号',
        confirmColor: '#6928E2',
        showCancel: false,
      });
      return;
    } else if (_this.data.code.length != 6) {
      wx.showModal({
        content: '请输入正确验证码',
        confirmColor: '#6928E2',
        showCancel: false,
      });
      return;
    }
    var keyword = {
      phone: _this.data.phone,
      code: _this.data.code,
      openId: app.nativeData.openId || '',
      headImgUrl: app.nativeData.imgurl || '',
      nickName: app.nativeData.name || ''
    }
    wx.showLoading({
      title: '登录中',
    })
    //手机号登录
    wx.request({
      url: ajax_url + '/wx/weixin/messages',
      method: "POST",
      data: keyword,
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值 
      },
      success: function(res) {
        console.log(res)
        wx.hideLoading()
        if (res.data.code == '200') {
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 2000
          });
          wx.setStorage({
            key: 'token',
            data: res.data.data.token
          })
          wx.setStorage({
            key: 'useId',
            data: res.data.data.id
          })
          wx.switchTab({
            url: '../../pages/index/index'
          })
        } else {
          wx.showModal({
            content: res.data.message,
            confirmColor: '#6928E2',
            showCancel: false,
          })
        }
      }
    })
  },
  goHome: function () {
    wx.switchTab({
      url: '../../pages/index/index'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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