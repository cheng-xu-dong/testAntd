import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { Button, Toast, Modal } from 'antd-mobile';
import styles from './index.less';
import classNames from 'classnames';
import headerPic from '../../assets/header.png';
import bg from '../../assets/png/bg2.png';
import food from '../../assets/菜.png';
import callShop from '../../assets/svg/联系商家.svg';
import portUrl from '../../common/portUrl.js';
import { getCookie, getNearDate, getOrderType } from '../../utils/utils';

const alert = Modal.alert;

@connect(({ global, orderDetail }) => ({
  global,
  orderDetail,
}))
export default class OrderDetail extends Component {
  state = {
    oi_id: '',
  }

  popstateLink = () => {
    window.location.replace(portUrl.urlRoot + portUrl.indexUrl + '/order');
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.popstateLink, false);

    const { dispatch } = this.props;

    dispatch({
      type: 'orderDetail/clearStorage',
    });
  }

  componentDidMount() {
    getCookie('microrestaurant_eti_number');

    window.addEventListener('popstate', this.popstateLink, false);

    if (this.props.location.state && this.props.location.state.oi_id) {
      this.setState({
        oi_id: this.props.location.state.oi_id,
      }, () => {
        Toast.loading('等待中...', 10);
        this.getOrderDetailInfo();
      })
    } else {
      this.props.dispatch(routerRedux.push(portUrl.indexUrl + '/home'));
    }
  }

  getOrderDetailInfo = () => {
    this.getOrderInfo();
    this.getShopInfo();
    this.getOrderDetail();
    this.getCustomerInfo();
    this.getMealInfo();
    // this.getOrderStreamType();
    this.getRefundInfo();
  }

  // 订单信息
  getOrderInfo = () => {
    const { oi_id } = this.state;
    const { dispatch } = this.props;
    const That = this;

    let params = {
      oi_id: oi_id,
    }

    dispatch({
      type: 'orderDetail/getOrderInfo',
      payload: {
        params,
        That,
      }
    });
  }

  // 订单商户信息
  getShopInfo = () => {
    const { oi_id } = this.state;
    const { dispatch } = this.props;

    const That = this;

    let params = {
      oi_id: oi_id,
    }

    dispatch({
      type: 'orderDetail/getShopInfo',
      payload: {
        params,
        That,
      }
    });
  }

  // 订单明细
  getOrderDetail = () => {
    const { oi_id } = this.state;
    const { dispatch } = this.props;

    const That = this;

    let params = {
      oi_id: oi_id,
    }

    dispatch({
      type: 'orderDetail/getOrderDetail',
      payload: {
        params,
        That,
      }
    });
  }

  // 订单客户信息
  getCustomerInfo = () => {
    const { oi_id } = this.state;
    const { dispatch } = this.props;

    const That = this;

    let params = {
      oi_id: oi_id,
    }

    dispatch({
      type: 'orderDetail/getCustomerInfo',
      payload: {
        params,
        That,
      }
    });
  }

  // 订单餐别信息
  getMealInfo = () => {
    const { oi_id } = this.state;
    const { dispatch } = this.props;

    const That = this;

    let params = {
      oi_id: oi_id,
    }

    dispatch({
      type: 'orderDetail/getMealInfo',
      payload: {
        params,
        That,
      }
    });
  }

  // 订单流状态
  getOrderStreamType = () => {
    const { oi_id } = this.state;
    const { dispatch } = this.props;
    const That = this;

    let params = {
      oi_id: oi_id,
    }

    dispatch({
      type: 'orderDetail/getOrderStreamType',
      payload: {
        params,
        That,
      }
    });
  }

  // 订单流日志
  getOrderStreamList = () => {
    const { oi_id } = this.state;
    const { dispatch } = this.props;
    const That = this;

    let params = {
      oi_id: oi_id,
    }

    dispatch({
      type: 'orderDetail/getOrderStreamList',
      payload: {
        params,
        That,
      }
    });
  }

  // 订单退款列表
  getRefundInfo = () => {
    const { oi_id } = this.state;
    const { dispatch } = this.props;

    let params = {
      or_oi_id: oi_id,
    }

    dispatch({
      type: 'orderDetail/getRefundInfo',
      payload: params
    });
  }


  // 获取配送费
  getPostPrice = (date) => {
    let postPrice;

    date.map((array, index) => {
      if (parseInt(array.od_type) === 2) {
        postPrice = parseFloat(array.od_real_price);
      }
    })

    return postPrice ? postPrice.toFixed(2) : postPrice;
  }

  // 计算商品总价格
  getTotalPrice = (date) => {
    let totalPrice = parseFloat(0.00);

    date.map((array, index) => {
      totalPrice += (parseInt(array.od_count) * parseFloat(array.od_real_price));
    })

    return totalPrice.toFixed(2);
  }

  // 计算商品的总数量
  goodTotalCount = (date) => {
    let totalCount = parseInt(0);

    date.map((array, index) => {
      if (parseInt(array.od_type) !== 2) {
        totalCount += parseInt(array.od_count);
      }
    })

    return totalCount;
  }

  // 获取下单时间
  getOrderTime = (obj) => {
    let returnTime;

    obj.map((array, index) => {
      if (array.osl_source === 'oi_type' && parseInt(array.osl_value) === 1000) {
        returnTime = array.osl_date;
      }
    })

    return returnTime;
  }

  // 获取支付方式
  getPayType = (obj) => {
    let returnString;

    if (obj.oi_pay_type === 'wechat') {
      returnString = '微信支付';
    } else if (obj.oi_pay_type === 'alipay') {
      returnString = '支付宝支付';
    } else if (obj.oi_pay_type === 'idish') {
      returnString = '卡支付';
    }

    return returnString;
  }

  // 重新支付
  payOrderAgain = (oiId) => {
    Toast.loading('支付中...', 10);
    const { dispatch } = this.props;

    let params = {
      oi_id: oiId,
      redirect_url: portUrl.urlRoot + portUrl.indexUrl + '/payResult',
    }

    const That = this;

    dispatch({
      type: 'postOrder/payOrder',
      payload: {
        params,
        That,
      }
    });
  }

  // 取消订单
  cancelOrder = (oiId, obj) => {
    Toast.loading('订单取消中...', 10);
    const { dispatch } = this.props;

    let params = {
      oi_id: oiId,
      ci_id: obj.ci_id,
    }

    const That = this;

    dispatch({
      type: 'postOrder/cancelOrder',
      payload: {
        params,
        That,
      }
    });
  }

  // 确认取餐
  sureTakeMeal = (oiId, obj) => {
    Toast.loading('确认取餐中...', 10);
    const { dispatch } = this.props;

    let params = {
      oi_id: oiId,
      ci_id: obj.ci_id,
    }

    const That = this;

    dispatch({
      type: 'postOrder/sureTakeMeal',
      payload: {
        params,
        That,
      }
    });
  }

  // 取消订单后跳转到订单列表页
  cancelOrderLink = () => {
    this.props.dispatch(routerRedux.push(portUrl.indexUrl + '/order'));
  }

  render() {
    const { oi_id } = this.state;

    const {
      orderInfo,
      shopInfo,
      orderDetail,
      customerInfo,
      mealInfo,
      orderStreamType,
      orderStreamList,
      refundInfo,
    } = this.props.orderDetail;

    const { userInfo } = this.props.global;

    const tipStyle = {
      backgroundImage: `url(${bg})`
    }

    return (
      <DocumentTitle title="订单详情">
        <div className={styles.orderDetail}>
          {
            orderInfo && mealInfo ? (
              <div style={ tipStyle } className={classNames({
                                                  [styles.tip]: getOrderType(orderInfo.oi_mhb_bii_id, orderInfo.oi_type, mealInfo).font !== '待支付' && getOrderType(orderInfo.oi_mhb_bii_id, orderInfo.oi_type, mealInfo).font !== '支付成功'
                                                }, {
                                                  [styles.buttonTip]: getOrderType(orderInfo.oi_mhb_bii_id, orderInfo.oi_type, mealInfo).font === '待支付' || getOrderType(orderInfo.oi_mhb_bii_id, orderInfo.oi_type, mealInfo).font === '支付成功'
                                                }, {
                                                  [styles.tipSelfMeal]: getOrderType(orderInfo.oi_mhb_bii_id, orderInfo.oi_type, mealInfo).font !== '待支付' && getOrderType(orderInfo.oi_mhb_bii_id, orderInfo.oi_type, mealInfo).font !== '支付成功' && orderInfo && parseInt(orderInfo.oi_mhb_bii_id) === 8
                                                }, {
                                                  [styles.buttonTipSelfMeal]: (getOrderType(orderInfo.oi_mhb_bii_id, orderInfo.oi_type, mealInfo).font === '待支付' || getOrderType(orderInfo.oi_mhb_bii_id, orderInfo.oi_type, mealInfo).font === '支付成功') && orderInfo && parseInt(orderInfo.oi_mhb_bii_id) === 8
                                                }, {
                                                  [styles.noButtonTipSelfMeal]: getOrderType(orderInfo.oi_mhb_bii_id, orderInfo.oi_type, mealInfo).font === '支付成功' && orderInfo && mealInfo && parseInt(orderInfo.oi_mhb_bii_id) === 8 && getOrderType(orderInfo.oi_mhb_bii_id, orderInfo.oi_type, mealInfo).paySuccessType === 'reserveTimeAfter'
                                                })}>
                {
                  parseInt(orderInfo.oi_mhb_bii_id) === 8 ? (
                    getOrderType(orderInfo.oi_mhb_bii_id, orderInfo.oi_type, mealInfo).font === '待取餐' || getOrderType(orderInfo.oi_mhb_bii_id, orderInfo.oi_type, mealInfo).font === '支付成功' ? (
                      <p className={styles.titleTip}>请在取餐时间内取餐，逾期视为放弃领取</p>
                    ) : ''
                  ) : ''
                }
                <div className={styles.tipContent}>
                  <p>{getOrderType(orderInfo.oi_mhb_bii_id, orderInfo.oi_type, mealInfo).font}</p>
                  {
                    getOrderType(orderInfo.oi_mhb_bii_id, orderInfo.oi_type, mealInfo).font === '待支付' ? (
                      <div className={styles.buttonDiv}>
                        <p>{getOrderType(orderInfo.oi_mhb_bii_id, orderInfo.oi_type, mealInfo).text}</p>
                        {
                            parseInt(orderInfo.oi_mhb_bii_id) === 8 ? (
                              <span className={classNames({
                                [styles.noColor]: getOrderType(orderInfo.oi_mhb_bii_id, orderInfo.oi_type, mealInfo).noColor
                              })}>取餐时间&nbsp;&nbsp;{getNearDate(mealInfo.bespeak_date)}&nbsp;{mealInfo.takemeal_start_time}~{mealInfo.takemeal_end_time}</span>
                            ) : ''
                        }
                        <div className={styles.button}>
                          <button onClick={() =>
                                    alert('确定要取消订单吗？', '', [
                                      { text: '取消', onPress: () => console.log('cancel') },
                                      { text: '确认', onPress: () => this.cancelOrder(oi_id, userInfo) },
                                    ])}>取消订单</button>
                          <button onClick={() => {this.payOrderAgain(oi_id)}}>立即支付</button>
                        </div>
                      </div>
                    ) : (
                      getOrderType(orderInfo.oi_mhb_bii_id, orderInfo.oi_type, mealInfo).font === '支付成功' ? (
                        getOrderType(orderInfo.oi_mhb_bii_id, orderInfo.oi_type, mealInfo).paySuccessType === 'reserveTimeAfter' ? (
                            <div className={classNames({
                              [styles.buttonDiv]: parseInt(orderInfo.oi_mhb_bii_id) === 2
                            }, {
                              [styles.noButtonDiv]: parseInt(orderInfo.oi_mhb_bii_id) === 8
                            })}>
                            <p>{getOrderType(orderInfo.oi_mhb_bii_id, orderInfo.oi_type, mealInfo).text}</p>
                            {
                              parseInt(orderInfo.oi_mhb_bii_id) === 8 ? (
                                <span className={classNames({
                                  [styles.noColor]: getOrderType(orderInfo.oi_mhb_bii_id, orderInfo.oi_type, mealInfo).noColor
                                })}>取餐时间&nbsp;&nbsp;{getNearDate(mealInfo.bespeak_date)}&nbsp;{mealInfo.takemeal_start_time}~{mealInfo.takemeal_end_time}</span>
                              ) : (
                                <div className={styles.button}>
                                  <button onClick={() =>
                                    alert('确定要确认取餐吗？', '', [
                                      { text: '取消', onPress: () => console.log('cancel') },
                                      { text: '确认', onPress: () => this.sureTakeMeal(oi_id, userInfo) },
                                    ])}>确认取餐</button>
                                </div>
                              )
                            }
                          </div>
                        ) : (
                          <div className={styles.buttonDiv}>
                            <p>{getOrderType(orderInfo.oi_mhb_bii_id, orderInfo.oi_type, mealInfo).refundTime + ' ' + getOrderType(orderInfo.oi_mhb_bii_id, orderInfo.oi_type, mealInfo).text}</p>
                            {
                              parseInt(orderInfo.oi_mhb_bii_id) === 8 ? (
                                <span className={classNames({
                                  [styles.noColor]: getOrderType(orderInfo.oi_mhb_bii_id, orderInfo.oi_type, mealInfo).noColor
                                })}>取餐时间&nbsp;&nbsp;{getNearDate(mealInfo.bespeak_date)}&nbsp;{mealInfo.takemeal_start_time}~{mealInfo.takemeal_end_time}</span>
                              ) : ''
                            }
                            <div className={styles.button}>
                              <button onClick={() =>
                                        alert('确定要取消订单吗？', '', [
                                          { text: '取消', onPress: () => console.log('cancel') },
                                          { text: '确认', onPress: () => this.cancelOrder(oi_id, userInfo) },
                                        ])}>取消订单</button>
                            </div>
                          </div>
                        )
                      ) : (
                        <div className={styles.noButtonDiv}>
                          <p className={classNames({
                            [styles.noTakeTime]: parseInt(orderInfo.oi_mhb_bii_id) === 2
                          })}>{getOrderType(orderInfo.oi_mhb_bii_id, orderInfo.oi_type, mealInfo).text}</p>
                          {
                            parseInt(orderInfo.oi_mhb_bii_id) === 8 ? (
                              <span className={classNames({
                                [styles.noColor]: getOrderType(orderInfo.oi_mhb_bii_id, orderInfo.oi_type, mealInfo).noColor
                              })}>取餐时间&nbsp;&nbsp;{getNearDate(mealInfo.bespeak_date)}&nbsp;{mealInfo.takemeal_start_time}~{mealInfo.takemeal_end_time}</span>
                            ) : ''
                          }
                        </div>
                      )
                    )
                  }
                </div>
              </div>
            ) : ''
          }


          {
            orderDetail && shopInfo ? (
              <div className={styles.mealInfo}>
                <div className={styles.title}>
                  <div className={styles.titleLeft}>
                    <img src={shopInfo.mhi_header_img ? JSON.parse(shopInfo.mhi_header_img).picture_small_network_url : headerPic} />
                    <span>{shopInfo.mhi_name}</span>
                  </div>
                  <div className={styles.titleRight}>
                    <img src={callShop} />
                    <a href={'tel:' + shopInfo.mhi_phone}>联系商家</a>
                  </div>
                </div>

                <div className={styles.foodInfo}>
                  {
                    orderDetail.items.map((array, index) => {
                      if (parseInt(array.od_type) !== 2) {
                        return (
                          <div key={index} className={styles.foodInfoMain}>
                            <img src={array.cdi_info.cdi_header_img ? JSON.parse(array.cdi_info.cdi_header_img).picture_small_network_url : food} />
                            <div className={styles.text}>
                              <p>{array.od_name}</p>
                              <p>
                                <span>×{array.od_count}</span>
                                <span>¥{(parseFloat(array.od_real_price) * parseFloat(array.od_count)).toFixed(2)}</span>
                              </p>
                            </div>
                          </div>
                        )
                      }
                    })
                  }
                  {
                    this.getPostPrice(orderDetail.items) ? (
                      <div className={styles.foodInfoPostPrice}>
                        <span>配送费</span>
                        <span>¥{this.getPostPrice(orderDetail.items)}</span>
                      </div>
                    ) : ''
                  }
                  <div className={styles.foodInfoPrice}>
                    <span>合计</span>
                    <p>
                      <span>{this.goodTotalCount(orderDetail.items)}份</span>
                      <span>¥{this.getTotalPrice(orderDetail.items)}</span>
                    </p>
                  </div>
                </div>
              </div>
            ) : ''
          }

          {
            mealInfo ? (
              <div className={styles.mealType}>
                <span>餐别</span>
                <span>{getNearDate(mealInfo.bespeak_date)}-{mealInfo.mli_name}</span>
              </div>
            ) : ''
          }

          {
            mealInfo && customerInfo ? (
              <div className={styles.takeAwayInfo}>
                <p className={styles.tip}>配送信息</p>
                <div className={styles.content}>
                  <span>配送说明</span>
                  <p>{mealInfo.order_introduce}</p>
                </div>
                <div className={styles.content}>
                  <span>收货地址</span>
                  <p>{customerInfo.cta_info}</p>
                </div>
              </div>
            ) : ''
          }

          {
            orderInfo && mealInfo ? (
              <div className={styles.orderInfo}>
                <p className={styles.tip}>订单信息</p>
                <div className={styles.content}>
                  <span>订单号</span>
                  <p>{orderInfo.oi_number}</p>
                </div>
                {
                  orderInfo.oi_pay_type !== 'null' ? (
                    <div className={styles.content}>
                      <span>支付方式</span>
                      <p>{this.getPayType(orderInfo)}</p>
                    </div>
                  ) : ''
                }
                <div className={styles.content}>
                  <span>下单时间</span>
                  <p>{orderInfo.oi_date}</p>
                </div>
                {
                  orderStreamList ? (
                    getOrderType(orderInfo.oi_mhb_bii_id, orderInfo.oi_type, mealInfo).font === '已取餐' ? (
                      <div className={styles.content}>
                        <span>取餐时间</span>
                        {
                          orderStreamList.items.map((array, index) => {
                            if (array.osl_source === 'take_status' && parseInt(array.osl_value) === 2) {
                              return (
                                <p>{array.osl_date}</p>
                              )
                            }
                          })
                        }
                      </div>
                    ) : ''
                  ) : ''
                }
              </div>
            ) : ''
          }

          {
            refundInfo && parseInt(refundInfo.totalrecords) > 0 ? (
              <div className={styles.refundInfo}>
                <p className={styles.tip}>退款信息</p>
                {
                  refundInfo.items.map((array, index) => {
                    return (
                      <div className={styles.refundWrap} key={index}>
                        <div className={styles.content}>
                          <span>退款时间</span>
                          <p>{array.or_date}</p>
                        </div>
                        <div className={styles.content}>
                          <span>退款状态</span>
                          <p>
                            {
                              portUrl.refundType.map((arrayType, indexType) => {
                                if (parseInt(array.or_type) === parseInt(arrayType.key)) {
                                  return arrayType.value;
                                }
                              })
                            }
                          </p>
                        </div>
                        <div className={styles.content}>
                          <span>退款金额</span>
                          <p>¥{array.or_price}</p>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            ) : ''
          }
        </div>
      </DocumentTitle>
    );
  }
}
