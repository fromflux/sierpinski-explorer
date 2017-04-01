import React, { Component } from 'react';
import styles from './styles.css';

import AppHeader from '../../components/AppHeader';
import Canvas from '../../components/Canvas';

class App extends Component {
  constructor() {
    super();
    this.state = {
      scale: 1
    };
  }

  render() {
    return (
      <div className={styles.layout}>
        <AppHeader title="Sierpinski Triangle Explorer" />
        <main>
          <Canvas />
        </main>
      </div>
    );
  }
}

export default App;
