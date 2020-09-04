import React, { Component, createContext } from 'react';
import { createMuiTheme } from '@material-ui/core/styles';
import { colors_light, colors_dark, GlobalStyle } from '@styles';


const ThemeToggleContext = createContext();
const { Provider, Consumer } = ThemeToggleContext;


export const lightTheme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: colors_light.accent
    },
  },
  typography: {
    allVariants: {
      color: colors_light.textPrimary
    }
  },
});

export const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: colors_dark.accent,
    },
  },
  typography: {
    allVariants: {
      color: colors_dark.textPrimary
    }
  },
});

class ThemeToggleProvider extends Component {
  state = {
    dark: false,
    theme: lightTheme,
  };

  toggleTheme = () => {
    this.setState(prevState => 
      ({ 
        dark: !prevState.dark,
        theme: !prevState.dark ? darkTheme : lightTheme,
      })
    );
    console.log(this.state.dark);
  }

  render() {
    const { dark, theme } = this.state;
    const { toggleTheme } = this;
    
    return (
      <Provider 
      value={{ 
        dark,
        theme, 
        toggleTheme 
      }}
      >
        {this.props.children}
      </Provider>
    );
  }
}

export { ThemeToggleContext, ThemeToggleProvider, Consumer as ThemeToggleConsumer };