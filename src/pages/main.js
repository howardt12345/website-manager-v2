import React, { Component } from 'react';
import styled from 'styled-components';
import { auth } from '@firebase-api'
import { mixins, Main } from '@styles';

const StyledContainer = styled(Main)`
  ${mixins.flexCenter};
  flex-direction: column;
`;

const SigninButton = styled.button`
  ${mixins.bigButton}
`;

 
class MainPage extends Component {

  render() {
    return (
      <StyledContainer>
        <h1>Website Manager</h1>
        <h4>Main Page</h4>
        <SigninButton onClick={() => {
          auth.signOut();
        }}>Sign Out</SigninButton>
      </StyledContainer>
    );
  }
}
 
export default MainPage;