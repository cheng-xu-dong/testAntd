import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { Button, TextareaItem, Icon, Modal, Tabs, List, Picker } from 'antd-mobile';
import styles from './index.less';
import portUrl from '../../common/portUrl.js';
import { getCookie } from '../../utils/utils';

@connect(({ global, postOrder }) => ({
  global,
  postOrder,
}))
export default class SelectAddress extends Component {
  state = {
    newAddress: '',
    addressInfo: '',
    firstFont: '',
    secondFont: '',
    tabs: [],
    tabsCopy: [{
      key: 'select',
      title: '请选择',
    }],
    firstArr: [],
    secondArr: [],
    thirdArr: [],
    selectTab: 0,
    addName: '',
    addPhone: '',
    showTip: false,
  }

  componentDidMount() {
    getCookie('microrestaurant_eti_number');
  }

  componentWillMount() {
    if (this.props.location.state) {
      const { state } = this.props.location;

      this.setState({
        addressInfo: JSON.parse(state.shopBusinessIntroduce.mhb_business).delivery_address ? JSON.parse(state.shopBusinessIntroduce.mhb_business).delivery_address : [],
        addName: state.defaultAddress ? state.defaultAddress.cta_name : '',
        addPhone: state.defaultAddress ? state.defaultAddress.cta_phone : '',
      })
    } else {
      this.props.dispatch(routerRedux.push(portUrl.indexUrl + '/home'));
    }
  }

  // 初始化地址选择
  initAddressSelect = () => {
    const { tabsCopy, addressInfo } = this.state;

    this.computeTabs(tabsCopy, 0);

    let firstArr = [];

    addressInfo.map((array, index) => {
      firstArr.push({
        key: 0,
        value: array.name,
      })
    })

    this.setState({
      firstArr: firstArr
    })
  }

  computeTabs = (tabsCopyArr, selectTab, dateArr) => {
    let tabsArr = [];

    tabsCopyArr.map((array, index) => {
      tabsArr.push({
        title: array.title,
      })
    })

    this.setState({
      tabs: tabsArr,
    }, () => {
      if (selectTab === 1) {
        this.setState({
          secondArr: dateArr ? dateArr : []
        }, () => {
          this.setState({
            selectTab: selectTab,
          })
        })
      } else if (selectTab === 2) {
        this.setState({
          thirdArr: dateArr ? dateArr : []
        }, () => {
          this.setState({
            selectTab: selectTab,
          })
        })
      }
    })
  }

  showModal = key => (e) => {
    e.preventDefault(); // 修复 Android 上点击穿透

    this.setState({
      [key]: true,
    }, () => {
      this.initAddressSelect();
    });
  }

  onClose = key => () => {
    this.setState({
      [key]: false,
    });
  }

  clickFirstList = (obj, ev) => {
    let clickFont;
    let clickKey;

    if (ev.target.getAttribute('data-key')) {
      clickFont = ev.target.innerHTML;
      clickKey = ev.target.getAttribute('data-key');
    } else if (ev.target.getAttribute('class') === 'am-list-content') {
      clickFont = ev.target.childNodes[0].innerHTML
      clickKey = ev.target.childNodes[0].getAttribute('data-key');
    } else if (ev.target.getAttribute('class') === 'am-list-line') {
      clickFont = ev.target.childNodes[0].childNodes[0].innerHTML
      clickKey = ev.target.childNodes[0].childNodes[0].getAttribute('data-key');
    }

    this.setState({
      firstFont: clickFont,
      thirdArr: [],
      tabsCopy: [{
        key: 'select',
        title: '请选择',
      }],
    }, () => {
      const { tabsCopy, addressInfo, firstFont } = this.state;

      let secondArr = [];

      addressInfo.map((array, index) => {
        if (array.name === firstFont) {
          if (array.level2.length > 0) {
            let someFlag = tabsCopy.some((item) => {
              return parseInt(item.key) === parseInt(clickKey)
            })

            if (someFlag) {
              tabsCopy.map((arrayTab, indexTab) => {
                if (parseInt(arrayTab.key) === parseInt(clickKey)) {
                  arrayTab.title = firstFont.length > 7 ? firstFont.substring(0, 7) + '...' : firstFont;
                }
              })
            } else {
              tabsCopy.unshift({
                key: clickKey,
                title: firstFont.length > 7 ? firstFont.substring(0, 7) + '...' : firstFont,
              })
            }

            array.level2.map((arrayChild, indexChild) => {
              secondArr.push({
                key: 1,
                value: arrayChild.name,
              })
            })

            this.setState({
              tabsCopy: tabsCopy
            }, () => {
              this.computeTabs(tabsCopy, parseInt(clickKey) + 1, secondArr);
            })
          } else {
            this.setState({
              newAddress: this.state.firstFont,
              popupModal: false,
            })
          }
        }
      })
    })
  }

