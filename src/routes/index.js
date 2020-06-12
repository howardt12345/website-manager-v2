import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { LoginPage, MainPage, PortfolioPage, MessagesPage } from '@pages';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={LoginPage} />
      <Route path="/main" component={MainPage} isPrivate />
      <Route path="/portfolio" component={PortfolioPage} isPrivate />
      <Route path="/messages" component={MessagesPage} isPrivate />
      {/* redirect user to SignIn page if route does not exist and user is not authenticated */}
      <Route component={LoginPage} />
    </Switch>
  );
}