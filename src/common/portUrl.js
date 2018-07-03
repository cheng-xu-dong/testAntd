import order from '../assets/png/点餐.png';
import selfTaken from '../assets/png/自取预定.png';
import cupboard from '../assets/png/取餐柜预定.png';
import staffOrder from '../assets/png/staffOrder.png';

import noOrder from '../assets/png/noTakeAway.png';
import noSelfTaken from '../assets/png/noTakeAway.png';
import noCupboard from '../assets/png/noTakeAway.png';
import noStaffOrder from '../assets/png/noStaffOrder.png';

export default {
	indexUrl: '/sovell-lachesis-static-microrestaurant/wap',
	urlRoot: window.location.origin,
	urlPort: '/sovell-lachesis-api-client/',
	
	// 授权地址
	passUrl: window.location.origin + '/sovell-lachesis-api-client/pass/auth/index',

	serviceTypeArr: [{
    id: 1,
    key: 'home',
    pic: order,
    noPic: noOrder,
    size: {
      width: (window.innerWidth * 100 / 750) * 1,
      height: (window.innerWidth * 100 / 750) * 1,
    },
  }, {
    id: 8,
    key: 'orderDinner',
    pic: selfTaken,
    noPic: noSelfTaken,
    size: {
      width: (window.innerWidth * 100 / 750) * 1,
      height: (window.innerWidth * 100 / 750) * 1,
    },
  }, {
    id: 4,
    key: 'mine',
    pic: cupboard,
    noPic: noCupboard,
    size: {
      width: (window.innerWidth * 100 / 750) * 1,
      height: (window.innerWidth * 100 / 750) * 1,
    },
  }, {
    id: 2,
    key: 'orderDinner',
    pic: staffOrder,
    noPic: noStaffOrder,
    size: {
      width: (window.innerWidth * 100 / 750) * 1,
      height: (window.innerWidth * 100 / 750) * 1,
    },
  }],

  orderType: [{
    orderID: 2,
    orderType: [{
      name: 'oi_type',
      value: '1000',
      font: '待支付',
      noColor: false,
      text: '3分钟之内未支付，将自动取消订单',
    }, {
      name: 'oi_type',
      value: '1300',
      font: '已取消',
      noColor: true,
      text: '订单已取消',
    }, {
      name: 'oi_type',
      value: '1050',
      timeObj: [{
        key: 'reserveTimeBefore',
        value: '支付成功',
        text: '预定截止前可取消订单，将自动退款',
        noColor: false,
      }, {
        key: 'reserveTimeAfter',
        value: '支付成功',
        text: '如有疑问，请联系商家',
        noColor: false,
      }],
    }, {
      name: 'oi_type',
      value: '1250',
      font: '已送达',
      noColor: true,
      text: '期待下次光临',
    }]
  }, {
    orderID: 8,
    orderType: [{
      name: 'oi_type',
      value: '1000',
      font: '待支付',
      noColor: false,
      text: '3分钟之内未支付，将自动取消订单',
    }, {
      name: 'oi_type',
      value: '1300',
      font: '已取消',
      noColor: true,
      text: '订单已取消',
    }, {
      name: 'oi_type',
      value: '1050',
      timeObj: [{
        key: 'reserveTimeBefore',
        value: '支付成功',
        text: '预定截止前可取消订单，将自动退款',
        noColor: false,
      }, {
        key: 'takeTime',
        value: '待取餐',
        text: '请在取餐时间范围内取餐',
        noColor: false,
      }, {
        key: 'takeOvertime',
        value: '逾期未取',
        text: '已过取餐时间',
        noColor: true,
      }],
    }, {
      name: 'oi_type',
      value: '1250',
      font: '已取餐',
      noColor: true,
      text: '期待下次光临',
    }]
  }],

  refundType: [{
    key: '1',
    value: '申请退款',
  }, {
    key: '2',
    value: '同意申请',
  }, {
    key: '3',
    value: '驳回申请',
  }, {
    key: '4',
    value: '退款中',
  }, {
    key: '5',
    value: '退款成功',
  }],
}