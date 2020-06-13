import React, { useContext } from 'react';
import { Router } from "@reach/router";
import { LoginPage, MainPage, MessagesPage, PortfolioPage, UnauthPage } from '@pages';
import { UserContext } from '@api';

function Routes() {
  const user = useContext(UserContext);
  return (
    user
    ? <Router>
      <MainPage path='/'/>
      <MessagesPage path='messages'/>
      <PortfolioPage path='portfolio'/>
      <UnauthPage path='unauth' />
    </Router>
    : <Router>
      <LoginPage path='/' />
    </Router>
  );
}

export default Routes;