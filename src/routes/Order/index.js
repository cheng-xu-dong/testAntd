import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import classNames from 'classnames';
import DocumentTitle from 'react-document-title';
import { Button, Toast, Icon } from 'antd-mobile';
import Footer from '../../components/Footer';
import styles from './index.less';
import headerPic from '../../assets/header.png';
import noOrderList from '../../assets/noOrderList.png';
import portUrl from '../../common/portUrl.js';
import { getCookie, getNearDate, getOrderType, getRefundType } from '../../utils/utils';

@connect(({ global, order }) => ({
  global,
  order,
}))
export default class Order extends Component {
  state = {
    rows: 10,
    page: 0,
    getMoreDate: false,
  }

  componentWillUnmount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'order/clearStorage',
    });
  }

  componentDidMount() {
    getCookie('microrestaurant_eti_number');

    let onceGet = true;
    this.getOrderList(onceGet);
  }

  getOrderList = (onceGet) => {
    this.setState({
      getMoreDate: true,
      page: this.state.page + 1,
    }, () => {
      Toast.loading('等待中...', 20);

      const { userInfo } = this.props.global;
      const { dispatch } = this.props;
      const { rows, page } = this.state;

      const That = this;

      dispatch({
        type: 'order/getOrderList',
        payload: {
          ci_id: userInfo.ci_id,
          rows: rows,
          page: page,
          onceGet,
          That,
        }
      });
    })
  }

  hideLoading = () => {
    Toast.hide();
  }

  goOrderDetail = (obj) => {
    this.props.dispatch(routerRedux.push({
      pathname: portUrl.indexUrl + '/orderDetail',
      state: {
        oi_id: obj.oi_id,
      }
    }));
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

  // 是否展示查看更多按钮
  showGetMoreButton = (table, total, getMoreDate) => {
    if (table) {
      if (table.length >= total) {
        return ''
      } else {
        return (
          <div className={styles.lookMoreDate} onClick={this.getOrderList}>
            {
              getMoreDate ? (
                <Icon size="xs" type="loading" />
              ) : (
                <span className={styles.text}>查看更多<Icon size="xs" type="down" /></span>
              )
            }
          </div>
        )
      }
    } else {
      return ''
    }
  }

  render() {
    const { orderList, orderListTotal } = this.props.order;
    const { getMoreDate } = this.state;

    return (
      <DocumentTitle title="订单">
        <div className={styles.order}>
          {
            orderList && orderList.length > 0 ? (
              <div className={styles.orderItemMargin}>
                {
                  orderList.map((array, index) => {
                    return (
                      <div key={index} className={styles.orderItem} onClick={() => {this.goOrderDetail(array)}}>
                        <div className={styles.main}>
                          <div className={styles.pic}>
                            <img src={array.mhi_info.mhi_header_img ? JSON.parse(array.mhi_info.mhi_header_img).picture_small_network_url : headerPic} />
                          </div>
                          <div className={styles.content}>
                            <div className={styles.header}>
                              <div className={styles.shopInfo}>
                                <span>{array.mhi_info.mhi_name}</span>
                                {
                                  getOrderType(array.oi_mhb_bii_id, array.oi_type, array.order_meal_info).font ? (
                                    <span className={getOrderType(array.oi_mhb_bii_id, array.oi_type, array.order_meal_info).noColor ? styles.noColor : ''}>{getOrderType(array.oi_mhb_bii_id, array.oi_type, array.order_meal_info).font}</span>
                                  ) : ''
                                }
                              </div>
                              {
                                array.order_meal_info || (array.oi_stream_status && array.oi_stream_status.refund_status) ? (
                                  <div className={styles.tip}>
                                    {
                                      getOrderType(array.oi_mhb_bii_id, array.oi_type, array.order_meal_info).font === '待取餐' ? (
                                        <div className={styles.waitTakeMeal}>
                                          <span className={classNames({
                                            [styles.mealType]: true
                                          }, {
                                            [styles.mealTypeNoColor]: getOrderType(array.oi_mhb_bii_id, array.oi_type, array.order_meal_info).noColor
                                          })}>{getNearDate(array.order_meal_info.bespeak_date)}&nbsp;{array.order_meal_info.mli_name}</span>
                                          <span className={classNames({
                                            [styles.mealType]: true
                                          }, {
                                            [styles.mealTypeNoColor]: getOrderType(array.oi_mhb_bii_id, array.oi_type, array.order_meal_info).noColor
                                          })}>取餐时间&nbsp;&nbsp;{getNearDate(array.order_meal_info.bespeak_date)}&nbsp;{array.order_meal_info.takemeal_start_time}~{array.order_meal_info.takemeal_end_time}</span>
                                        </div>
                                      ) : (
                                        <span className={classNames({
                                          [styles.mealType]: true
                                        }, {
                                          [styles.mealTypeNoColor]: getOrderType(array.oi_mhb_bii_id, array.oi_type, array.order_meal_info).noColor
                                        })}>{getNearDate(array.order_meal_info.bespeak_date)}&nbsp;{array.order_meal_info.mli_name}</span>
                                      )
                                    }
                                    {
                                      array.oi_stream_status && array.oi_stream_status.refund_status ? (
                                        <span className={styles.refundType}>{getRefundType(array.oi_stream_status.refund_status)}</span>
                                      ) : ''
                                    }
                                  </div>
                                ) : ''
                              }
                            </div>
                            {
                              array.orderDetail.map((arrayMeal, indexMeal) => {
                                if (parseInt(arrayMeal.od_type) !== 2) {
                                  return (
                                    <div key={indexMeal} className={styles.meal}>
                                      <span className={styles.mealName}>{arrayMeal.od_name}</span>
                                      <div className={styles.mealPriceCount}>
                                        <span>×{arrayMeal.od_count}</span>
                                        <span>¥{(parseFloat(arrayMeal.od_real_price) * parseFloat(arrayMeal.od_count)).toFixed(2)}</span>
                                      </div>
                                    </div>
                                  )
                                }
                              })
                            }
                            <div className={styles.footer}>
                              <span className={styles.footerPrice}>共{this.goodTotalCount(array.orderDetail)}份，¥{this.getTotalPrice(array.orderDetail)}</span>
                              {
                                this.getPostPrice(array.orderDetail) ? (
                                  <span className={styles.footerPostPrice}>含配送费{this.getPostPrice(array.orderDetail)}</span>
                                ) : ''
                              }
                            </div>
                          </div>
                        </div>
                      </div>  
                    )
                  })
                }
                <div>
                  {
                    this.showGetMoreButton(orderList, orderListTotal, getMoreDate)
                  }
                </div>
              </div>
            ) : (
              <div className={styles.noOrderList}>
                <div className={styles.text}>
                  <img src={noOrderList} />
                  <span>暂无数据...</span>
                </div>
              </div>
            )
          }
          <Footer />
        </div>
      </DocumentTitle>
    );
  }
}
