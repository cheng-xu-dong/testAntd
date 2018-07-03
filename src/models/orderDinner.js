import { getCookie, setCookie, getQueryString } from '../utils/utils';
import { getShopBusiness, getShopBusinessIntroduce, getShopCategory, getShopMeal } from '../services/orderDinner';
import portUrl from '../common/portUrl.js';
import { Toast } from 'antd-mobile';
import { getNearDateWeek } from '../utils/utils';

export default {

  namespace: 'orderDinner',

  state: {
    shopBusiness: '',
    shopBusinessIntroduce: '',
  },

  subscriptions: {
    
  },

  effects: {
    *getShopBusiness({ payload }, { put, call }) {
      const response = yield call(getShopBusiness, payload);

      if (parseInt(response.code) === 200) {
        Toast.hide();

        yield put({
          type: 'saveShopBusiness',
          payload: response.result,
        });
        const responseIntroduce = yield call(getShopBusinessIntroduce, payload);

        if (parseInt(responseIntroduce.code) === 200) {
          yield put({
            type: 'saveShopBusinessIntroduce',
            payload: responseIntroduce.result,
          });
        }
      }
    },
    *getShopCategory({ payload }, { put, call }) {
      let params = {
        cdp_mhb_id: payload.cdp_mhb_id,
        cdp_mhi_id: payload.cdp_mhi_id,
        cdp_mhm_id: payload.cdp_mhm_id,
        cdp_week: payload.cdp_week,
        cdi_status: 1,
      }
      const response = yield call(getShopCategory, params);
      
      if (parseInt(response.code) === 200) {
        const mealResponse = yield call(getShopMeal, params);

        if (parseInt(mealResponse.code) === 200) {
          payload.That.getCategoryMeal(response.result, mealResponse.result, payload.editeFoodCount);
        }

        // payload.That.iScrollEvent();
      }
    }
  },

  reducers: {
    saveShopBusiness(state, { payload }) {
      return {
        ...state,
        shopBusiness: payload,
      };
    },
    saveShopBusinessIntroduce(state, { payload }) {
      return {
        ...state,
        shopBusinessIntroduce: payload,
      };
    },
  },

};
