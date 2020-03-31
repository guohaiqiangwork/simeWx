//app.js
App({
  onLaunch: function() {
   
  },
  nativeData: {
    token: '', //token
    openId: '',
    useId: ''
  },
  globalData: {
    ajax_url: 'https://www.bjxrkj.com/api',
  },
  isLogin: function() {
    wx.request({
      url: 'https://www.bjxrkj.com/api/wx/isLogin',
      method: "get",
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function(res) {
        if (res.data.code != '200') {
          wx.navigateTo({
            url: '../logs/logs'
          })
        }
      }
    })

  }
})