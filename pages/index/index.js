//index.js
//获取应用实例
const util = require('../../utils/util.js')
const app = getApp()
const qqmapsdk = app.globalData.qqmapsdk
const points = app.globalData.points
Page({
  data:{
       locationCount: false
  },
  onLoad: function () {
    util.checkForUpdate();     
    this.setData({
      "scale": 16.5,
      "lastUpdateLocationTime": 0
    })
  },
  onShow: function () {
    this.hideModal();
    var that = this;
    this.setData({
      "stopTimer": false
    })
    if(!this.data.locationCount){
      getCurrentLocation(that, false);
      startRelocationTimer(this)
      // 调用接口
      this.setData({
        locationCount: true
      })
    } 
  },
  onUnload: function () {
    clearTimeout(this.data.timer);
  },
  onHide: function(){
  },
  showModal: function (event) {
    this.setData({
      "stopTimer": true
    })
    var id = event.markerId;
    var singlePoint = getSinglePoint(id, points);
    this.setData({
      singlePoint:singlePoint
    })
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },

  hideModal: function () {
    this.setData({
      "stopTimer": false
    })
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  showOrientation:function(){
    var that = this;
    wx.showModal({
      title: '定位提示',
      content: '确定要去这里？',
      success:function(res){
          if(res.confirm){
            wx.openLocation({ // 打开微信内置地图，实现导航功能（在内置地图里面打开地图软件）
              latitude: that.data.singlePoint.latitude,
              longitude: that.data.singlePoint.longitude,
              name: that.data.singlePoint.address + that.data.singlePoint.title,
              success: function (res) {
                console.log(res);
              },
              fail: function (res) {
                console.log(res);
              }
            })
          }else{
            that.hideModal();
          }
      },
      fail:function(){
        this.hideModal();
      }
    })
  },
  controltap:function(e){
    var that = this;
    var controlId = e.currentTarget.id;
    if (controlId === "zoomIn") {
      that.setData({
        scale: ++that.data.scale
      })
    } else if (controlId === "zoomOut"){
      that.setData({
        scale: --that.data.scale
      })
    } else if (controlId === "refresh"){
        wx.showLoading({
          title: '数据正在加载中...',
        })
        getCurrentLocation(that, true);
        wx.vibrateLong();
        wx.hideLoading();
    } else if (controlId === "relocation"){ 
      var mapContext = wx.createMapContext("myMap", this);
      mapContext.moveToLocation();
    } else if (controlId === "about"){
      wx.navigateTo({
        url: '/pages/about/about'
      })
      that.setData({
        "stopTimer":true
      })
    }else if(controlId === "choice"){
        
    }
  }
})
function getCurrentLocation(obj, manual) {
    wx.showLoading({
     title: '数据正在加载...',
    })
    var time = new Date().getTime();
    var lastUpdateTime = obj.data.lastUpdateLocationTime;
    if(time - lastUpdateTime < 10 * 1000){
        wx.hideLoading();
        wx.vibrateLong();
        return; 
    }
    obj.setData({
    "lastUpdateLocationTime": time
     })
    wx.getLocation({
      type: "gcj02",
      success: function (res) {
        if(res.latitude != obj.data.latitude || res.longitude != obj.data.longitude){
          obj.setData({
            'longitude': res.longitude,
            'latitude': res.latitude
          });
          searchPoints(obj, points)
        }
        wx.vibrateLong();   
      },
      fail: function (res){
        if (res.errMsg.indexOf("auth")){
          wx.hideLoading();
          wx.getSetting({
            success(settingRes) {
              if (!settingRes.authSetting["scope.userLocation"]) {
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
                            wx.showLoading({
                              title: '数据正在加载...',
                            }),
                              wx.getLocation({
                                type: "gcj02",
                                success: function (reRes) {
                                  obj.setData({
                                    'longitude': reRes.longitude,
                                    'latitude': reRes.latitude
                                  });
                                  searchPoints(obj, points)
                                  wx.vibrateLong();
                                },
                                fail: function () {
                                  wx.showModal({
                                    title: '错误提示',
                                    content: '获取位置信息失败，请检测手机GPS功能是否打开，或者手机网络是否不可达！',
                                    showCancel: false
                                  })
                                  log.error("ReGetting location failed: " + reRes.errMsg);

                                },
                                complete: function (reRes) {
                                  wx.hideLoading();
                                }
                              },
                              )
                          }
                        }
                      })
                    }else{
                      return;
                    }
                  }
                })
              }
            }
          })  
        }else{
          wx.hideLoading();
          wx.showModal({
            title: '错误提示',
            content: '获取位置信息失败，请检测手机GPS功能是否打开，或者手机网络是否不可达！',
            showCancel: false
          })
          log.error("Getting location failed: " + res.errMsg);
        }    
      },
      complete:function(){
        wx.hideLoading();
      }
    })
    
}

