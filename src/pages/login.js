import React, { Component } from 'react';
import styled from 'styled-components';
import { auth } from '@firebase-api'
import { mixins, Main, Title, theme } from '@styles';
import { vars } from '@vars';

const { email, pass } = vars;
const { colors, fonts, fontSizes } = theme;

const StyledContainer = styled(Main)`
  ${mixins.flexCenter};
  flex-direction: column;
`;

const SigninButton = styled.button`
  ${mixins.bigButton}
  margin-top: 20px;
`;


class LoginPage extends Component {

  render() {
    return (
      <StyledContainer>
        <Title>Website Manager</Title>
        <h4>Login Page</h4>
        <SigninButton onClick={() => {
          auth.signInWithEmailAndPassword(email, pass)
        }}>Sign In</SigninButton>
      </StyledContainer>
    );
  }
}
 
export default LoginPage;