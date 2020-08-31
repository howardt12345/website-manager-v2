import React from 'react';

import { Body, Header } from '@components';

export class App extends React.PureComponent {
  render() {
    return (
      <div style={styles.container}>
        <Header/>
        <Body/>
      </div>
    );
  }
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100vw',
    height: '100vh'
  }
}