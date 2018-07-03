import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { WingBlank, Picker, List, Modal, Button, Badge, Toast } from 'antd-mobile';
import classNames from 'classnames';
import $ from 'jquery';
import FlyBall from './ball';
import styles from './index.less';
import carPNG from '../../assets/svg/购物车.svg';
import food from '../../assets/菜.png';
import mealArrow from '../../assets/svg/下拉.svg';
import moreIntroduce from '../../assets/svg/更多介绍.svg';
import addFood from '../../assets/svg/数量_加.svg';
import reduceFood from '../../assets/svg/数量_减.svg';
import closeModal from '../../assets/svg/弹窗关闭.svg';
import clearCar from '../../assets/svg/清空.svg';
import portUrl from '../../common/portUrl.js';
import { getCookie, getNearDate, getNearDateWeek } from '../../utils/utils';

@connect(({ global, orderDinner }) => ({
  global,
  orderDinner,
}))
export default class OrderDinner extends Component {
  state = {
    shopBusiness: '', // 业务详情(头部的所有信息：餐别、日期、截止时间、订餐说明)
    businessIntroduce: '', // 订餐说明的详细信息
    ballsTarget: '', // 小球进入购物车的坐标
    balls: [], // 购买商品的动态小球
    mealCategoryCols: 2, // 日期和餐别选择排两列(日期、餐别)
    mealCategoryDate: '', // 日期和餐别选择的数据
    pickerMealCategory: [], // 当前选择的日期和餐别
    mealCategoryVisible: false, // 日期和餐别选择框的显示隐藏
    firstEntry: true, // 如果是第一次进入则日期和餐别的选择框去掉取消按钮否则显示
    mealType: [], // 菜品类别
    mealDate: [], // 菜品种类
    getAllMeal: false,
    carDate: [], // 购物车商品
    popupModal: false, // 购物车modal框的显示隐藏
    disappearAnimation: true, // 购物车消失动画开关
    moreIntroduceModal: false, // 订餐说明的显示隐藏
    editeFoodCount: false, // 提交订单时库存不足返回外卖预定页面修改库存
    IOS10_3: false,
  }

  // 获取业务详情
  componentWillMount() {
    if (/iPhone OS 10_3/.test(navigator.userAgent)) {
      this.setState({
        IOS10_3: true,
      })
    }

    if (this.props.location.state && this.props.location.state.mhb_id) {
      Toast.loading('等待中...', 10);
      const { dispatch } = this.props;

      const That = this;

      dispatch({
        type: 'orderDinner/getShopBusiness',
        payload: {
          mhb_id: this.props.location.state.mhb_id,
        }
      });
    } else {
      this.props.dispatch(routerRedux.push(portUrl.indexUrl + '/home'));
    }
  }

  // 填充日期和餐别选择框的数据mealCategoryDate
  componentWillReceiveProps(nextProps) {
    if (nextProps.orderDinner.shopBusiness) {
      this.setState({
        shopBusiness: nextProps.orderDinner.shopBusiness.items ? nextProps.orderDinner.shopBusiness.items : []
      }, () => {
        const { shopBusiness, fewDate, editeFoodCount } = this.state;
        let mealCategoryDate = [];

        shopBusiness.map((array, index) => {
          mealCategoryDate.push({
            value: getNearDate(array.day_str),
            label: getNearDate(array.day_str),
            week: getNearDateWeek(array.day_str),
            children: [],
          })
          array.commodityMeals.map((arrayChild, indexChild) => {
            mealCategoryDate[index].children.push({
              value: arrayChild.mli_name,
              label: arrayChild.mli_name,
              time: array.day_str,
              postOrderTime: getNearDate(array.day_str),
              ...arrayChild,
            })
          })
        })

        this.setState({
          mealCategoryDate: mealCategoryDate
        }, () => {
          if (this.props.location.state && this.props.location.state.carDate && this.props.location.state.meal) {
            if (!editeFoodCount) {
              this.setState({
                editeFoodCount: true,
              }, () => {
                this.pickerOk(this.props.location.state.meal, this.state.editeFoodCount);
              })
            }
          }
        })
      })
    };
  }

