import React, { Component } from 'react';
import styled from 'styled-components';
import { auth } from '@firebase-api'

const SigninButton = styled.button`

`;

 
class LoginPage extends Component {

  render() {
    return (
      <div>
        <h1>Login Page</h1>
        <SigninButton onClick={event => {
          auth.signInWithEmailAndPassword('aaa', 'aaa')
        }}>Sign In</SigninButton>
      </div>
    );
  }
}
 
export default LoginPage;