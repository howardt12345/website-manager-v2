import React from "react";
import Routes from "@routes";
import { UserProvider, ThemeToggleProvider } from "@api";

function App() {
  return (
    <ThemeToggleProvider>
      <UserProvider>
        <Routes />
      </UserProvider>
    </ThemeToggleProvider>
  );
}

export default App;