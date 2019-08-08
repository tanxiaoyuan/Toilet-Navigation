// pages/list/list.js
const app = getApp();
const points = app.globalData.points;
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.checkForUpdate();
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
    if (!points[0]["distance"]){
      return;
    }
    this.setData({
      "points": points
    })
   // getCurrentLocation(this);
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

  },
  showOrientation: function (e) {
    var that = this;
    var toLocation = e.currentTarget.id;
    wx.showModal({
      title: '导航提示',
      content: '确定要去【' + toLocation + '】？',
      success: function (res) {
        if (res.confirm) {
          wx.openLocation({ // 打开微信内置地图，实现导航功能（在内置地图里面打开地图软件）
            latitude: that.data.latitude,
            longitude: that.data.longitude,
            name: toLocation,
            success: function (res) {
              console.log(res);
            },
            fail: function (res) {
              console.log(res);
            }
          })
        } else {

        }
      },
      fail: function () {

      }
    })
  }
})

function getCurrentLocation(obj) {
  return new Promise(function (resolve, reject) {
    wx.getLocation({
      type: "wgs84",
      success: function (res) {
        resolve(res),
          obj.setData({
            'longitude': res.longitude,
            'latitude': res.latitude
          })
      },
      fail: function (res) {
        wx.getSetting({
          success(res) {
            if (!res.authSetting["scope.userLocation"]) {
              wx.showModal({
                title: '授权提示',
                content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用！',
                success: function (tip) {
                  if (tip.confirm) {
                    wx.openSetting({
                      //点击确定则调其用户设置
                      success: function (data) {
                        if (data.authSetting["scope.userLocation"] === true) {
                          //如果设置成功
                          wx.showToast({
                            //弹窗提示
                            title: "授权成功",
                            icon: "success",
                            duration: 1000
                          });
                          wx.getLocation({
                            type: "wgs84",
                            success: function (res) {
                              resolve(res),
                                obj.setData({
                                  'longitude': res.longitude,
                                  'latitude': res.latitude,
                                  'iconPath': "../../images/location.png",
                                  "scale": 16
                                })
                            }
                          })
                        }
                      }
                    })
                  }
                }
              })
            }
          }
        })
      }
    })
  })
}