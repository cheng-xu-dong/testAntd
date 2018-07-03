import React, { Component } from 'react';
import Parabola from './parabola'
import styles from './ball.less';

class Ball extends Component {
  state = {
    ballsTarget: '',
    balls: [],
  }

  componentDidMount() {
    const { curvature, speed, changeFlyBallCount, id, target } = this.props;
    let options = {
      curvature: curvature,
      speed: speed,
      complete: changeFlyBallCount.bind(this, id)
    }
    this.parabola = new Parabola(this.container, target, options)
    this.parabola.run()
  }

  componentWillUnmount() {
    this.parabola.stop()
  }

  render() {
    const { x=0, y=0 } = this.props;
    return (
      <div
        className={styles.flyBall}
        ref={node => this.container = node}
        style={{ top: y, left: x }}
      />
    );
  }
}

class FlyBall extends Component {
  constructor(props) {
    super(props)

    this.state = {
      balls: props.balls
    }
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      balls: newProps.balls
    })
  }

  createFlyBall = (item, index) => {
    const { target, curvature, speed, changeFlyBallCount } = this.props;
    return (
      <Ball
        {...item.position}
        target={target}
        key={item.id}
        id={item.id}
        curvature={curvature}
        speed={speed}
        changeFlyBallCount={changeFlyBallCount}
      />
    )
  }

  render() {
    let balls = this.state.balls;
    return (
      <div className="ballWrapper">
        {
          balls.map(this.createFlyBall)
        }
      </div>
    )
  }
}

FlyBall.defaultProps = {
  curvature: 0.04,
  speed: 120
}

export default FlyBall
