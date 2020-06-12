import React from 'react';
import styled from 'styled-components';
import { signInWithGoogle } from '@firebase-api'

const SigninButton = styled.button`

`;

 
const LoginPage = () => {
  return (
    <div>
      <h1>Login Page</h1>
      <SigninButton onClick={signInWithGoogle}>Sign In</SigninButton>
    </div>
  );
}
 
export default LoginPage;