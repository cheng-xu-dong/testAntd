import { getCookie, setCookie, removeCookie, getQueryString } from '../utils/utils';
import { getUserInfo, getQrCode } from '../services/api';
import portUrl from '../common/portUrl.js';
import { Toast } from 'antd-mobile';

export default {

  namespace: 'global',

  state: {
    userInfo: '',
  },

  subscriptions: {
    // setup({ dispatch, history }) {
    //   return history.listen(({ pathname, search }) => {
    //     if (pathname.indexOf('clearCookie') === -1) {
    //       let access_token = getCookie('access_token');
    //       let codeURL;
    //       // let codeURL = getCookie('codeURL');
    //       let saveAccess_token;
    //       if (!access_token) {

    //         // 从url地址中获取userInfo的值
    //         if (search) {
    //           saveAccess_token = getQueryString(search, 'access_token');
    //         }

    //         // 若url地址中没有userInfo的值则重新跳转地址，重新走一遍逻辑
    //         if (!saveAccess_token) {
    //           let uri = portUrl.passUrl;
    //           codeURL = portUrl.urlRoot + portUrl.indexUrl;

    //           // setCookie('codeURL', codeURL);

    //           let linkURL = uri + '?redirect_url=' + codeURL;

    //           window.location.replace(linkURL);
    //         } else {
    //           access_token = decodeURIComponent(saveAccess_token);

    //           setCookie('access_token', access_token)
    //         }
    //       }
    //     };
    //   });
    // },
  },

  effects: {
    *getUserInfo({ payload }, { call, put }) {
      const response = yield call(getUserInfo);

      if (response) {
        if (parseInt(response.code) === 200) {
          yield put({
            type: 'saveUserInfo',
            payload: response.result,
          });
        }
      }
    },
    *getQrCode({ payload }, { call, put }) {
      const response = yield call(getQrCode);

      if (parseInt(response.code) === 200 && response.result) {
        payload.setState({
          qrcode: response.result.auth_code,
          refreshFlag: true,
        }, () => {
          setTimeout(() => {
            payload.setState({
              refreshFlag: false,
            })
          }, 2000)
          payload.countDownTime(120);
        })
      }
    },
  },

  reducers: {
    saveUserInfo(state, { payload }) {
      return {
        ...state,
        userInfo: payload,
      };
    },
  },

};
