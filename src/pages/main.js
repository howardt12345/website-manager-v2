import React, { Component } from 'react';
import styled from 'styled-components';
import { auth } from '@firebase-api'
import { mixins, Main, Title } from '@styles';

const StyledContainer = styled(Main)`
  ${mixins.flexCenter};
  flex-direction: column;
`;

const SigninButton = styled.button`
  ${mixins.bigButton}
  position: absolute;
  bottom: 20px;
`;

 
class MainPage extends Component {

  render() {
    return (
      <StyledContainer>
        <Title>Website Manager</Title>
        <h4>Main Page</h4>
        <SigninButton onClick={() => {
          auth.signOut();
        }}>Sign Out</SigninButton>
      </StyledContainer>
    );
  }
}
 
export default MainPage;