import { getCookie, setCookie, getQueryString } from '../utils/utils';
import { getShopList } from '../services/home';
import portUrl from '../common/portUrl.js';
import { Toast } from 'antd-mobile';

export default {

  namespace: 'home',

  state: {
    shopList: {},
  },

  subscriptions: {
    
  },

  effects: {
    *getShopList({ payload }, { put, call }) {
      let params = {
        eti_number: payload.eti_number,
        mhi_status: 1,
      }

      const response = yield call(getShopList, params);

      if (parseInt(response.code) === 200) {
        yield put({
          type: 'saveShopList',
          payload: response.result,
        });
        payload.That.hideLoading();
      } else if (parseInt(response.code) === 400) {
        Toast.fail('无法查找企业信息', 1);
      }
    },
    *clearStorage({ payload }, { put, call }) {
      yield put({
        type: 'saveClearStorage',
      });
    },
  },

  reducers: {
    saveShopList(state, { payload }) {
      return {
        ...state,
        shopList: payload,
      };
    },
    saveClearStorage(state, { payload }) {
      return {
        ...state,
        shopList: {},
      };
    },
  },

};
