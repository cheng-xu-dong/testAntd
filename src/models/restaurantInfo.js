import { getCookie, setCookie, getQueryString } from '../utils/utils';
import { getShopInfo, getShopBusinessList } from '../services/restaurantInfo';
import { getShopBusiness } from '../services/orderDinner';
import portUrl from '../common/portUrl.js';
import { Toast } from 'antd-mobile';

export default {

  namespace: 'restaurantInfo',

  state: {
    shopInfo: '',
    shopBusinessList: '',
  },

  subscriptions: {
    
  },

  effects: {
    *getShopInfo({ payload }, { put, call }) {
      let params = {
        mhi_id: payload.mhi_id
      }

      const response = yield call(getShopInfo, params);

      if (parseInt(response.code) === 200) {
        yield put({
          type: 'saveShopInfo',
          payload: response.result,
        });

        let mhb_params = {
          mhb_mhi_id: payload.mhi_id
        }

        const mhb_response = yield call(getShopBusinessList, mhb_params);

        let shopBusinessList = mhb_response.result;

        if (shopBusinessList.items && shopBusinessList.items.length > 0) {
          shopBusinessList.items.map((array, index) => {
            payload.That.checkBussiness(array, shopBusinessList);
          })
        }
      }
    },
    *checkBussiness({ payload }, { put, call }) {
      let params = {
        mhb_id: payload.mhb_id
      }
      const response = yield call(getShopBusiness, params);

      if (parseInt(response.code) === 200) {
        if (response.result.items && response.result.items.length > 0) {
          payload.obj['haveMeal'] = true;
        } else {
          payload.obj['haveMeal'] = false;
        }
      }

      yield put({
        type: 'saveShopBusinessList',
        payload: payload.shopBusinessList,
      });

      payload.That.hideLoading();
    },
    *clearStorage({ payload }, { put, call }) {
      yield put({
        type: 'saveClearStorage',
      });
    },
  },

  reducers: {
    saveShopInfo(state, { payload }) {
      return {
        ...state,
        shopInfo: payload,
      };
    },
    saveShopBusinessList(state, { payload }) {
      return {
        ...state,
        shopBusinessList: payload,
      };
    },
    saveClearStorage(state, { payload }) {
      return {
        ...state,
        shopInfo: '',
        shopBusinessList: '',
      };
    },
  },

};
