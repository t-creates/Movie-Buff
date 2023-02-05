import React from 'react';
// This is what connects our React App to our Public/index.html
import ReactDOM from 'react-dom/client';

// React Router is a fully-featured client and server-side routing library for React, a JavaScript library for building user interfaces.
import { BrowserRouter } from 'react-router-dom';

// React-Redux wraps are app to provide access to the store
import { Provider } from 'react-redux';
import store from './app/store';

// All of the componets will get passed through using the "App" and then rendered to the index.html file
import App from './components/App';
import './index.css';
import ToggleColorModeProvider from './utils/ToggleColorMode';

// Passes our react app and fetches the document (root element of our app)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <ToggleColorModeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ToggleColorModeProvider>
  </Provider>,
);
