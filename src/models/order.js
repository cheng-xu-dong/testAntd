import { getCookie, setCookie, getQueryString } from '../utils/utils';
import { getOrderList } from '../services/order';
import portUrl from '../common/portUrl.js';
import { Toast } from 'antd-mobile';

export default {

  namespace: 'order',

  state: {
    orderList: '',
    orderListTotal: '',
  },

  subscriptions: {
    
  },

  effects: {
    *getOrderList({ payload }, { put, call, select }) {
      let params = {
        ci_id: payload.ci_id,
        rows: payload.rows,
        page: payload.page,
      }
      const response = yield call(getOrderList, params);

      if (parseInt(response.code) === 200) {
        payload.That.setState({
          getMoreDate: false,
        }, () => {
          payload.That.hideLoading();
        })

        const orderListTotal = response.result.total;
        let orderList;

        if (payload.onceGet === true) {
          orderList = response.result.rows;
        } else {
          orderList = yield select(state => state.order.orderList);

          response.result.rows.map((array, index) => {
            orderList.push(array);
          })
        }

        yield put({
          type: 'saveOrderList',
          payload: {
            orderList,
            orderListTotal,
          },
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
    saveOrderList(state, { payload }) {
      return {
        ...state,
        orderList: payload.orderList,
        orderListTotal: payload.orderListTotal,
      };
    },
    saveClearStorage(state, { payload }) {
      return {
        ...state,
        orderList: '',
        orderListTotal: '',
      };
    },
  },

};
