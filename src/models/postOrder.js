import { getCookie, setCookie, getQueryString } from '../utils/utils';
import { getShopInfo } from '../services/restaurantInfo';
import { getUserAddress, addAddress, postOrder, payOrder, cancelOrder, sureTakeMeal } from '../services/postOrder';
import portUrl from '../common/portUrl.js';
import { Toast } from 'antd-mobile';

export default {

  namespace: 'postOrder',

  state: {
    shopInfo: '',
    defaultAddress: '',
  },

  subscriptions: {
    
  },

  effects: {
    *getShopInfo({ payload }, { put, call }) {
      let params = {
        mhi_id: payload.mhi_id,
      }
      const response = yield call(getShopInfo, params);

      if (parseInt(response.code) === 200) {
        yield put({
          type: 'saveShopInfo',
          payload: response.result,
        });

        if (parseInt(payload.mhb_bii_id) === 2) {
          let addressParams = {
            cta_ci_id: payload.cta_ci_id,
            cta_mhi_id: response.result.mhi_id,
          }
          const addressResponse = yield call(getUserAddress, addressParams);

          if (parseInt(addressResponse.code) === 200) {
            if (addressResponse.result) {
              yield put({
                type: 'saveDefaultAddress',
                payload: addressResponse.result,
              });
            }
            payload.That.hideLoading();
          }
        } else {
          payload.That.hideLoading();
        }
      }
    },
    *addAddress({ payload }, { put, call }) {
      Toast.loading('等待中...', 10);
      const response = yield call(addAddress, payload.params);

      if (parseInt(response.code) === 200) {
        Toast.hide();
        payload.That.linkPostOrder();
      }
    },
    *postOrder({ payload }, { put, call }) {
      Toast.loading('提交订单中...', 20);
      const response = yield call(postOrder, payload.params);

      if (parseInt(response.code) === 200) {
        payload.That.payOrder(response.result.oi_id);
      } else if (parseInt(response.code) === 1001) {
        Toast.hide();
        payload.That.stockLackShowModal(response.result);
      } else if (parseInt(response.code) === 1002) {
        Toast.hide();
        Toast.fail(response.message, 1);
      }
    },
    *payOrder({ payload }, { put, call }) {
      const response = yield call(payOrder, payload.params);

      if (parseInt(response.code) === 200) {
        Toast.hide();
        window.location.replace(response.result.notify_uri);
      }
    },
    *cancelOrder({ payload }, { put, call }) {
      const response = yield call(cancelOrder, payload.params);

      if (parseInt(response.code) === 200) {
        payload.That.cancelOrderLink();
      }
    },
    *sureTakeMeal({ payload }, { put, call }) {
      const response = yield call(sureTakeMeal, payload.params);

      if (parseInt(response.code) === 200) {
        Toast.hide();
        payload.That.getOrderDetailInfo();
      }
    },
  },

  reducers: {
    saveShopInfo(state, { payload }) {
      return {
        ...state,
        shopInfo: payload,
      };
    },
    saveDefaultAddress(state, { payload }) {
      return {
        ...state,
        defaultAddress: payload,
      };
    },
  },

};
