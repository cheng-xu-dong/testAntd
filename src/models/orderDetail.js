import { getCookie, setCookie, getQueryString } from '../utils/utils';
import { getOrderInfo, getShopInfo, getOrderDetail, getCustomerInfo, getMealInfo, getOrderStreamType, getOrderStreamList, getRefundInfo } from '../services/orderDetail';
import portUrl from '../common/portUrl.js';
import { Toast } from 'antd-mobile';

export default {

  namespace: 'orderDetail',

  state: {
    orderInfo: '',
    shopInfo: '',
    orderDetail: '',
    customerInfo: '',
    mealInfo: '',
    orderStreamType: '',
    orderStreamList: '',
    refundInfo: '',
  },

  subscriptions: {
    
  },

  effects: {
    *getOrderInfo({ payload }, { put, call }) {
      const response = yield call(getOrderInfo, payload.params);

      if (parseInt(response.code) === 200) {
        yield put({
          type: 'saveOrderInfo',
          payload: response.result,
        });

        if (response.result && parseInt(response.result.oi_mhb_bii_id) === 8) {
          payload.That.getOrderStreamList();
        }

        Toast.hide();
      }
    },
    *getShopInfo({ payload }, { put, call }) {
      const response = yield call(getShopInfo, payload.params);

      if (parseInt(response.code) === 200) {
        yield put({
          type: 'saveShopInfo',
          payload: response.result,
        });
      }
    },
    *getOrderDetail({ payload }, { put, call }) {
      const response = yield call(getOrderDetail, payload.params);

      if (parseInt(response.code) === 200) {
        yield put({
          type: 'saveOrderDetail',
          payload: response.result,
        });
      }
    },
    *getCustomerInfo({ payload }, { put, call }) {
      const response = yield call(getCustomerInfo, payload.params);

      if (parseInt(response.code) === 200) {
        yield put({
          type: 'saveCustomerInfo',
          payload: response.result,
        });
      }
    },
    *getMealInfo({ payload }, { put, call }) {
      const response = yield call(getMealInfo, payload.params);

      if (parseInt(response.code) === 200) {
        yield put({
          type: 'saveMealInfo',
          payload: response.result,
        });
      }
    },
    *getOrderStreamType({ payload }, { put, call }) {
      const response = yield call(getOrderStreamType, payload.params);

      if (parseInt(response.code) === 200) {
        yield put({
          type: 'saveOrderStreamType',
          payload: response.result,
        });
      }
    },
    *getOrderStreamList({ payload }, { put, call }) {
      const response = yield call(getOrderStreamList, payload.params);

      if (parseInt(response.code) === 200) {
        yield put({
          type: 'saveOrderStreamList',
          payload: response.result,
        });
      }
    },
    *getRefundInfo({ payload }, { put, call }) {
      const response = yield call(getRefundInfo, payload);

      if (parseInt(response.code) === 200) {
        yield put({
          type: 'saveRefundInfo',
          payload: response.result,
        });
      }
    },
    *clearStorage({ payload }, { put, call }) {
      yield put({
        type: 'saveClearStorage',
      });
    },
  },

  reducers: {
    saveOrderInfo(state, { payload }) {
      return {
        ...state,
        orderInfo: payload,
      };
    },
    saveShopInfo(state, { payload }) {
      return {
        ...state,
        shopInfo: payload,
      };
    },
    saveOrderDetail(state, { payload }) {
      return {
        ...state,
        orderDetail: payload,
      };
    },
    saveCustomerInfo(state, { payload }) {
      return {
        ...state,
        customerInfo: payload,
      };
    },
    saveMealInfo(state, { payload }) {
      return {
        ...state,
        mealInfo: payload,
      };
    },
    saveOrderStreamType(state, { payload }) {
      return {
        ...state,
        orderStreamType: payload,
      };
    },
    saveOrderStreamList(state, { payload }) {
      return {
        ...state,
        orderStreamList: payload,
      };
    },
    saveRefundInfo(state, { payload }) {
      return {
        ...state,
        refundInfo: payload,
      };
    },
    saveClearStorage(state, { payload }) {
      return {
        ...state,
        orderInfo: '',
        shopInfo: '',
        orderDetail: '',
        customerInfo: '',
        mealInfo: '',
        orderStreamType: '',
        refundInfo: '',
      };
    },
  },
};
