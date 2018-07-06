import portUrl from '../common/portUrl.js';

// 接口返回401则重新授权
export function reAuthorize() {
  let uri = portUrl.passUrl;
  let eti_number

  if (getCookie('microrestaurant_eti_number')) {
    eti_number = getCookie('microrestaurant_eti_number');
  }

  let codeURL = portUrl.urlRoot + portUrl.indexUrl + '?eti_number=' + eti_number;

  let linkURL = uri + '?redirect_url=' + codeURL + '&eti_number=' + decryptByDESModeEBC(eti_number);

  window.location.replace(linkURL);
}

// 时间格式修改
export function getTime(obj, string) {
  let returnString;
  if (string === 'yyyy-MM-dd HH:mm:ss') {
    returnString = new Date(obj).getFullYear() + '-' + ((new Date(obj).getMonth() + 1) < 10 ? '0' + (new Date(obj).getMonth() + 1) : (new Date(obj).getMonth() + 1)) + '-' + (new Date(obj).getDate() < 10 ? '0' + new Date(obj).getDate() : new Date(obj).getDate()) + ' ' + (new Date(obj).getHours() < 10 ? '0' + new Date(obj).getHours() : new Date(obj).getHours()) + ':' + (new Date(obj).getMinutes() < 10 ? '0' + new Date(obj).getMinutes() : new Date(obj).getMinutes()) + ':' + (new Date(obj).getSeconds() < 10 ? '0' + new Date(obj).getSeconds() : new Date(obj).getSeconds())
  } else if (string === 'yyyy-MM-dd') {
    returnString = new Date(obj).getFullYear() + '-' + ((new Date(obj).getMonth() + 1) < 10 ? '0' + (new Date(obj).getMonth() + 1) : (new Date(obj).getMonth() + 1)) + '-' + (new Date(obj).getDate() < 10 ? '0' + new Date(obj).getDate() : new Date(obj).getDate())
  } else if (string === 'MM-dd') {
    returnString = ((new Date(obj).getMonth() + 1) < 10 ? '0' + (new Date(obj).getMonth() + 1) : (new Date(obj).getMonth() + 1)) + '-' + (new Date(obj).getDate() < 10 ? '0' + new Date(obj).getDate() : new Date(obj).getDate())
  }
  return returnString;
}

// 获取近期某一天的日期起
export function getNearDate(time) {
  let fewDate = [{
        value: '今天',
        key: getTime(new Date().getTime(), 'yyyy-MM-dd'),
      }, {
        value: '明天',
        key: getTime(new Date().getTime() + 1000 * 60 * 60 * 24 * 1, 'yyyy-MM-dd'),
      }, {
        value: '后天',
        key: getTime(new Date().getTime() + 1000 * 60 * 60 * 24 * 2, 'yyyy-MM-dd'),
      }];
  let returnString = time;
  
  fewDate.map((array, index) => {
    if (time === array.key) {
      returnString = array.value;
    }
  })
  return returnString;
}

// 获取订餐状态
export function getOrderType(oi_mhb_bii_id, oi_type, order_meal_info) {
  let nowTime = new Date().getTime();
  let paySuccessType;
  let returnObj = {};
  let refundTime;

  if (nowTime <= new Date((order_meal_info.bespeak_date).replace(/-/g,"/") + ' ' + order_meal_info.order_end_time)) {
    paySuccessType = 'reserveTimeBefore';
    let totalTime = new Date((order_meal_info.bespeak_date).replace(/-/g, "/") + ' ' + order_meal_info.order_end_time) - new Date().getTime();
    let refundTimeDay = parseInt(totalTime / (1000 * 60 * 60 * 24));
    let refundTimeHour = parseInt((totalTime - (refundTimeDay * (24 * 60 * 60 * 1000))) / (1000 * 60 * 60));
    let refundTimeMinute = parseInt((totalTime - (refundTimeDay * (24 * 60 * 60 * 1000)) - (refundTimeHour * (60 * 60 * 1000))) / (1000 * 60));
    if (refundTimeDay === 0 && refundTimeHour !== 0 && refundTimeMinute !== 0) {
      refundTime = refundTimeHour + '小时' + refundTimeMinute + '分钟';
    } else if (refundTimeDay === 0 && refundTimeHour === 0 && refundTimeMinute !== 0) {
      refundTime = refundTimeMinute + '分钟';
    } else if (refundTimeDay === 0 && refundTimeHour === 0 && refundTimeMinute === 0) {
      refundTime = '1分钟';
    } else {
      refundTime = refundTimeDay + '天' + refundTimeHour + '小时' + refundTimeMinute + '分钟';
    }
  } else {
    paySuccessType = 'reserveTimeAfter';

    if (order_meal_info.takemeal_end_time && order_meal_info.takemeal_start_time) {
      if (nowTime >= new Date((order_meal_info.bespeak_date).replace(/-/g,"/") + ' ' + order_meal_info.takemeal_start_time) && nowTime <= new Date((order_meal_info.bespeak_date).replace(/-/g,"/") + ' ' + order_meal_info.takemeal_end_time)) {
        paySuccessType = 'takeTime';
      } else if (nowTime > new Date((order_meal_info.bespeak_date).replace(/-/g,"/") + ' ' + order_meal_info.takemeal_end_time)) {
        paySuccessType = 'takeOvertime';
      }
    }
  }

  if (parseInt(oi_type) === 1050) {
    portUrl.orderType.map((array, index) => {
      if (parseInt(array.orderID) === parseInt(oi_mhb_bii_id)) {
        array.orderType.map((arrayChild, indexChild) => {
          if (parseInt(arrayChild.value) === 1050 && arrayChild.name === 'oi_type') {
            arrayChild.timeObj.map((arrayThird, indexThird) => {
              if (arrayThird.key === paySuccessType) {
                returnObj['font'] = arrayThird.value;
                returnObj['text'] = arrayThird.text;
                returnObj['noColor'] = arrayThird.noColor;
              }
            })
          }
        })
      }
    })
  } else {
    portUrl.orderType.map((array, index) => {
      if (parseInt(array.orderID) === parseInt(oi_mhb_bii_id)) {
        array.orderType.map((arrayChild, indexChild) => {
          if (parseInt(arrayChild.value) === parseInt(oi_type)) {
            returnObj['font'] = arrayChild.font;
            returnObj['text'] = arrayChild.text;
            returnObj['noColor'] = arrayChild.noColor;
          }
        })
      }
    })
  }

  returnObj['paySuccessType'] = paySuccessType;

  if (paySuccessType && paySuccessType === 'reserveTimeBefore') {
    returnObj['refundTime'] = refundTime;
  }

  return returnObj;
}

