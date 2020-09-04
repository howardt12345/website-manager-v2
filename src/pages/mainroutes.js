import React from 'react';
import { MainConsumer, ThemeToggleConsumer } from '@api';
import { MainPage, PortfolioPage, MessagesPage } from '@pages/main'
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from "@material-ui/core/CssBaseline";

function MainRoutes() {
  return (
    <ThemeToggleConsumer>
      {themeContext => (
        <ThemeProvider theme={themeContext.theme}>
          <CssBaseline />
          <MainConsumer>
            {context => {
              switch(context.page) {
                case 'index':
                  console.log('index');
                  return (<MainPage />);
                case 'portfolio':
                  console.log('portfolio');
                  return (<PortfolioPage />);
                case 'messages':
                  console.log('messages');
                  return (<MessagesPage />);
                default:
                  console.log('default');
                  return (<MainPage />);
              }
            }}
          </MainConsumer>
        </ThemeProvider>
      )}
    </ThemeToggleConsumer>
  );
}

export default MainRoutes;