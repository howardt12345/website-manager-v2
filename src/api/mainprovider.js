import React, { Component, createContext } from "react";

const MainContext = createContext();
const { Provider, Consumer } = MainContext;

const pages = ['index', 'portfolio', 'messages'];

class MainProvider extends Component {
  state = {
    page: 'index',
  };

  setPage = (nextPage) => {
    if(pages.includes(nextPage)) {
      this.setState({
        page: nextPage
      });
    } else {
      console.log(`${nextPage} is not a valid page.`);
    }
  }

  render() {
    const { page } = this.state;
    const { setPage } = this;
    
    return (
      <Provider value={{ page, setPage }}>
        {this.props.children}
      </Provider>
    );
  }
}

export { MainProvider, Consumer as MainConsumer, MainContext };