import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { Button, Toast, Modal } from 'antd-mobile';
import header from '../../assets/header.png';
import bg from '../../assets/png/bg1.png';
import food from '../../assets/菜.png';
import callShop from '../../assets/svg/联系商家.svg';
import moreArrow from '../../assets/svg/箭头_更多.svg';
import addAddress from '../../assets/svg/添加地址.svg';
import styles from './index.less';
import portUrl from '../../common/portUrl.js';
import { getCookie } from '../../utils/utils';

@connect(({ global, postOrder, loading }) => ({
  global,
  postOrder,
  addressLoading: loading.effects['postOrder/getShopInfo'],
}))
export default class PostOrder extends Component {
  state = {
    businessIntroduce: '',
    carDate: '',
    shopBusinessIntroduce: '',
    stockLackModal: false,
    stockLackArr: '',
  }

  componentWillMount() {
    if (this.props.location.state && this.props.location.state.mhi_id) {
      Toast.loading('等待中...', 10);

      const { userInfo } = this.props.global;
      const { dispatch } = this.props;
      const { state } = this.props.location;

      const That = this;

      dispatch({
        type: 'postOrder/getShopInfo',
        payload: {
          mhi_id: state.mhi_id,
          cta_ci_id: userInfo.ci_id,
          mhb_bii_id: state.mhb_bii_id,
          That,
        }
      });
    } else {
      this.props.dispatch(routerRedux.push(portUrl.indexUrl + '/home'));
    }
  }

  hideLoading = () => {
    Toast.hide();
  }

  componentDidMount() {
    getCookie('microrestaurant_eti_number');

    const { state } = this.props.location;
    // console.log(state);
    if (state && state.carDate && state.businessIntroduce && state.shopBusinessIntroduce) {
      this.setState({
        businessIntroduce: state.businessIntroduce,
        carDate: state.carDate,
        shopBusinessIntroduce: state.shopBusinessIntroduce,
      })
    }
  }

  // 计算商品的总数量
  goodTotalCount = () => {
    const { carDate } = this.state;
    let totalCount = parseInt(0);

    carDate.map((array, index) => {
      totalCount += parseInt(array.count);
    })

    return totalCount;
  }

  // 计算商品总价格
  getTotalPrice = (mhb_bii_id) => {
    const { carDate, shopBusinessIntroduce } = this.state;
    let totalPrice = parseFloat(0.00);

    carDate.map((array, index) => {
      totalPrice += (parseInt(array.count) * parseFloat(array.cdp_price));
    })

    if (parseInt(mhb_bii_id) === 2) {
      totalPrice += parseFloat(JSON.parse(shopBusinessIntroduce.mhb_business).delivery_price);
    }

    return totalPrice.toFixed(2);
  }

  editeAddress = () => {
    const { state } = this.props.location;

    this.props.dispatch(routerRedux.push({
      pathname: portUrl.indexUrl + '/selectAddress',
      state: {
        shopInfo: this.props.postOrder.shopInfo,
        defaultAddress: this.props.postOrder.defaultAddress,
        shopBusinessIntroduce: state.shopBusinessIntroduce,
        businessIntroduce: state.businessIntroduce,
        carDate: state.carDate,
        mhi_id: state.mhi_id,
        mhb_id: state.mhb_id,
        mhb_bii_id: state.mhb_bii_id,
      },
    }));
  }

  postOrder = () => {
    const { state } = this.props.location;
    const { shopInfo } = this.props.postOrder;
    const { userInfo } = this.props.global;
    const { defaultAddress } = this.props.postOrder;

    let od_info = [];
    state.carDate.map((array, index) => {
      od_info.push({
        cdp_id: array.cdp_id,
        count: array.count,
      })
    })

    const { dispatch } = this.props;

    let params = {
      eti_id: shopInfo.mhi_eti_id,
      ci_id: userInfo.ci_id,
      mhi_id: shopInfo.mhi_id,
      mhb_id: state.mhb_id,
      mhm_id: state.businessIntroduce.mhm_id,
      mli_id: state.businessIntroduce.mli_id,
      bespeak_date: state.businessIntroduce.time,
      od_info: JSON.stringify(od_info),
    }

    if (parseInt(state.mhb_bii_id) === 2) {
      params['cta_id'] = defaultAddress.cta_id;
    }

    const That = this;

    dispatch({
      type: 'postOrder/postOrder',
      payload: {
        params,
        That,
      }
    });
  }

