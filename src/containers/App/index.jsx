import React from 'react';
import styles from './styles.css';

import AppHeader from '../../components/AppHeader';
import SierpinskiViewer from '../../components/SierpinskiViewer';

const App = () => (
  <div className={styles.layout}>
    <AppHeader title="Sierpinski Triangle Explorer" />
    <main>
      <SierpinskiViewer depth={5} maxScale={130} />
    </main>
  </div>
);

export default App;
