import { getCookie, setCookie, getQueryString } from '../utils/utils';
import { checkPayOk, getOrderInfo } from '../services/payResult';
import portUrl from '../common/portUrl.js';
import { Toast } from 'antd-mobile';

export default {

  namespace: 'payResult',

  state: {
    orderInfo: '',
  },

  subscriptions: {
    
  },

  effects: {
    *checkPayOk({ payload }, { put, call }) {
      const response = yield call(checkPayOk, payload.params);

      if (parseInt(response.code) === 200) {
        payload.That.setState({
          payWait: false,
          payOk: true,
        })
      } else {
        payload.That.setState({
          payCount: payload.That.state.payCount + 1,
        }, () => {
          if (payload.That.state.payCount > 10) {
            payload.That.setState({
              payWait: false,
              payOk: false,
            })
          } else {
            payload.That.checkPayOk();
          }
        })
      }
    },
    *getOrderInfo({ payload }, { put, call }) {
      const response = yield call(getOrderInfo, payload);

      if (parseInt(response.code) === 200) {
        yield put({
          type: 'saveOrderInfo',
          payload: response.result,
        });
        Toast.hide();
      }
    },
  },

  reducers: {
    saveOrderInfo(state, { payload }) {
      return {
        ...state,
        orderInfo: payload,
      };
    },
  },

};
