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
  }

  setOffset(offsetX, offsetY) {
    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }

  zoom(delta, transformX, transformY) {
    const scaledDelta = delta * this.scale;
    const newScale = this.scale + scaledDelta;

    if (newScale >= 1 && newScale <= this.maxScale) {
      const K = (this.scale * this.scale) + (this.scale * scaledDelta);

      this.setOffset(
        this.offsetX - ((transformX * scaledDelta) / K),
        this.offsetY - ((transformY * scaledDelta) / K)
      );

      this.setScale(newScale);
    }
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
        && posX <= (this.canvas.width)
      )
      && (
        posY >= -triangleWidth
        && posY <= (this.canvas.height)
      )
    );
  }

  renderTriangle(x0, y0, x1, y1, x2, y2, triangleWidth) {
    if (this.isInView(x0, y0, triangleWidth)) {
      this.countRendered += 1;
      this.context.beginPath();
      this.context.moveTo(x0, y0);
      this.context.lineTo(x1, y1);
      this.context.lineTo(x2, y2);
      this.context.fill();
      this.rendered += 1;
    }
  }

  renderTriangles(vertices, triangleWidth) {
    for (let i = 0; i < vertices.length; i += 6) {
      this.renderTriangle(
        vertices[i],
        vertices[i + 1],
        vertices[i + 2],
        vertices[i + 3],
        vertices[i + 4],
        vertices[i + 5],
        triangleWidth
      );
    }
  }

  render() {
    this.renderables.forEach((triangle) => {
      let vertices = triangle.getVertices(triangle.depth);

      const minX = vertices[4];
      const maxX = vertices[2];
      const triangleWidth = Math.ceil(this.scale * Math.abs(maxX - minX));

      if (triangleWidth < triangle.minWidth) {
        triangle.setDepth(triangle.depth - 1);
      } else if (triangleWidth > triangle.minWidth * 2) {
        triangle.setDepth(triangle.depth + 1);
      }

      vertices = triangle.getVertices(triangle.depth);
      this.countRendered = 0;

      this.context.save();
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.scale(this.scale, this.scale);
      this.context.translate(this.offsetX, this.offsetY);
      // this.context.setTransform(this.scale, 0, 0, this.scale, this.offsetX, this.offsetY);
      this.renderTriangles(vertices, triangleWidth);
      this.context.restore();

      // console.log('this.countRendered', this.countRendered);

      window.requestAnimationFrame(this.render);
    });
  }
}

export default Renderer;
