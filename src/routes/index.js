import React, { useContext } from 'react';
import { LoginPage, MainRoutes } from '@pages';
import { UserContext, MainProvider, ThemeToggleConsumer } from '@api';
import { ThemeProvider } from '@material-ui/core/styles';

function Routes() {
  const user = useContext(UserContext);
  return (
    <ThemeToggleConsumer>
      {themeContext => (
        <ThemeProvider theme={themeContext.theme}>
          {user 
            ? <MainProvider value={'index'}>
                <MainRoutes />
              </MainProvider> 
            : <LoginPage />
          }
        </ThemeProvider>
      )}
    </ThemeToggleConsumer>
  );
}

export default Routes;