//获取应用实例
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
    yzm: "",
    telephone: "",
    newPassword: "",
    confirmNewPassword: "",
    yzmButtonName: '获取验证码',
    onOff: true, //验证码开关
    setInter: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getUserList();
  },
  // 获取用户手机号码
  getUserList: function() {
    var _this = this;
    wx.request({
      url: ajax_url + '/mb/find/' + wx.getStorageSync('useId'),
      method: "get",
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function(res) {
        console.log(res)
        if (res.data.code == '200') {
          _this.setData({
            telephone: res.data.data.mobile
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

  //监听输入的账号
  yzmInp: function(e) {
    this.data.yzm = e.detail.value;
  },

  //监听输入的账号
  newPasswordInp: function(e) {
    this.data.newPassword = e.detail.value;
  },

  //监听输入的账号
  confirmNewPasswordInp: function(e) {
    this.data.confirmNewPassword = e.detail.value;
  },

  /**
   * 获取验证码
   */
  getYzm: function(e) {
    let that = this;
    let yzm = that.data.yzm;
    let telephone = that.data.telephone;
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

  /**
   * 保存
   */
  insertFunc: function() {
    let yzm = this.data.yzm;
    let telephone = this.data.telephone;
    let newPassword = this.data.newPassword;
    let confirmNewPassword = this.data.confirmNewPassword;

    if (!yzm) {
      wx.showToast({
        title: '请填写验证码',
        icon: 'none',
        duration: 1500
      })
      return;
    };

    if (!newPassword) {
      wx.showToast({
        title: '请填写新密码',
        icon: 'none',
        duration: 1500
      })
      return;
    } else if (newPassword.length > 6) {
      wx.showToast({
        title: '新密码不能大于6位',
        icon: 'none',
        duration: 1500
      })
      return;
    }

    if (!confirmNewPassword) {
      wx.showToast({
        title: '请填写确认密码',
        icon: 'none',
        duration: 1500
      })
      return;
    } else if (confirmNewPassword.length > 6) {
      wx.showToast({
        title: '确认密码不能大于6位',
        icon: 'none',
        duration: 1500
      })
      return;
    }

    if (newPassword != confirmNewPassword) {
      wx.showToast({
        title: '请确保密码一致',
        icon: 'none',
        duration: 1500
      })
      return;
    };
    var dataBase = {
      code: yzm.replace(/\s*/g, ""),
      mobile: telephone.replace(/\s*/g, ""),
      memberId: wx.getStorageSync('useId'),
      password: newPassword,
    };
    console.log(dataBase);
    //上面已验证时正确的 下面直接开始对接口
    wx.request({
      url: ajax_url + '/account/updatePassword/' + wx.getStorageSync('useId'),
      method: "post",
      data: dataBase,
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.code == '200') {
          wx.showModal({
            content: '设置成功',
            confirmColor: '#6928E2',
            showCancel: false,
          });
          setTimeout(function(){
            wx.navigateBack({
              delta: -1
            });
          },2000)
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


})