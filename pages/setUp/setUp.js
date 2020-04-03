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
    setList: [{ name: '个人资料设置', url: '../dataSet/dataSet' }, { name: '提现密码', url: '../setPassword/setPassword' }, { name: '联系客服', url: '15010825114', phone: '0434-23423423' }, { name: '关于我们', url: '../aboutUs/aboutUs' }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 退出登录
  goOutLogin:function(){
    wx.request({
      url: ajax_url + '/wx/logout',
      method: "get",
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function (res) {
        if (res.data.code == '200') {
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
  // 页面跳转
  goPages: function (e) {
    let pageUrl = e.currentTarget.dataset.url
    if (pageUrl == '15010825114') {
      wx.makePhoneCall({
        phoneNumber: pageUrl
      })
    } else {
      wx.navigateTo({
        url: pageUrl
      })
    }

  }
})