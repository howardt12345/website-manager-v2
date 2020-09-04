import React from 'react';
import { MainConsumer, ThemeToggleConsumer } from '@api';
import { MainPage, PortfolioPage, MessagesPage } from '@pages/main'
import { ThemeProvider } from '@material-ui/core/styles';

function MainRoutes() {
  return (
    <ThemeToggleConsumer>
      {themeContext => (
        <ThemeProvider theme={themeContext.theme}>
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