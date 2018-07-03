import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import classNames from 'classnames';
import styles from './index.less';

import noHome from '../../assets/svg/tab_首页.svg';
import home from '../../assets/svg/tab_首页_选中.svg';

import noOrder from '../../assets/svg/tab_订单.svg';
import order from '../../assets/svg/tab_订单_选中.svg';

import noMine from '../../assets/svg/tab_我的.svg';
import mine from '../../assets/svg/tab_我的_选中.svg';

import portUrl from '../../common/portUrl.js';

@connect(({ global }) => ({
  global,
}))
export default class Footer extends Component {
  state = {
    footerDate: [{
      key: 'home',
      font: '首页',
      noPic: noHome,
      pic: home,
      size: {
        width: (window.innerWidth * 100 / 750) * 0.36,
        height: (window.innerWidth * 100 / 750) * 0.42,
      },
      path: portUrl.indexUrl + '/home',
      selcet: false,
    }, {
      key: 'order',
      font: '订单',
      noPic: noOrder,
      pic: order,
      size: {
        width: (window.innerWidth * 100 / 750) * 0.34,
        height: (window.innerWidth * 100 / 750) * 0.42,
      },
      path: portUrl.indexUrl + '/order',
      selcet: false,
    }, {
      key: 'mine',
      font: '我的',
      noPic: noMine,
      pic: mine,
      size: {
        width: (window.innerWidth * 100 / 750) * 0.36,
        height: (window.innerWidth * 100 / 750) * 0.42,
      },
      path: portUrl.indexUrl + '/mine',
      selcet: false,
    }]
  }
  componentWillMount() {
    const { footerDate } = this.state;

    footerDate.map((array, index) => {
      if (window.location.href.indexOf(array.key) >= 0) {
        array.selcet = true;
      } else {
        array.selcet = false;
      }
    })

    this.setState({
      footerDate: footerDate
    })
  }

  clickPage = (obj) => {
    const { footerDate } = this.state;

    footerDate.map((array, index) => {
      if (array.key === obj.key) {
        array.selcet = true;
      } else {
        array.selcet = false;
      }
    })

    this.setState({
      footerDate: footerDate
    }, () => {
      this.props.dispatch(routerRedux.push(obj.path));
    })
  }

  render() {
    const { footerDate } = this.state;
    return (
      <div className={styles.footer}>
        {
          footerDate.map((array, index) => {
            return (
              <div key={index} onClick={this.clickPage.bind(null, array)}>
                <img style={array.size} src={array.selcet ? array.pic : array.noPic} />
                <span className={array.selcet ? styles.selectFont : styles.noSelectFont}>{array.font}</span>
              </div>
            )
          })
        }
      </div>
    );
  }
}
