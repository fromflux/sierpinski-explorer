class Sierpinski {
  constructor(x0, y0, x1, y1, x2, y2, baseDepth) {
    this.width = Math.max(x0, x1, x2) - Math.min(x0, x1, x2);
    this.baseDepth = baseDepth;
    this.depth = this.baseDepth;
    this.minWidth = Math.ceil((this.width / ((2 ** this.baseDepth) * 2)));
    this.layers = [new Float32Array(Sierpinski.divideTriangle(x0, y0, x1, y1, x2, y2))];
  }

  getVertices(depth = this.layers.length - 1) {
    if (depth > this.layers.length - 1) {
      while (this.layers.length - 1 < depth) {
        this.generateNextLayer();
      }
    }
    return this.layers[depth];
  }

  setDepth(depth = this.baseDepth) {
    if (depth > this.layers.length - 1) {
      while (this.layers.length - 1 < depth) {
        this.generateNextLayer();
      }
    }
    this.depth = depth;
  }

  generateNextLayer() {
    const t0 = performance.now();

    const currentLayer = this.layers[this.layers.length - 1];
    const nextLayer = new Float32Array(currentLayer.length * 3);

    for (let i = 0; i < currentLayer.length; i += 6) {
      nextLayer.set(
        Sierpinski.divideTriangle(
          currentLayer[i],
          currentLayer[i + 1],
          currentLayer[i + 2],
          currentLayer[i + 3],
          currentLayer[i + 4],
          currentLayer[i + 5]
        )
        , i * 3
      );
    }

    this.layers.push(nextLayer);

    const t1 = performance.now();
    console.log(`Layer ${this.layers.length - 1} took ${(t1 - t0)} milliseconds.Generated ${this.layers[this.layers.length - 1].length / 6} triangles.`);
  }

  static divideTriangle(x0, y0, x1, y1, x2, y2) {
    const x01 = (x0 + x1) / 2;
    const y01 = (y0 + y1) / 2;
    const x02 = (x0 + x2) / 2;
    const y02 = (y0 + y2) / 2;
    const x12 = (x1 + x2) / 2;
    const y12 = (y1 + y2) / 2;

    return Float32Array.from([
      x0, y0,
      x01, y01,
      x02, y02,
      x01, y01,
      x1, y1,
      x12, y12,
      x02, y02,
      x12, y12,
      x2, y2]
    );
  }
}

export default Sierpinski;