  clickSecondList = (obj, ev) => {
    let clickFont;
    let clickKey;

    if (ev.target.getAttribute('data-key')) {
      clickFont = ev.target.innerHTML;
      clickKey = ev.target.getAttribute('data-key');
    } else if (ev.target.getAttribute('class') === 'am-list-content') {
      clickFont = ev.target.childNodes[0].innerHTML
      clickKey = ev.target.childNodes[0].getAttribute('data-key');
    } else if (ev.target.getAttribute('class') === 'am-list-line') {
      clickFont = ev.target.childNodes[0].childNodes[0].innerHTML
      clickKey = ev.target.childNodes[0].childNodes[0].getAttribute('data-key');
    }

    this.setState({
      secondFont: clickFont,
    }, () => {
      const { tabsCopy, addressInfo, firstFont, secondFont } = this.state;

      let thirdArr = [];

      addressInfo.map((array, index) => {
        if (array.name === firstFont) {
          array.level2.map((arrayChild, indexChild) => {
            if (arrayChild.name === secondFont) {
              if (arrayChild.level3.length > 0) {
                let someFlag = tabsCopy.some((item) => {
                  return parseInt(item.key) === parseInt(clickKey)
                })

                if (someFlag) {
                  tabsCopy.map((arrayTab, indexTab) => {
                    if (parseInt(arrayTab.key) === parseInt(clickKey)) {
                      arrayTab.title = secondFont.length > 7 ? secondFont.substring(0, 7) + '...' : secondFont;
                    }
                  })
                } else {
                  tabsCopy.splice(1, 0, {
                    key: clickKey,
                    title: secondFont.length > 7 ? secondFont.substring(0, 7) + '...' : secondFont,
                  })
                }


                arrayChild.level3.map((arrayGrandson, indexGrandson) => {
                  thirdArr.push({
                    key: 2,
                    value: arrayGrandson.name,
                  })
                })

                this.setState({
                  tabsCopy: tabsCopy
                }, () => {
                  this.computeTabs(tabsCopy, parseInt(clickKey) + 1, thirdArr);
                })
              } else {
                this.setState({
                  newAddress: this.state.firstFont + this.state.secondFont,
                  popupModal: false,
                })
              }
            }
          })
        }
      })
    })
  }

  clickThirdList = (obj, ev) => {
    let clickFont;

    if (ev.target.getAttribute('data-key')) {
      clickFont = ev.target.innerHTML;
    } else if (ev.target.getAttribute('class') === 'am-list-content') {
      clickFont = ev.target.childNodes[0].innerHTML
    } else if (ev.target.getAttribute('class') === 'am-list-line') {
      clickFont = ev.target.childNodes[0].childNodes[0].innerHTML
    }

    this.setState({
      newAddress: this.state.firstFont + this.state.secondFont + clickFont,
      popupModal: false,
    })
  }

  changeTab = (tab, index) => {
    this.setState({
      selectTab: index,
    })
  }

  changeName = (value) => {
    this.setState({
      addName: value,
    })
  }

  changePhone = (value) => {
    let reg = new RegExp("^1[34578]\\d{9}$");

    this.setState({
      addPhone: value
    }, () => {
      if (reg.test(value)) {
        this.setState({
          showTip: false,
        })
      }
    })
  }

  checkPhone = (value) => {
    let reg = new RegExp("^1[34578]\\d{9}$");
    if (!reg.test(value)) {
      this.setState({
        addPhone: '',
        showTip: true,
      })
    }
  }

