import React from 'react';
import styles from './styles.css';

const AppHeader = ({ title }) => {
  return (
    <header className={styles.AppHeader}>
      {title}
    </header>
  );
}

AppHeader.propTypes = {
  title: React.PropTypes.string.isRequired
};

export default AppHeader;
