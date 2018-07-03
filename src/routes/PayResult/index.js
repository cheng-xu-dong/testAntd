import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { Button, Toast } from 'antd-mobile';
import styles from './index.less';
import successPic from '../../assets/svg/提示_成功.svg';
import failPic from '../../assets/svg/提示_失败.svg';
import warnPic from '../../assets/svg/提示_警示.svg';
import portUrl from '../../common/portUrl.js';
import { getCookie, getQueryString } from '../../utils/utils';

@connect(({ global, payResult }) => ({
  global,
  payResult,
}))
export default class PayResult extends Component {
  state = {
    seq: '',
    state: '',
    payWait: true,
    payOk: false,
    payCount: 0,
  }

  componentWillMount() {
    if (getQueryString(this.props.location.search, 'seq') && getQueryString(this.props.location.search, 'state')) {
      this.setState({
        seq: getQueryString(this.props.location.search, 'seq'),
        state: getQueryString(this.props.location.search, 'state'),
      }, () => {
        Toast.loading('等待中...', 10);

        this.checkPayOk();
        this.getOrderInfo();
      })
    }
  }

  popstateLink = () => {
    window.location.replace(portUrl.urlRoot + portUrl.indexUrl + '/order');
  }

  componentDidMount() {
    getCookie('microrestaurant_eti_number');

    history.pushState(null, null, portUrl.urlRoot + portUrl.indexUrl + '/order');
    window.addEventListener('popstate', this.popstateLink, false);
  }

  checkPayOk = () => {
    const { state, seq } = this.state;
    const { dispatch } = this.props;

    let params = {
      oi_number: seq,
    }

    const That = this;

    if (state && state === 'ok') {
      dispatch({
        type: 'payResult/checkPayOk',
        payload: {
          params,
          That,
        }
      });
    }
  }

  getOrderInfo = () => {
    const { seq } = this.state;
    const { dispatch } = this.props;

    let params = {
      oi_number: seq,
    }

    if (seq) {
      dispatch({
        type: 'payResult/getOrderInfo',
        payload: params
      });
    }
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

  // 跳转支付详情
  toOrderDetail = (oiId) => {
    this.props.dispatch(routerRedux.push({
      pathname: portUrl.indexUrl + '/orderDetail',
      state: {
        oi_id: oiId,
      }
    }));
  }

  // 继续点餐
  continueToOrder = (obj) => {
    this.props.dispatch(routerRedux.push(portUrl.indexUrl + '/home'));
  }

  render() {
    const { state, seq, payOk, payWait } = this.state;
    const { orderInfo } = this.props.payResult;
    return (
      <DocumentTitle title="支付结果">
        {
          orderInfo ? (
            <div className={styles.payResult}>
              {
                state === 'ok' ? (
                  payWait ? (
                    <div className={styles.main}>
                      <img src={warnPic} />
                      <span className={styles.tip}>等待支付结果</span>
                      <span className={styles.price}>¥{orderInfo.oi_real_money}</span>
                      <span className={styles.remark}>请勿重复支付</span>
                    </div>
                  ) : (
                    payOk ? (
                      <div className={styles.main}>
                        <img src={successPic} />
                        <span className={styles.tip}>支付成功</span>
                        <span className={styles.price}>¥{orderInfo.oi_real_money}</span>
                        <div className={styles.successButton}>
                          <Button onClick={() => {this.toOrderDetail(orderInfo.oi_id)}} className={styles.button}>订单详情</Button>
                          <Button onClick={() => {this.continueToOrder(orderInfo.oi_id)}} className={styles.button}>继续点餐</Button>
                        </div>
                      </div>
                    ) : (
                      <div className={styles.main}>
                        <img src={failPic} />
                        <span className={styles.tip}>支付超时</span>
                        <span className={styles.price}>¥{orderInfo.oi_real_money}</span>
                        <span className={styles.remark}>支付金额将自动退回付款账户</span>
                      </div>
                    )
                  )
                ) : (
                  <div className={styles.main}>
                    <img src={failPic} />
                    <span className={styles.tip}>支付失败</span>
                    <span className={styles.price}>¥{orderInfo.oi_real_money}</span>
                    <span className={styles.remark}>支付失败，请在3分钟内重新支付</span>
                    <div className={styles.failButton}>
                      <Button onClick={() => {this.payOrderAgain(orderInfo.oi_id)}} className={styles.button}>重新支付</Button>
                    </div>
                  </div>
                )
              }
            </div>
          ) : ''
        }
      </DocumentTitle>
    );
  }
}