  addAddress = () => {
    const { state } = this.props.location;
    const { userInfo } = this.props.global;
    const { newAddress, addName, addPhone } = this.state;
    const { dispatch } = this.props;

    let params = {
      cta_ci_id: userInfo.ci_id,
      cta_mhi_id: state.shopInfo.mhi_id,
      cta_info: newAddress,
      cta_name: addName,
      cta_phone: addPhone,
    }

    const That = this;

    dispatch({
      type: 'postOrder/addAddress',
      payload: {
        params,
        That,
      }
    });
  }

  linkPostOrder = () => {
    const { state } = this.props.location;

    this.props.dispatch(routerRedux.push({
      pathname: portUrl.indexUrl + '/postOrder',
      state: {
        mhb_bii_id: state.mhb_bii_id,
        mhi_id: state.mhi_id,
        mhb_id: state.mhb_id,
        shopBusinessIntroduce: state.shopBusinessIntroduce,
        businessIntroduce: state.businessIntroduce,
        carDate: state.carDate,
      }
    }));
  }

  render() {
    const {
      newAddress,
      popupModal,
      firstArr,
      secondArr,
      thirdArr,
      tabs,
      selectTab,
      addName,
      addPhone,
      showTip,
    } = this.state;

    return (
      <DocumentTitle title="地址选择">
        <div className={styles.selectAddress}>
          <div className={styles.address} onClick={this.showModal('popupModal')}>
            <div className={styles.addressLabel}>收货地址</div>
            {
              newAddress ? (
                <div className={styles.newAddressFont}>{newAddress}</div>
              ) : (
                <div className={styles.addressFont}>请选择</div>
              )
            }
            <Icon className={styles.addressIcon} type="right" size="md" color="rgb(169, 169, 169)" />
          </div>
          <TextareaItem
            title="姓名"
            placeholder="请输入"
            autoHeight
            value={addName}
            onChange={this.changeName}
          />
          <TextareaItem
            title="手机号"
            placeholder="请输入"
            autoHeight
            value={addPhone}
            onChange={this.changePhone}
            onBlur={this.checkPhone}
          />
          {
            showTip ? (
              <p className={styles.phoneTip}>请输入正确的手机号码</p>
            ) : ''
          }
          <div className={styles.buttonWrap}>
            {
              newAddress && addName && addPhone ? (
                <button onClick={this.addAddress} className={styles.buttonSure}>确定</button>
              ) : (
                <button className={styles.buttonNoSure}>确定</button>
              )
            }
          </div>

          <Modal
            popup
            visible={popupModal}
            onClose={this.onClose('popupModal')}
            animationType="slide-up"
            wrapClassName={styles.popupModalWrap}
          >
            <div className={styles.popupModal}>
              <div className={styles.header}>
                <span>收货地址</span>
                <Icon onClick={this.onClose('popupModal')} className={styles.closeIcon} type="cross" />
              </div>
              <div className={styles.content}>
                <Tabs
                  tabs={tabs}
                  initialPage={0}
                  page={selectTab}
                  onTabClick={this.changeTab}
                >
                  <List className="firstList">
                    {
                      firstArr.map((array, index) => {
                        return (
                          <List.Item onClick={this.clickFirstList.bind(null, array)} key={index}><span data-key={array.key}>{array.value}</span></List.Item>
                        )
                      })
                    }
                  </List>
                  <List className="secondList">
                    {
                      secondArr.map((array, index) => {
                        return (
                          <List.Item onClick={this.clickSecondList.bind(null, array)} key={index}><span data-key={array.key}>{array.value}</span></List.Item>
                        )
                      })
                    }
                  </List>
                  <List className="thirdList">
                    {
                      thirdArr.map((array, index) => {
                        return (
                          <List.Item onClick={this.clickThirdList.bind(null, array)} key={index}><span data-key={array.key}>{array.value}</span></List.Item>
                        )
                      })
                    }
                  </List>
                </Tabs>
              </div>
            </div>
          </Modal>
        </div>
      </DocumentTitle>
    );
  }
}
