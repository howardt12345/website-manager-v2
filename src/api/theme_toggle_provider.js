import React, { Component, createContext } from 'react';
import { createMuiTheme } from '@material-ui/core/styles';
import { colors_light, colors_dark } from '@styles';
import CssBaseline from "@material-ui/core/CssBaseline";

const ThemeToggleContext = createContext();
const { Provider, Consumer } = ThemeToggleContext;


export const lightTheme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: colors_light.accent,
    },
    background: {
      default: colors_light.background,
      paper: colors_light.background,
    },
    text: {
      primary: colors_light.textPrimary,
      secondary: colors_light.textSecondary,
    },
  },
});

export const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: colors_dark.accent,
    },
    background: {
      default: colors_dark.background,
      paper: colors_dark.background,
    },
    text: {
      primary: colors_dark.textPrimary,
      secondary: colors_dark.textSecondary,
    },
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