  payOrder = (oiId) => {
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

  // 提交订单库存不足时显示弹窗
  stockLackShowModal = (obj) => {
    this.setState({
      stockLackArr: obj.items,
    }, () => {
      this.setState({
        stockLackModal: true,
      })
    })
  }

  //显示库存不足的商品名称
  stockLackArrMap = (arr) => {
    let returnString = '';

    if (Object.prototype.toString.call(arr)=='[object Array]') {
      arr.map((array, index) => {
        if (index === arr.length - 1) {
          returnString += array.cdi_name
        } else {
          returnString += array.cdi_name + ','
        }
      })
    }

    return returnString;
  }

  // 点击库存不足的modal跳转到订餐页面
  stockLackButton = () => {
    const { state } = this.props.location;
    const { stockLackArr } = this.state;
    let carDate = state.carDate;

    carDate.map((array, index) => {
      stockLackArr.map((arrayChild, indexChild) => {
        if (parseInt(array.cdp_cdi_id) === parseInt(arrayChild.cdp_cdi_id)) {
          array.count = arrayChild.cdp_stock;
        }
      })
    })

    this.props.dispatch(routerRedux.push({
      pathname: portUrl.indexUrl + '/orderDinner',
      state: {
        mhb_bii_id: state.mhb_bii_id,
        titleFont: state.titleFont,
        mhb_id: state.mhb_id,
        mhi_id: state.mhi_id,
        carDate: carDate,
        meal: [state.businessIntroduce.postOrderTime, state.businessIntroduce.mli_name],
      }
    }));
  }

  render() {
    const tipStyle = {
      backgroundImage: `url(${bg})`
    }

    const { stockLackModal, stockLackArr, businessIntroduce, carDate, shopBusinessIntroduce } = this.state;
    const { shopInfo, defaultAddress } = this.props.postOrder;
    const { addressLoading } = this.props;
    const { mhb_bii_id } = this.props.location.state;

    return (
      <DocumentTitle title="提交订单">
        {
          !addressLoading ? (
            <div className={styles.postOrder}>
              {
                businessIntroduce ? (
                  <div style={ tipStyle } className={styles.tip}>
                    {
                      businessIntroduce.order_introduce ? (
                        <p>预定说明:&nbsp;{businessIntroduce.order_introduce}</p>
                      ) : ''
                    }
                    {
                      parseInt(mhb_bii_id) === 2 ? (
                        <div className={styles.tipAddress} onClick={this.editeAddress}>
                          {
                            defaultAddress ? (
                              <div className={styles.text}>
                                <p>{defaultAddress.cta_info}</p>
                                <p>{defaultAddress.cta_name}&nbsp;{defaultAddress.cta_phone}</p>
                              </div>
                            ) : (
                              <div className={styles.noText}>
                                <img src={addAddress} />
                                <span>请选择一个地址</span>
                              </div>
                            )
                          }
                          <img src={moreArrow} />
                        </div>
                      ) : (
                        <div className={styles.tipAddress}>
                          <div className={styles.noText}>
                            <span>取餐时间:&nbsp;&nbsp;{businessIntroduce.postOrderTime}&nbsp;{businessIntroduce.takemeal_start_time ? businessIntroduce.takemeal_start_time : ''}~{businessIntroduce.takemeal_end_time ? businessIntroduce.takemeal_end_time : ''}</span>
                          </div>
                        </div>
                      )
                    }
                  </div>
                ) : ''
              }

              {
                carDate && shopBusinessIntroduce && shopInfo ? (
                  <div className={styles.orderInfo}>
                    <div className={styles.title}>
                      <div className={styles.titleLeft}>
                        <img src={shopInfo.mhi_header_img ? JSON.parse(shopInfo.mhi_header_img).picture_small_network_url : header} />
                        <span>{shopInfo.mhi_name}</span>
                      </div>
                      <div className={styles.titleRight}>
                        <img src={callShop} />
                        <a href={'tel:' + shopInfo.mhi_phone}>联系商家</a>
                      </div>
                    </div>

                    <div className={styles.foodInfo}>
                      {
                        carDate.map((array, index) => {
                          return (
                            <div key={index} className={styles.foodInfoMain}>
                              <img src={array.cdi_header_img ? JSON.parse(array.cdi_header_img).picture_small_network_url : food} />
                              <div className={styles.text}>
                                <p>{array.cdi_name}</p>
                                <p>
                                  <span>×{array.count}</span>
                                  <span>¥{(parseFloat(array.cdp_price) * parseFloat(array.count)).toFixed(2)}</span>
                                </p>
                              </div>
                            </div>
                          )
                        })
                      }
                      {
                        parseInt(mhb_bii_id) === 2 ? (
                          <div className={styles.foodInfoPostPrice}>
                            <span>配送费</span>
                            <span>¥{JSON.parse(shopBusinessIntroduce.mhb_business).delivery_price}</span>
                          </div>
                        ) : ''
                      }
                      <div className={styles.foodInfoPrice}>
                        <span>合计</span>
                        <p>
                          <span>{this.goodTotalCount()}份</span>
                          <span>¥{this.getTotalPrice(mhb_bii_id)}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ) : ''
              }

              {
                businessIntroduce ? (
                  <div className={styles.mealType}>
                    <span>餐别</span>
                    <span>{businessIntroduce.postOrderTime + '-' + businessIntroduce.mli_name}</span>
                  </div>
                ) : ''
              }

              {
                carDate && shopBusinessIntroduce ? (
                  <div className={styles.footer}>
                    <div className={styles.footerLeft}>
                      <span>待支付</span>
                      <span>¥{this.getTotalPrice(mhb_bii_id)}</span>
                    </div>
                    {
                      parseInt(mhb_bii_id) === 2 ? (
                        defaultAddress ? (
                          <div onClick={this.postOrder} className={styles.footerRight}>
                            <button>提交订单</button>
                          </div>
                        ) : (
                          <div className={styles.footerRightNoClick}>
                            <button>提交订单</button>
                          </div>
                        )
                      ) : (
                        <div onClick={this.postOrder} className={styles.footerRight}>
                          <button>提交订单</button>
                        </div>
                      )
                    }
                  </div>
                ) : ''
              }

              <Modal
                visible={stockLackModal}
                transparent
                maskClosable={false}
                footer={[{ text: '确定', onPress: () => this.stockLackButton() }]}
                wrapProps={{ onTouchStart: this.onWrapTouchStart }}
              >
                <p style={{ color: '#333333' }}>您下手慢了，{this.stockLackArrMap(stockLackArr)}库存不足</p>
              </Modal>
            </div>
          ) : ''
        }
      </DocumentTitle>
    );
  }
}
