import { Component } from 'react';
import Hammer from 'react-hammerjs';
import DislikeIcon from '@assets/icons/dislikeIcon';
import LikeIcon from '@assets/icons/likeIcon';
export default class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classList: ['card_container'],
    };
  }

  componentDidMount() { }

  onPan(event) {
    if (this.props.isSwipeEnabled !== false) {
      if (
        (this.props.isLeftSwipeEnabled !== false && event.deltaX <= 0) ||
        (this.props.isRightSwipeEnabled !== false && event.deltaX >= 0)
      ) {
        this.state.classList.push('moving');
        if (event.deltaX === 0) return;
        if (event.center.x === 0 && event.center.y === 0) return;
        var xMulti = event.deltaX * 0.03;
        var yMulti = event.deltaY / 80;
        var rotate = xMulti * yMulti;
        event.target.style.transform =
          'translate(' +
          event.deltaX +
          'px, ' +
          event.deltaY +
          'px) rotate(' +
          rotate +
          'deg)';
      }
    }
  }

  onPanEnd(event) {
    if (this.props.isSwipeEnabled !== false) {
      if (
        (this.props.isLeftSwipeEnabled !== false && event.deltaX <= 0) ||
        (this.props.isRightSwipeEnabled !== false && event.deltaX >= 0)
      ) {
        var newClass = this.state.classList.filter((s) => s !== 'moving');
        this.setState({ classList: newClass });
        var moveOutWidth = document.body.clientWidth;
        var keep = Math.abs(event.deltaX) < 100; // reduce the width to 100 (from 300) to acommodate mobile screens
        event.target.classList.toggle('removed', !keep);
        if (keep) {
          event.target.style.transform = '';
        } else {
          var endX = Math.max(
            Math.abs(event.velocityX) * moveOutWidth,
            moveOutWidth
          );
          var toX = event.deltaX > 0 ? endX : -endX;
          var endY = Math.abs(event.velocityY) * moveOutWidth;
          var toY = event.deltaY > 0 ? endY : -endY;
          var xMulti = event.deltaX * 0.03;
          var yMulti = event.deltaY / 80;
          var rotate = xMulti * yMulti;
          event.target.style.transform =
            'translate(' +
            toX +
            'px, ' +
            (toY + event.deltaY) +
            'px) rotate(' +
            rotate +
            'deg)';
          // DO SWIPE ACTIONS
          this.props.superOnSwipe();
          if (this.props.onSwipe) this.props.onSwipe(this.props.data);
          if (toX < 0 && this.props.onSwipeLeft) {
            this.props.onSwipeLeft(this.props.data);
          } else if (this.props.onSwipeRight) {
            this.props.onSwipeRight(this.props.data);
          }
        }
      }
    }
  }

  onDoubleTap() {
    if (this.props.onDoubleTap) this.props.onDoubleTap(this.props.data);
  }

  render() {
    return (
      <Hammer
        onPan={this.onPan.bind(this)}
        onPanEnd={this.onPanEnd.bind(this)}
        onDoubleTap={this.onDoubleTap.bind(this)}
      >
        <div
          className={this.state.classList.join(' ')}
          style={this.props.style}
        >
          <div className="flex flex-col justify-end max-w-md h-full p-6 dark:bg-gray-50 dark:text-gray-800 select-none pointer-events-none">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Leroy Jenkins</h2>
              <span className="block pb-2 text-sm dark:text-gray-600">
                CTO of Company Inc.
              </span>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit,
                eligendi dolorum sequi illum qui unde aspernatur non deserunt.
              </p>
            </div>
            <div className="flex w-full justify-between items-center p-4">
              <div>
                <LikeIcon width="130" height="150" />
              </div>
              <div>
                <DislikeIcon width="130" height="150" />
              </div>
            </div>
          </div>
        </div>
      </Hammer >
    );
  }
}