// 获取退款状态
export function getRefundType(value) {
  let returnString;

  portUrl.refundType.map((array, index) => {
    if (parseInt(value) + '' === array.key) {
      returnString = array.value;
    }
  })

  return returnString;
}

// 获取近期某一天是周几
export function getNearDateWeek(time) {
  let returnString = new Date(time.replace(/-/g,"/")).getDay() + 1;

  return returnString;
}

// 获取cookie的某值
export function getCookie(key) {
  let cookieArr = document.cookie.split(';');
  for (let i = 0; i < cookieArr.length; i++) {
    let arr = cookieArr[i].split('=');
    if ( arr[0].trim() === key ) {
      setCookie(key, decodeURI(arr[1]));
      return decodeURI(arr[1]);
    }
  }
}

// 设置cookie
export function setCookie(key, value) {
  let date = new Date();
  let clearTime = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
  date.setTime(clearTime);
  document.cookie = key + '=' + encodeURI(value) + ';expires=' + date.toGMTString() + ';path=' + portUrl.indexUrl;
}

// 删除cookie某值
export function removeCookie(key, value) {
  setCookie(key, '', -1);
}

// 获取url地址的search参数的某值
export function getQueryString(search, name) { 
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  let r = search.substr(1).match(reg);
  if (r) {
    return unescape(r[2]);
  } else {
    return null;
  }
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(routePath =>
    routePath.indexOf(path) === 0 && routePath !== path);
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering

  /**
   * 目前因为需求改了这个变动不再对路由进行去重
  */
  // const renderArr = getRenderArr(routes);
  const renderArr = routes;

  // Conversion and stitching parameters
  const renderRoutes = renderArr.map((item) => {
    /**
     * 这里也是，任何路由都不加载其他路由信息
    */
    // const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    const exact = true;
    return {
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
      exact,
    };
  });

  return renderRoutes;
}



// 对菜单数据进行转化提取
export function formatterMenu(data, parentPath = '', parentAuthority) {
  return data.map((item) => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatterMenu(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}


/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;

export function isUrl(path) {
  return reg.test(path);
}

let key = '8c72a371-2cb3-4289-9d6c-a5ccfa48e51a';

//DES  CBC模式加密(ecb模式加密不需要偏移量iv)
export function encryptByDES(message) {
  //把私钥转换成16进制的字符串
  let keyHex = CryptoJS.enc.Utf8.parse(key);

  //模式为CBC padding为Pkcs7
  let encrypted = CryptoJS.DES.encrypt(message, keyHex, {
      iv: keyHex,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
  });

  //加密出来是一个16进制的字符串
  return encrypted.ciphertext.toString();
}

//DES  CBC模式解密(ecb模式解密不需要偏移量iv)
export function decryptByDESModeEBC(ciphertext) {
  //把私钥转换成16进制的字符串
  let keyHex = CryptoJS.enc.Utf8.parse(key);

  //把需要解密的数据从16进制字符串转换成字符byte数组
  let decrypted = CryptoJS.DES.decrypt({
      ciphertext: CryptoJS.enc.Hex.parse(ciphertext)
  }, keyHex, {
      iv: keyHex,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
  });

  //以utf-8的形式输出解密过后内容
  let result_value = decrypted.toString(CryptoJS.enc.Utf8);
  return result_value;
}