  popstateLink = () => {
    window.location.replace(portUrl.urlRoot + portUrl.indexUrl + '/home');
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.popstateLink, false);
  }

  componentDidMount() {
    getCookie('microrestaurant_eti_number');

    window.addEventListener('popstate', this.popstateLink, false);

    const { state } = this.props.location;
    this.setState({
      ballsTarget: {
        sx: (window.innerWidth * 100 / 750) * 1.3 / 1.7,
        sy: window.innerHeight - ((window.innerWidth * 100 / 750) * 1.1),
      },
    }, () => {
      if (state && state.carDate && state.meal) {
        this.setState({
          mealCategoryVisible: false,
        })
      } else {
        this.setState({
          mealCategoryVisible: true,
        })
      }
    })

    const scroll_D_value = (window.innerWidth * 100 / 750) * .88;

    // 点击菜品类型会触发url添加#xx，这里监听url变化然后自动滚动右侧菜品
    this.props.history.listen((route) => {
      let scrollElm = route.hash.replace('#', '');

      if (scrollElm && this.refs[scrollElm]) {
        $('#takeAwayRight').animate({
          scrollTop: this.refs[scrollElm].offsetTop - scroll_D_value
        }, 200)
      }

      // 点击菜品类型在右侧运动完成后恢复监听滚动事件
      this.timer = setTimeout(() => {
        this.monitorScroll();
      }, 300)
    });
  }

  // 菜品类别和菜品种类的数据获取与整合
  getCategoryMeal = (category, meal, editeFoodCount) => {
    const { mealType, mealDate } = this.state;

    if (category && meal) {
      if (category.items) {
        category.items.map((array, index) => {
          mealType.push({
            ...array,
            auchor: array.cti_name,
            select: index === 0 ? true : false,
            mealCount: 0,
          })
          mealDate.push({
            title: array.cti_name,
            auchor: array.cti_name,
            ...array,
            info: [],
          })
        })

        this.setState({
          mealType: mealType,
          mealDate: mealDate
        }, () => {
          const { mealType, mealDate } = this.state;

          if (meal.items && category.items.length > 0) {
            meal.items.map((arrayFather, indexFather) => {
              arrayFather.categoryInfoList.map((array, index) => {
                mealDate.map((arrayChild, indexChild) => {
                  if (parseInt(array.cti_id) === arrayChild.cti_id) {
                    arrayFather['count'] = 0;
                    arrayChild.info.push(arrayFather);
                  }
                })
              })
            })

            let newMealDate = [];
            let newMealType = [];

            mealDate.map((array, index) => {
              if (array.info.length !== 0) {
                newMealDate.push(array);

                mealType.map((arrayMealType, indexMealType) => {
                  if (parseInt(arrayMealType.cti_id) === parseInt(array.cti_id)) {
                    newMealType.push(arrayMealType);
                  }
                })
              }
            })

            this.setState({
              mealType: newMealType,
              mealDate: newMealDate,
            }, () => {
              Toast.hide();

              if (editeFoodCount) {
                const { mealDate } = this.state;
                const { carDate } = this.props.location.state;

                carDate.map((array, index) => {
                  mealDate.map((arrayMeal, indexMeal) => {
                    arrayMeal.info.map((arrayMealChild, indexMealChild) => {
                      if (parseInt(array.cdp_cdi_id) === parseInt(arrayMealChild.cdp_cdi_id)) {
                        if (parseInt(array.count) === 0) {
                          carDate.splice(index, 1);
                        } else {
                          arrayMealChild['count'] = array.count;
                        }
                      }
                    })
                  })
                })

                this.setState({
                  mealDate: mealDate,
                  carDate: carDate,
                }, () => {
                  this.mealTypeNumber();
                })
              }

              // 是否获取并整合完菜品类别和菜品种类
              this.setState({
                getAllMeal: true,
              }, () => {
                // 首次进入页面的时候绑定监听滚动事件
                this.monitorScroll();
              })
            })
          } else {
            this.setState({
              mealDate: [],
            }, () => {
              Toast.hide();
              // 是否获取并整合完菜品类别和菜品种类
              this.setState({
                getAllMeal: true,
              })
            })
          }
        })
      }
    }
  }

  // 日期和餐别选择框点击确定
  pickerOk = (item, editeFoodCount) => {
    if (item.length === 2) {
      this.setState({
        pickerMealCategory: item,
      }, () => {
        let cdp_mhm_id;
        let cdp_week;
        const That = this;

        const { dispatch } = this.props;
        const { pickerMealCategory, mealCategoryDate } = this.state;

        this.setState({
          mealCategoryVisible: false,
          firstEntry: false,
          mealType: [],
          mealDate: [],
          carDate: [],
          getAllMeal: false,
        }, () => {
          Toast.loading('等待中...', 10);

          mealCategoryDate.map((array, index) => {
            if (pickerMealCategory[0] === array.value) {
              cdp_week = array.week;
              array.children.map((arrayChild, indexChild) => {
                if (arrayChild.value === pickerMealCategory[1]) {
                  cdp_mhm_id = arrayChild.mhm_id;
                  this.setState({
                    businessIntroduce: arrayChild,
                  })
                }
              })
            }
          })

          dispatch({
            type: 'orderDinner/getShopCategory',
            payload: {
              cdp_mhb_id: this.props.location.state.mhb_id,
              cdp_mhi_id: this.props.location.state.mhi_id,
              cdp_mhm_id: cdp_mhm_id,
              cdp_week: cdp_week,
              That,
              editeFoodCount: editeFoodCount,
            }
          });
        })
      })
    } else {
      Toast.fail('请选择正确的餐别！', 1);
    }
  }

  // 左侧菜品分类的徽标数
  mealTypeNumber = () => {
    const { mealType, mealDate } = this.state;

    mealType.map((array, index) => {
      mealDate.map((arrayChild, indexChild) => {
        if (parseInt(array.cti_id) === parseInt(arrayChild.cti_id)) {
          let mealNumber = 0;
          arrayChild.info.map((arrayMeal, indexMeal) => {
            mealNumber += arrayMeal.count;
          })
          array.mealCount = mealNumber;
        }
      })
    })

    this.setState({
      mealType: mealType,
    })
  }

  // 点击添加商品出现购物小球
  clickAddGood = (obj, event) => {
    // 元素相对于视口的位移  event.currentTarget.getBoundingClientRect()
    // 元素的自身宽度  event.currentTarget.offsetWidth
    // 元素的自身高度  event.currentTarget.offsetHeight

    // 点击小球的X坐标
    let ballX = event.currentTarget.getBoundingClientRect().left + event.currentTarget.offsetWidth/2;
    
    // 点击小球的Y坐标
    let ballY = event.currentTarget.getBoundingClientRect().top + event.currentTarget.offsetHeight/2;

    let balls = this.state.balls;
    let ballLen = balls.length;

    let newBall = {
      id: new Date().getTime(),
      position: {
        x: ballX,
        y: ballY,
      }
    }

    const { mealDate } = this.state;

    let addFlag = false;
    let setStateMealDateFlag = true;

    mealDate.map((array, index) => {
      if (!addFlag) {
        array.info.map((arrayChild, indexChild) => {
          if (parseInt(obj.cdp_cdi_id) === parseInt(arrayChild.cdp_cdi_id)) {
            if (parseInt(arrayChild['count']) === parseInt(arrayChild['cdp_stock'])) {
              addFlag = true;
              setStateMealDateFlag = false;
              Toast.fail('商品库存不足！', 1);
            } else {
              arrayChild['count'] += 1;
              addFlag = true;
            }
          }
        })
      }
    })

    if (setStateMealDateFlag) {
      this.setState({
        mealDate: mealDate
      }, () => {
        balls.push(newBall);

        this.setState({
          balls: Object.assign([], balls)
        }, () => {
          this.getCarDate();
          this.mealTypeNumber();
        })
      })
    }
  }

  // 购物车中添加商品（不需要小球效果）
  carClickAddGood = (obj, event) => {
    const { mealDate } = this.state;

    let addFlag = false;
    let setStateMealDateFlag = true;

    mealDate.map((array, index) => {
      if (!addFlag) {
        array.info.map((arrayChild, indexChild) => {
          if (parseInt(obj.cdp_cdi_id) === parseInt(arrayChild.cdp_cdi_id)) {
            if (parseInt(arrayChild['count']) === parseInt(arrayChild['cdp_stock'])) {
              addFlag = true;
              setStateMealDateFlag = false;
              Toast.fail('商品库存不足！', 1);
            } else {
              arrayChild['count'] += 1;
              addFlag = true;
            }
          }
        })
      }
    })

    if (setStateMealDateFlag) {
      this.setState({
        mealDate: mealDate
      }, () => {
        this.getCarDate();
        this.mealTypeNumber();
      })
    }
  }

  // 点击减少商品
  clickReduceGood = (obj, event) => {
    const { mealDate } = this.state;
    let reduceFlag = false;

    mealDate.map((array, index) => {
      if (!reduceFlag) {
        array.info.map((arrayChild, indexChild) => {
          if (parseInt(obj.cdp_cdi_id) === parseInt(arrayChild.cdp_cdi_id)) {
            arrayChild['count'] -= 1;
            reduceFlag = true;
          }
        })
      }
    })
    this.setState({
      mealDate: mealDate
    }, () => {
      this.getCarDate();
      this.mealTypeNumber();
    })
  }

  // 购物车的数据直接从mealDate中Copy出来
  getCarDate = () => {
    this.setState({
      carDate: [],
    }, () => {
      const { mealDate, carDate } = this.state;

      mealDate.map((array, index) => {
        array.info.map((arrayChild, indexChild) => {
          if (parseInt(arrayChild.count) > 0) {
            if (!carDate.some((item, key) => {
              return parseInt(item.cdp_cdi_id) === parseInt(arrayChild.cdp_cdi_id);
            })) {
              carDate.push(arrayChild);
            }
          } else {
            let moveKey;
            if (carDate.some((item, key) => {
              moveKey = key;
              return parseInt(item.cdp_cdi_id) === parseInt(arrayChild.cdp_cdi_id);
            })) {
              carDate.splice(moveKey, 1);
            }
          }
        })
      })

      this.setState({
        carDate: carDate
      }, () => {
        if (carDate.length <= 0) {
          this.setState({
            popupModal: false
          }, () => {
            setTimeout(() => {
              this.setState({
                disappearAnimation: true
              })
            }, 300)
          })
        }
      })
    })
  }

  // 进入购物车的购物小球去掉
  completeBall = (id) => {
    let balls = this.state.balls;

    for (let i = 0; i < balls.length; i++) {
      if (balls[i].id === id) {
        balls.splice(i, 1);
        this.refCar.style.webkitTransform = 'scale(1.1)';
        this.refCar.style.transform = 'scale(1.1)';

        setTimeout(() => {
          if (this.refCar) {
            this.refCar.style.webkitTransform = 'scale(1)';
            this.refCar.style.transform = 'scale(1)';
          }
        }, 100);
        break;
      }
    }

    this.setState({
      balls: Object.assign([], balls)
    })
  }

  // 监听滚动事件左侧菜单高亮变化
  monitorScroll = () => {
    const scroll_D_value = (window.innerWidth * 100 / 750) * .88;
    const { mealType } = this.state;

    $('#takeAwayRight').on('scroll', () => {
      mealType.map((array, index) => {
        if (index === 0 && this.refs[mealType[index].auchor]) {
          if ((this.refs[mealType[index].auchor].offsetTop - $('#takeAwayRight').scrollTop()) <= scroll_D_value + 10 && (($('#takeAwayRight').scrollTop() + scroll_D_value) < this.refs[mealType[index + 1].auchor].offsetTop)) {
            array['select'] = true;
          } else {
            array['select'] = false;
          }
        } else if (index !== 0 && index !== (mealType.length - 1) && this.refs[mealType[index].auchor]) {
          if ((this.refs[mealType[index].auchor].offsetTop - $('#takeAwayRight').scrollTop()) <= scroll_D_value && (($('#takeAwayRight').scrollTop() + scroll_D_value) >= this.refs[mealType[index - 1].auchor].offsetTop) && (($('#takeAwayRight').scrollTop() + scroll_D_value) < this.refs[mealType[index + 1].auchor].offsetTop)) {
            array['select'] = true;
          } else {
            array['select'] = false;
          }
        } else if (index === (mealType.length - 1) && this.refs[mealType[index].auchor]) {
          if ((this.refs[mealType[index].auchor].offsetTop - $('#takeAwayRight').scrollTop()) <= scroll_D_value && (($('#takeAwayRight').scrollTop() + scroll_D_value) >= this.refs[mealType[index - 1].auchor].offsetTop)) {
            array['select'] = true;
          } else {
            array['select'] = false;
          }
        }
      })
      this.setState({
        mealType: mealType,
      })
    })
  }

  // 点击菜品类别让菜品列表自动滚动对应位置
  selectMealType = (obj) => {
    // 点击菜品类型，解除监听的滚动事件，因为点击菜品类型的滚动和monitorScroll方法冲突
    $('#takeAwayRight').unbind('scroll');

    const { mealType } = this.state;
    mealType.map((array, index) => {
      if (array.cti_name === obj.cti_name) {
        array['select'] = true;
      } else {
        array['select'] = false;
      }
    })
    
    this.setState({
      mealType: mealType,
    }, () => {
      this.props.dispatch(routerRedux.push({
        hash: '#' + obj.auchor,
        state: {
          mhb_bii_id: this.props.location.state.mhb_bii_id,
          titleFont: this.props.location.state.titleFont,
          mhb_id: this.props.location.state.mhb_id,
          mhi_id: this.props.location.state.mhi_id,
        }
      }));
    })
  }

  // 隐藏Modal框
  onClose = key => () => {
    this.setState({
      [key]: false,
    }, () => {
      if (key === 'popupModal') {
        setTimeout(() => {
          this.setState({
            disappearAnimation: true
          })
        }, 300)
      }
    });
  }

  // 点击购物车显示购物车数据
  clickCar = () => {
    const { carDate, popupModal, disappearAnimation } = this.state;

    if (popupModal !== disappearAnimation) {
      if (carDate.length > 0) {
        this.setState({
          popupModal: !this.state.popupModal,
        }, () => {
          const { popupModal } = this.state;

          if (popupModal) {
            this.setState({
              disappearAnimation: false
            })
          } else {
            setTimeout(() => {
              this.setState({
                disappearAnimation: true
              })
            }, 300)
          }
        })
      } else {
        Toast.info('请选购商品', 1)
      }
    }
  }

  // 购物车数据Modal框的头部样式
  popupHeader = () => {
    return (
      <div className={styles.popupHeader}>
        <span>已选菜品</span>
        <span onClick={this.clearCarDate}><img src={clearCar} />清空</span>
      </div>
    )
  }

  // 清空购物车
  clearCarDate = () => {
    const { mealDate, carDate } = this.state;
    carDate.map((array, index) => {
      mealDate.map((arrayMeal, indexMeal) => {
        arrayMeal.info.map((arrayMealChild, indexMealChild) => {
          if (parseInt(array.cdp_cdi_id) === parseInt(arrayMealChild.cdp_cdi_id)) {
            arrayMealChild['count'] = 0;
          }
        })
      })
    })

    this.setState({
      carDate: [],
      mealDate: mealDate,
      popupModal: false,
    }, () => {
      this.mealTypeNumber();
      setTimeout(() => {
        this.setState({
          disappearAnimation: true
        })
      }, 300)
    })
  }

  // 点击结算按钮
  clickPostOrder = () => {
    const { carDate, businessIntroduce } = this.state;
    const { shopBusinessIntroduce } = this.props.orderDinner;

    this.props.dispatch(routerRedux.push({
      pathname: portUrl.indexUrl + '/postOrder',
      state: {
        carDate: carDate,
        shopBusinessIntroduce: shopBusinessIntroduce,
        businessIntroduce: businessIntroduce,
        mhb_bii_id: this.props.location.state.mhb_bii_id,
        titleFont: this.props.location.state.titleFont,
        mhi_id: this.props.location.state.mhi_id,
        mhb_id: this.props.location.state.mhb_id,
      },
    }));
  }

  // 显示更多预定规则
  showMoreIntroduce = () => {
    this.setState({
      moreIntroduceModal: !this.state.moreIntroduceModal,
    })
  }

  // 派送规则Modal框的派送范围
  getPostArea = (obj) => {
    let returnString = '';
    obj.map((array, index) => {
      if (index === obj.length - 1) {
        returnString += array.name;
      } else {
        returnString += array.name + ',';
      }
    })
    return returnString;
  }

  // 计算商品总价格
  getTotalPrice = () => {
    const { carDate } = this.state;
    const { shopBusinessIntroduce } = this.props.orderDinner;
    let totalPrice = parseFloat(0.00);

    carDate.map((array, index) => {
      totalPrice += (parseInt(array.count) * parseFloat(array.cdp_price));
    })

    return totalPrice.toFixed(2);
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

  // 是否显示结算按钮
  balanceButton = () => {
    const { shopBusinessIntroduce } = this.props.orderDinner;
    const { businessIntroduce, carDate } = this.state;
    let showButton;
    let differPrice;

    if (shopBusinessIntroduce) {
      let balancePrice = parseFloat(JSON.parse(shopBusinessIntroduce.mhb_business).delivery_amount);

      if (new Date(businessIntroduce.time.replace(/-/g,"/") + ' ' + businessIntroduce.order_end_time).getTime() < new Date().getTime()) {
        showButton = false;
        differPrice = '已过预订时间';
      } else {
        if (carDate.length <= 0) {
          showButton = false;
          differPrice = '差' + parseFloat(balancePrice - parseFloat(this.getTotalPrice())).toFixed(2) + '元起送';
        } else {
          if (parseFloat(this.getTotalPrice()) >= balancePrice) {
            showButton = true;
          } else {
            showButton = false;
            differPrice = '差' + parseFloat(balancePrice - parseFloat(this.getTotalPrice())).toFixed(2) + '元起送';
          }
        }
      }
    }

    if (showButton) {
      return showButton
    } else {
      return differPrice
    }
  }

  render() {
    const {
      businessIntroduce,
      ballsTarget,
      balls,
      mealCategoryVisible,
      mealCategoryCols,
      mealCategoryDate,
      pickerMealCategory,
      firstEntry,
      mealType,
      mealDate,
      getAllMeal,
      carDate,
      popupModal,
      disappearAnimation,
      moreIntroduceModal,
      IOS10_3,
    } = this.state;

    const { shopBusinessIntroduce } = this.props.orderDinner;
    const { titleFont, mhb_bii_id } = this.props.location.state;

    return (
      <DocumentTitle title={titleFont ? titleFont : '员工订餐'}>
        <div className={styles.orderDinner}>
          <div className={styles.container}>
            {
              mealCategoryDate ? (
                <div className={styles.takeAwayHeader}>
                  <Picker
                    className={classNames({
                      [styles.noneDismiss]: firstEntry
                    })}
                    visible={mealCategoryVisible}
                    cols={mealCategoryCols}
                    data={mealCategoryDate}
                    value={pickerMealCategory}
                    onOk={(item) => {this.pickerOk(item)}}
                    onDismiss={() => this.setState({ mealCategoryVisible: false })}
                  >
                    <div className={styles.headerMeal} onClick={() => this.setState({ mealCategoryVisible: true })}>
                      <span>{pickerMealCategory.length === 2 ? pickerMealCategory[0] : ''}&nbsp;&nbsp;{pickerMealCategory ? pickerMealCategory[1] : ''}&nbsp;</span>
                      {
                        businessIntroduce ? (
                          <img src={mealArrow} />
                        ) : ''
                      }
                    </div>
                  </Picker>
                  {
                    businessIntroduce ? (
                      <div className={styles.headerTime}>
                        <span>{`预定截止 ${businessIntroduce.time} ${businessIntroduce.order_end_time}`}</span>
                        <div onClick={this.showMoreIntroduce}>
                          <img src={moreIntroduce} />
                        </div>
                      </div>
                    ) : ''
                  }
                </div>
              ) : ''
            }

            {
              getAllMeal ? (
                <div className={styles.takeAwayMain}>
                  <div className={classNames({
                    [styles.takeAwayLeft]: true
                  }, {
                    [styles.takeAwayLeftIOS10_3]: IOS10_3
                  })}>
                    {
                      mealType.map((array, index) => {
                        return (
                          <Badge text={array.mealCount} key={index}>
                            <div
                              onClick={() => {this.selectMealType(array)}}
                              className={classNames({
                                [styles.selectMealType]: array.select
                              })}
                            >
                              {array.cti_name}
                            </div>
                          </Badge>
                        )
                      })
                    }
                  </div>
                  <div id="takeAwayRight" className={styles.takeAwayRight}>
                    {
                      mealDate.map((array, index) => {
                        return (
                          <div className={classNames({
                            [styles.mealDateDiv]: true
                          }, {
                            [styles.mealDateDivIOS10_3]: IOS10_3
                          })} key={index}>
                            {
                              array.auchor ? (
                                <p ref={array.auchor}>{array.title}</p>
                              ) : (
                                <p>{array.title}</p>
                              )
                            }
                            {
                              array.info.map((arrayInfo, indexInfo) => {
                                return (
                                  <div className={styles.mealInfoDiv} key={indexInfo}>
                                    <div className={styles.info}>
                                      {
                                        parseInt(arrayInfo.cdp_stock) <= 0 ? (
                                          <div className={styles.foodModal}>已售罄</div>
                                        ) : ''
                                      }
                                      <img src={arrayInfo.cdi_header_img ? JSON.parse(arrayInfo.cdi_header_img).picture_small_network_url : food} />
                                      <div className={styles.text}>
                                        <span>{arrayInfo.cdi_name}</span>
                                        <span></span>
                                        <span>{arrayInfo.cdp_price ? arrayInfo.cdp_price.toFixed(2) : 0}</span>
                                      </div>
                                    </div>
                                    <div className={styles.changeCount}>
                                      {
                                        parseInt(arrayInfo.cdp_stock) > 0 ? (
                                          <div className={styles.addFoodWrap} onClick={this.clickAddGood.bind(null, arrayInfo)}>
                                            <img className={styles.addFood} src={addFood} />
                                          </div>
                                        ) : ''
                                      }
                                      <span className={styles.foodCount}>{parseInt(arrayInfo.count) > 0 ? arrayInfo.count : ''}</span>
                                      {
                                        parseInt(arrayInfo.count) > 0 ? (
                                          <div className={styles.reduceFoodWrap} onClick={this.clickReduceGood.bind(null, arrayInfo)}>
                                            <img className={styles.reduceFood} src={reduceFood} />
                                          </div>
                                        ) : ''
                                      }
                                    </div>
                                  </div>
                                )
                              })
                            }
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              ) : ''
            }
          </div>

          {
            getAllMeal && shopBusinessIntroduce ? (
              <div className={styles.takeAwayFooter}>
                <div className={styles.footerLeft}>
                  <div className={styles.car}>
                    <div className={styles.carWrap} ref={(node) => this.refCar = node} onClick={this.clickCar}>
                      <Badge text={this.goodTotalCount()}>
                        <div className={carDate.length > 0 ? styles.imgDiv : styles.imgDivNOCount}>
                          <img src={carPNG} />
                        </div>
                      </Badge>
                    </div>
                    <div className={styles.price}>
                      {
                        parseFloat(this.getTotalPrice()) === parseFloat(0.00) ? (
                          <span className={styles.noBuyGood}>未选购商品</span>
                        ) : (
                          <span><i>¥</i>{this.getTotalPrice()}</span>
                        )
                      }
                      {
                        shopBusinessIntroduce && parseInt(mhb_bii_id) === 2 ? (
                          JSON.parse(shopBusinessIntroduce.mhb_business).delivery_price && parseFloat(JSON.parse(shopBusinessIntroduce.mhb_business).delivery_price) !== 0 ? (
                            <span>另需{JSON.parse(shopBusinessIntroduce.mhb_business).delivery_price}元配送费</span>
                          ) : ''
                        ) : ''
                      }
                    </div>
                  </div>
                </div>
                {
                  parseInt(mhb_bii_id) === 8 ? (
                    carDate.length > 0 ? (
                      <div onClick={this.clickPostOrder} className={styles.footerRight}>
                        <button>去结算</button>
                      </div>
                    ) : (
                      <div className={classNames({
                        [styles.footerRight]: true
                      }, {
                        [styles.footerRightNoButton]: true
                      })}>
                        <button>去结算</button>
                      </div>
                    )
                  ) : (
                    this.balanceButton() === true ? (
                      <div onClick={this.clickPostOrder} className={styles.footerRight}>
                        <button>去结算</button>
                      </div>
                    ) : (
                      <div className={styles.footerRight}>
                        <div>{this.balanceButton()}</div>
                      </div>
                    )
                  )
                }
              </div>
            ) : ''
          }

          <FlyBall
            changeFlyBallCount={this.completeBall}
            balls={balls}
            target={ballsTarget}
            curvature={0.004}
            speed={300}
          />

          {
            !disappearAnimation ? (
              <div onClick={this.onClose('popupModal')} className={classNames({
                [styles.carModal]: popupModal && !disappearAnimation
              }, {
                [styles.noCarModal]: !popupModal && !disappearAnimation
              })}></div>
            ) : ''
          }

          {
            !disappearAnimation ? (
              <List
                className={classNames({
                  [styles.popupModalList]: popupModal && !disappearAnimation
                }, {
                  [styles.noPopupModalList]: !popupModal && !disappearAnimation
                })}
                renderHeader={this.popupHeader()}
              >
                {
                  carDate.map((array, index) => {
                    return (
                      <List.Item key={index}>
                        <div style={{ width: '70%',display: 'flex' }}>
                          <span style={{ display: 'inline-block',width: '60%',maxWidth: '60%',overflow: 'hidden',textOverflow: 'ellipsis',whiteSpace: 'nowrap' }}>{array.cdi_name}</span>
                          <span style={{ display: 'inline-block',width: '40%',maxWidth: '40%',padding: '0 5px' }}>{array.cdp_price ? array.cdp_price.toFixed(2) : 0}</span>
                        </div>
                        <div style={{ width: '30%',textAlign: 'right' }}>
                          {
                            parseInt(array.count) > 0 ? (
                              <img style={{ marginRight: '10px' }} onClick={this.clickReduceGood.bind(null, array)} src={reduceFood} />
                            ) : ''
                          }
                          <span>{parseInt(array.count) > 0 ? array.count : ''}</span>
                          <img style={{ marginLeft: '10px' }} onClick={this.carClickAddGood.bind(null, array)} src={addFood} />
                        </div>
                      </List.Item>
                    )
                  })
                }
              </List>
            ) : ''
          }

          {
            moreIntroduceModal && shopBusinessIntroduce ? (
              <div className={styles.moreIntroduceModal}>
                <div className={styles.moreIntroduceModalMain}>
                  <div className={styles.takeAwayRule}>
                    <p className={styles.title}>预定规则</p>
                    {
                      JSON.parse(shopBusinessIntroduce.mhb_business).order_meals.map((array, index) => {
                        return (
                          <div key={index} className={styles.content}>
                            <span>{array.mli_name}</span>
                            <div>
                              <p>{array.order_end_time}点前截止预定</p>
                              <p>{array.order_introduce}</p>
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                  {
                    parseInt(mhb_bii_id) === 2 ? (
                      <div className={styles.postRule}>
                        <p className={styles.title}>派送规则</p>
                        <div className={styles.content}>
                          <span>起送费</span>
                          <div>
                            <p>¥{JSON.parse(shopBusinessIntroduce.mhb_business).delivery_amount ? JSON.parse(shopBusinessIntroduce.mhb_business).delivery_amount : 0.00}</p>
                          </div>
                        </div>
                        <div className={styles.content}>
                          <span>派送费</span>
                          <div>
                            <p>¥{JSON.parse(shopBusinessIntroduce.mhb_business).delivery_price ? JSON.parse(shopBusinessIntroduce.mhb_business).delivery_price : 0.00}</p>
                          </div>
                        </div>
                        <div className={styles.content}>
                          <span>派送范围</span>
                          <div>
                            <p>{this.getPostArea(JSON.parse(shopBusinessIntroduce.mhb_business).delivery_address)}</p>
                          </div>
                        </div>
                      </div>
                    ) : ''
                  }
                </div>

                <div onClick={this.onClose('moreIntroduceModal')} className={styles.closeModal}>
                  <img src={closeModal} />
                </div>
              </div>
            ) : ''
          }
        </div>
      </DocumentTitle>
    );
  }
}
