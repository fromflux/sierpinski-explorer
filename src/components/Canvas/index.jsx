import React, { Component } from 'react';
import styles from './styles.css';

import Sierpinski from './Sierpinski';
import Renderer from './Renderer';

class Canvas extends Component {
  constructor() {
    super();

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseWheel = this.handleMouseWheel.bind(this);
  }

  componentDidMount() {
    const canvas = document.createElement('canvas');
    const nodeBoundingBox = this.node.getBoundingClientRect();
    canvas.width = nodeBoundingBox.width;
    canvas.height = nodeBoundingBox.height;
    this.node.appendChild(canvas);

    const triangleWidth = Math.min(canvas.width, canvas.height) * 0.8;
    const triangleHeight = triangleWidth * Math.sin((2 * Math.PI) / 3);

    const x0 = canvas.width / 2;
    const y0 = (canvas.height - triangleHeight) / 2;
    const x1 = canvas.width - ((canvas.width - triangleWidth) / 2);
    const y1 = canvas.height - ((canvas.height - triangleHeight) / 2);
    const x2 = (canvas.width - triangleWidth) / 2;
    const y2 = canvas.height - ((canvas.height - triangleHeight) / 2);

    const triangle = new Sierpinski(x0, y0, x1, y1, x2, y2);

    const maxScale = 50;
    this.renderer = new Renderer(canvas, maxScale);

    this.renderer.add(triangle);
    this.renderer.render();

    this.node.addEventListener('mousewheel', this.handleMouseWheel);
  }

  componentWillUnmount() {
    this.node.removeEventListener('mousewheel', this.handleMouseWheel);
  }

  handleMouseWheel(evt) {
    evt.preventDefault();
    this.renderer.zoom(-evt.deltaY / 1000);
  }

  handleMouseDown(evt) {
    this.dragging = true;
    this.mouseStartX = evt.nativeEvent.screenX;
    this.mouseStartY = evt.nativeEvent.screenY;
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
  }

  render() {
    return (
      <div
        className={styles.Canvas}
        ref={(ref) => { this.node = ref; }}
        onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.handleMouseUp}
      />
    );
  }
}

export default Canvas;
