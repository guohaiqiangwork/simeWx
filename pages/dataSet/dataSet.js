const app = getApp()
const ajax_url = app.globalData.ajax_url;
const date = new Date();
const years = [];
const months = [];
const days = [];
const hours = [];
const minutes = [];
//获取年
for (let i = 2018; i <= date.getFullYear() + 5; i++) {
  years.push("" + i);
}
//获取月份
for (let i = 1; i <= 12; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  months.push("" + i);
}
//获取日期
for (let i = 1; i <= 31; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  days.push("" + i);
}
//获取小时
for (let i = 0; i < 24; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  hours.push("" + i);
}
//获取分钟
for (let i = 0; i < 60; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  minutes.push("" + i);
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bar_Height: wx.getSystemInfoSync().statusBarHeight,
    ishideback: false,
    my_class: true,
    sexList: ['请选择', '男', '女'],
    sexIndex: 1,
    rememberDay: '请选择',
    birthdayDay: '请选择',
   
    multiArray: ["", months, days, "", ""], //月日
    multiIndex: [0, 9, 16, 10, 17],
    choose_year: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getUserList();
  },
  // 获取个人信息
  getUserList: function() {
    var _this = this;
    //get请求
    wx.request({
      url: ajax_url + '/mb/find/' + wx.getStorageSync('useId'),
      method: "get",
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function(res) {
        if (res.data.code == '200') {
          console.log(res);
     
          console.log(res.data.data.sex)
          res.data.data.mobile = res.data.data.mobile.substring(3, 0) + "^_^" + res.data.data.mobile.substring(7, 11);
     
          var bigTime = new Date().valueOf();
          console.log(bigTime)
          var timeFalgOne = Date.parse(res.data.data.rememberTime) > bigTime;
          console.log(timeFalgOne)
          _this.setData({
            listData: res.data.data,
            sexIndex: res.data.data.sex,
            rememberDay: res.data.data.rememberDay || '请选择',
            birthdayDay: res.data.data.birthday || '请选择',
            timeFalgOne: timeFalgOne
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
  // 保存数据
  saveData: function(e) {
    var _this = this;
    if (_this.data.rememberDay == '请选择') {
      _this.data.rememberDay = '';
    };
    if (_this.data.birthdayDay == '请选择') {
      _this.data.birthdayDay = '';
    }
    if (e.currentTarget.dataset.falg == 'jn'){
      var dataBase = {
        birthday: '',
        rememberDay: _this.data.rememberDay,
        sex: '',
        id: wx.getStorageSync('useId'),
      };
    }else{
      var dataBase = {
        birthday: _this.data.birthdayDay,
        rememberDay: _this.data.rememberDay,
        sex: _this.data.sexIndex,
        id: wx.getStorageSync('useId'),
      };
    }
   
    wx.request({
      url: ajax_url + '/mb/updateMember',
      method: "post",
      data: dataBase,
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function(res) {
        if (res.data.code == '200') {
          wx.showModal({
            content: '保存成功',
            confirmColor: '#6928E2',
            showCancel: false,
          })
          // if (_this.data.rememberDay){
            _this.setData({
              isRuleTrue: false,
            })
          // }
          _this.getUserList(); //刷新数据
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
  // 照片上传
  selectImg: function(e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: [ 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        //res.tempFilePaths 返回图片本地文件路径列表
        var tempFilePaths = res.tempFilePaths;
        let list = "setList[0].headImgUrl"
        that.setData({
          [list]: tempFilePaths[0],
          upimgPath: tempFilePaths[0]
        })

        that.loadImg();
      }
    })
  },
  loadImg: function() {
    wx.showLoading({
      title: '上传中...',
    })
    var _this = this;
    wx.uploadFile({
      url: ajax_url + '/mb/uploadAvatar/' + wx.getStorageSync('useId'),
      filePath: _this.data.upimgPath,
      name: "file",
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function(res) {
        wx.hideLoading();
        var json = JSON.parse(res.data) // 此处转换
        console.log(json)
        if (json.code == 200) {
          console.log(JSON.stringify(json.data))
          wx.showToast({
            title: "图像上传成功！",
            icon: "none",
            duration: 1500,
            mask: true
          });
          _this.getUserList()//刷新数据
        } else {
          wx.showModal({
            content: json.message,
            confirmColor: '#6928E2',
            showCancel: false,
          })
        }

      },
      fail: function(res) {
        wx.showToast({
          title: "上传失败，请检查网络或稍后重试。",
          icon: "none",
          duration: 1500,
          mask: true
        });
      }

    })
  },

  // 名字
  goModifyName: function(e) {
    wx.navigateTo({
      url: '/pages/modifyName/modifyName?name=' + e.currentTarget.dataset.value,
    })
  },
  // 电话
  goModifyPhone: function(e) {
    wx.navigateTo({
      url: '/pages/modifyPhone/modifyPhone',
    })
  },
  // 男女
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      sexIndex: e.detail.value
    })
    this.saveData(); //保存数据
  },
  // 生日
  rememberDayPick: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      birthdayDay: e.detail.value
    });
    this.saveData();
  },
  // 纪念日
  bindMultiPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
    const index = this.data.multiIndex;
    const year = this.data.multiArray[0][index[0]];
    const month = this.data.multiArray[1][index[1]];
    const day = this.data.multiArray[2][index[2]];
    const hour = this.data.multiArray[3][index[3]];
    const minute = this.data.multiArray[4][index[4]];
    // console.log(`${year}-${month}-${day}-${hour}-${minute}`);
    this.setData({
      rememberDay: month + '-' + day,
      isRuleTrue: true,
    });
    
  },
  //监听picker的滚动事件
  bindMultiPickerColumnChange: function(e) {
    //获取年份
    if (e.detail.column == 0) {
      let choose_year = this.data.multiArray[e.detail.column][e.detail.value];
      console.log(choose_year);
      this.setData({
        choose_year
      })
    }
    //console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    if (e.detail.column == 1) {
      let num = parseInt(this.data.multiArray[e.detail.column][e.detail.value]);
      let temp = [];
      if (num == 1 || num == 3 || num == 5 || num == 7 || num == 8 || num == 10 || num == 12) { //判断31天的月份
        for (let i = 1; i <= 31; i++) {
          if (i < 10) {
            i = "0" + i;
          }
          temp.push("" + i);
        }
        this.setData({
          ['multiArray[2]']: temp
        });
      } else if (num == 4 || num == 6 || num == 9 || num == 11) { //判断30天的月份
        for (let i = 1; i <= 30; i++) {
          if (i < 10) {
            i = "0" + i;
          }
          temp.push("" + i);
        }
        this.setData({
          ['multiArray[2]']: temp
        });
      } else if (num == 2) { //判断2月份天数
        let year = parseInt(this.data.choose_year);
        console.log(year);
        if (((year % 400 == 0) || (year % 100 != 0)) && (year % 4 == 0)) {
          for (let i = 1; i <= 29; i++) {
            if (i < 10) {
              i = "0" + i;
            }
            temp.push("" + i);
          }
          this.setData({
            ['multiArray[2]']: temp
          });
        } else {
          for (let i = 1; i <= 28; i++) {
            if (i < 10) {
              i = "0" + i;
            }
            temp.push("" + i);
          }
          this.setData({
            ['multiArray[2]']: temp
          });
        }
      }
      console.log(this.data.multiArray[2]);
    }
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    this.setData(data);
  },
  //关闭纪念日提示
  hideRule: function () {
    this.setData({
      isRuleTrue: false,
      isScroll: true,
      rememberDay:'请选择'
    })
  },
  onShow: function() {
    this.onLoad()
  },

})