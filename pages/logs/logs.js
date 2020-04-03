const app = getApp()
const ajax_url = app.globalData.ajax_url;
Page({
  data: {
    yzmButtonName: '获取验证码',
    onOff: true, //验证码开关,
    phone: '', //手机号码
    code: '', //验证码
    oprnId: '' //微信openId
  },
  phoneInput: function (e) {
    var _this = this;
    _this.setData({
      phone: e.detail.value
    })
  },
  codeInput: function (e) {
    var _this = this;
    _this.setData({
      code: e.detail.value
    })
  },
  // 获取验证码
  getYzm: function (e) {
    let that = this;
    let yzm = that.data.yzm;
    let telephone = that.data.phone;
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
        success: function (res) {
          wx.hideLoading();
          if (res.data.code == '200') {
            wx.showToast({
              title: '获取验证码成功',
              icon: 'success',
              duration: 2000
            })
            that.data.setInter = setInterval(function () {
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

  // 手机号登录
  goLogin: function (e) {
    var _this = this
    if (_this.data.phone.length != 11) {
      // wx.showModal({
      //   content: '请输入正确手机号',
      //   confirmColor: '#6928E2',
      //   showCancel: false,
      // });
      wx.showToast({
        title: '请输入正确手机号',
        icon: 'none',
        duration: 1000,
      })
      return;
    } else if (_this.data.code.length != 6) {
      // wx.showModal({
      //   content: '请输入正确验证码',
      //   confirmColor: '#6928E2',
      //   showCancel: false,
      // });
      wx.showToast({
        title: '请输入正确验证码',
        icon: 'none',
        duration: 1000,
      })
      return;
    }
    var data = {
      phone: _this.data.phone,
      phoneCode: _this.data.code,
      openId: ''
    };
    wx.showLoading({
      title: '登录中',
    })
    //手机号登录
    wx.request({
      url: ajax_url + '/wx/send/login',
      method: "POST",
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值 
      },
      success: function (res) {
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
          }
          )
          wx.setStorage({
            key: 'useId',
            data: res.data.data.id
          }
          )

          wx.switchTab({
            url: '../../pages/index/index'
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

  // 是否授权弹窗
  bindGetUserInfo: function (res) {
    app.nativeData.name = res.detail.userInfo.nickName
    app.nativeData.imgurl = res.detail.userInfo.avatarUrl
    if (res.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      var data = {
        'openId': app.nativeData.openId,
        'nickName': res.detail.userInfo.nickName,
        'headImgUrl': res.detail.userInfo.avatarUrl,
      };
      //判断是否绑定手机号
      wx.request({
        url: ajax_url + '/wx/havePhone',
        method: "POST",
        data: data,
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        success: function (res) {
          if (res.data.code == '200') {
            wx.showToast({
              title: '登录成功',
              icon: 'success',
              duration: 2000
            });
            wx.setStorage({
              key: 'token',
              data: res.data.data.token
            }
            )
            wx.setStorage({
              key: 'useId',
              data: res.data.data.id
            }
            )
            wx.switchTab({
              url: '../../pages/index/index'
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
            setTimeout(function () {
              wx.navigateTo({
                url: '/pages/bindPhone/bindPhone',
              })
            }, 500)
          }
        }
      })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
  },
  goHome: function () {
    wx.switchTab({
      url: '../../pages/index/index'
    })
  },


  onLoad: function () {

  }
})