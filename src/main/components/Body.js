import React from 'react';

import './Body.less';

export class Body extends React.PureComponent {
  render() {
    return (
      <div className={'body-container'}>
        <p className={'content-text'}>
          Hello, if you want to learn more, click <a className={'href-text'} href={'https://github.com/howardt12345/electron-react-template'} target={'blank'}>here</a>.
        </p>
      </div>
    );
  }
}