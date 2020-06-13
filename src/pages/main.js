import React from 'react';
import styled from 'styled-components';
import { auth } from '@firebase-api';
 
const MainPage = () => {
  return (
    <div>
      <h1>Main Page</h1>
      <button onClick={event => {
        auth.signOut();
      }}>Sign Out</button>
    </div>
  );
}
 
export default MainPage;