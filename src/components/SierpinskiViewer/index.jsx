import React, { Component } from 'react';
import styles from './styles.css';

import Sierpinski from './Sierpinski';
import Renderer from './Renderer';

class SierpinskiViewer extends Component {
  constructor() {
    super();

    this.setSize = this.setSize.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseWheel = this.handleMouseWheel.bind(this);
  }

  componentDidMount() {
    this.canvas = document.createElement('canvas');
    this.setSize();
    this.node.appendChild(this.canvas);

    const triangleWidth = Math.min(this.canvas.width, this.canvas.height) * 0.8;
    const triangleHeight = triangleWidth * Math.sin((2 * Math.PI) / 3);

    const x0 = this.canvas.width / 2;
    const y0 = (this.canvas.height - triangleHeight) / 2;
    const x1 = this.canvas.width - ((this.canvas.width - triangleWidth) / 2);
    const y1 = this.canvas.height - ((this.canvas.height - triangleHeight) / 2);
    const x2 = (this.canvas.width - triangleWidth) / 2;
    const y2 = this.canvas.height - ((this.canvas.height - triangleHeight) / 2);

    const triangle = new Sierpinski(x0, y0, x1, y1, x2, y2, this.props.depth);

    const maxScale = 130;
    this.renderer = new Renderer(this.canvas, maxScale);

    this.renderer.add(triangle);
    this.renderer.render();

    this.node.addEventListener('wheel', this.handleMouseWheel);
    window.addEventListener('resize', this.setSize);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.depth !== this.props.depth;
  }

  componentWillUnmount() {
    this.node.removeEventListener('wheel', this.handleMouseWheel);
    window.removeEventListener('resize', this.setSize);
  }

  setSize() {
    const nodeBoundingBox = this.node.getBoundingClientRect();
    this.canvas.width = nodeBoundingBox.width;
    this.canvas.height = nodeBoundingBox.height;
  }

  handleMouseWheel(evt) {
    evt.preventDefault();
    this.renderer.zoom(-evt.deltaY / 1000, evt.offsetX, evt.offsetY);
  }

  handleMouseDown(evt) {
    this.dragging = true;
    this.mouseStartX = evt.nativeEvent.screenX;
    this.mouseStartY = evt.nativeEvent.screenY;
    this.node.classList.add('dragging');
  }

  handleMouseMove(evt) {
    if (this.dragging) {
      this.renderer.panXY(
        evt.nativeEvent.screenX - this.mouseStartX,
        evt.nativeEvent.screenY - this.mouseStartY
      );
      this.mouseStartX = evt.nativeEvent.screenX;
      this.mouseStartY = evt.nativeEvent.screenY;
    }
  }

  handleMouseUp() {
    this.dragging = false;
    this.node.classList.remove('dragging');
  }

  render() {
    return (
      <div
        className={styles.SierpinskiViewer}
        ref={(ref) => { this.node = ref; }}
        onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.handleMouseUp}
      />
    );
  }
}

SierpinskiViewer.propTypes = {
  depth: React.PropTypes.number
};

SierpinskiViewer.defaultProps = {
  depth: 5
};

export default SierpinskiViewer;
