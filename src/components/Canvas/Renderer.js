class Renderer {
  constructor(canvas, maxScale = 50) {
    this.maxScale = maxScale;

    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.reset();

    this.renderables = [];

    this.isInView = this.isInView.bind(this);
    this.renderTriangle = this.renderTriangle.bind(this);
    this.renderTriangles = this.renderTriangles.bind(this);
    this.render = this.render.bind(this);
  }

  reset() {
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  add(item) {
    item.baseDepth = 5;
    item.depth = item.baseDepth;
    item.minWidth = Math.ceil((item.width / ((2 ** item.baseDepth) * 2)));
    this.renderables.push(item);
  }

  setScale(scale) {
    if (scale > 1 && scale <= this.maxScale) {
      this.scale = scale;
    } else if (scale > this.maxScale) {
      this.scale = this.maxScale;
    } else {
      this.scale = 1;
    }
    window.requestAnimationFrame(this.render);
  }

  setOffset(offsetX, offsetY) {
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    window.requestAnimationFrame(this.render);
  }

  zoom(delta = 0.2) {
    this.setScale(this.scale + (delta * this.scale));
  }

  panXY(deltaX = 0, deltaY = 0) {
    this.setOffset(this.offsetX + (deltaX / this.scale), this.offsetY + (deltaY / this.scale));
  }

  isInView(x, y, triangleWidth) {
    const posX = this.scale * (this.offsetX + x);
    const posY = this.scale * (this.offsetY + y);
    return (
      (
        posX >= -triangleWidth
        && posX <= this.canvas.width + triangleWidth
      )
      && (
        posY >= -triangleWidth
        && posY <= this.canvas.height + triangleWidth
      )
    );
  }

  renderTriangle(x0, y0, x1, y1, x2, y2) {
    const triangleWidth = Math.ceil(this.scale * (x1 - x2));

    if (this.isInView(x0, y0, triangleWidth)) {
      this.context.beginPath();
      this.context.moveTo(this.scale * (this.offsetX + x0), this.scale * (this.offsetY + y0));
      this.context.lineTo(this.scale * (this.offsetX + x1), this.scale * (this.offsetY + y1));
      this.context.lineTo(this.scale * (this.offsetX + x2), this.scale * (this.offsetY + y2));
      this.context.fill();
    }
  }

  renderTriangles(triangles) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < triangles.length; i += 6) {
      this.renderTriangle(
        triangles[i],
        triangles[i + 1],
        triangles[i + 2],
        triangles[i + 3],
        triangles[i + 4],
        triangles[i + 5]
      );
    }
  }

  render() {
    this.renderables.forEach((item) => {
      let triangles = item.getTriangles(item.depth);

      // console.log(`item.minWidth: ${item.minWidth}`);

      const minX = triangles[4];
      const maxX = triangles[2];
      const triangleWidth = Math.ceil(this.scale * Math.abs(maxX - minX));

      // console.log(`triangleWidth: ${triangleWidth}`);

      if (triangleWidth < item.minWidth) {
        item.depth -= 1;
        console.log(`Current depth: ${item.depth}`);
      } else if (triangleWidth > item.minWidth * 2) {
        item.depth += 1;
        console.log(`Current depth: ${item.depth}`);
      }

      // console.log(`Scale: ${this.scale}`);

      triangles = item.getTriangles(item.depth);

      this.renderTriangles(triangles);
    });
  }
}

export default Renderer;
