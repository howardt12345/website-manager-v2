import React, { useContext } from 'react';
import { LoginPage, MainRoutes } from '@pages';
import { UserContext, MainProvider, ThemeToggleConsumer } from '@api';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from "@material-ui/core/CssBaseline";

function Routes() {
  const user = useContext(UserContext);
  return (
    <ThemeToggleConsumer>
      {themeContext => (
        <ThemeProvider theme={themeContext.theme}>
          <CssBaseline />
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