function searchPoints(obj, points){
  qqmapsdk.search({
    keyword: 'WC',  //搜索关键词
    success: function (res) { //搜索成功后的回调
      var mks = [];
      for (var i = 0; i < res.data.length; i++) {
        mks.push({ // 获取返回结果，放到mks数组中
          //title: res.data[i].title,
          id: res.data[i].id,
          latitude: res.data[i].location.lat,
          longitude: res.data[i].location.lng,
          iconPath: "../../images/toilet.png", //图标路径
          width: 40,
          height: 40
        })
        points[i] = res.data[i];
      }
      calculateDistance(obj, points);
      for (var index in mks) {
        if (mks[index].id === points[0].id) {
          mks[index]["callout"] = {
            content: '离您最近',
            color: '#1296db',
            fontSize: 15,
            borderRadius: 2,
            display: 'ALWAYS',
            bgColor: "#dbdbdb",
            opacity: 0.3,
            borderWidth: 1,
            borderColor: "#dbdbdb",
          };
          mks[index].width = 50;
          mks[index].height = 50;
          mks[index].iconPath = '../../images/toiletNearest.png'
        }
      }
      obj.setData({ //设置markers属性，将搜索结果显示在地图中
        markers: mks
      })
    },
    fail: function (res) {
      log.error("Getting the points failed: " + res.errMsg)
      return;
    },
    complete: function(res){
        wx.hideLoading();
    }
  });
}

function calculateDistance(obj, points) {
  var toPoints = [];
  points.forEach(function (item, index) {
    toPoints[index] = {"latitude": item.location.lat, "longitude": item.location.lng};
  })
  qqmapsdk.calculateDistance({
    mode: 'straight',//可选值：'driving'（驾车）、'walking'（步行），不填默认：'walking',可不填
    //from参数不填默认当前地址
    //获取表单提交的经纬度并设置from和to参数（示例为string格式）
    from: '', //若起点有数据则采用起点坐标，若为空默认当前地址
    to: toPoints, //终点坐标
    success: function (res) {//成功后的回调
      var res = res.result;
      var dis = [];
      for (var i = 0; i < res.elements.length; i++) {
        points[i]["distance"] = res.elements[i].distance;
        points[i]["latitude"] = toPoints[i].latitude;
        points[i]["longitude"] = toPoints[i].longitude
      }
      points.sort(compare("distance"));
    },
    fail: function (error) {
      console.error(error);
    },
    complete:function(res){
    }
  })
}
function compare(property){
  return function (a, b) {
    var value1 = a[property];
    var value2 = b[property];
    return value1 - value2;
  }
}


function getSinglePoint(id, points){
 var singlePoint;
 points.forEach(function(point, index){
      if(point.id === id){
        singlePoint=point;
      }
  })
  return singlePoint;
}

function startRelocationTimer(obj) {
     var timerName = setTimeout(function () {
       if (!obj.data.stopTimer){
         getCurrentLocation(obj, false);
       }
       if (app.globalData.listPage){
         app.globalData.listPage.onShow();
       }
       startRelocationTimer(obj);   
     }, 60 * 1000) 
     // 保存定时器name
      obj.setData({
        timer: timerName
     })
 }
