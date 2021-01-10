# Website Manager V2

This is the 2nd iteration of the website manager for [my personal website](https://howardt12345.com). This project is a React app running in Electron. It uses Material UI components and Styled Components. The Portfolio page uses Cloud Firestore as its database, and the Portfolio Manager was ported from Dart and adapted from website v1 to ensure backwards compatibility. 

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Installation & Setup

1. Installing Electron:

   ```sh
   npm install -g electron
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Start the development server:

   ```sh
   npm run electron-dev
   ```
   The program should now be running in a separate electron app!

## Building a Production build

1. Generate a production build:

   ```sh
   npm run electron-build
   ```

   The production build should now be found in /dist. 