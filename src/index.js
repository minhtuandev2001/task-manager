import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import { BrowserRouter } from "react-router-dom"
import { AuthoProvider } from './context/authContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SocketProvider } from './context/socketContext';
import { MessageProvider } from './context/messageNotiContext';
import { SideBarProvider } from './context/sideBarContext';
import { DarkModeProvider } from './context/darkModeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <AuthoProvider>
      <SocketProvider>
        <MessageProvider>
          <DarkModeProvider>
            <SideBarProvider>
              <App />
            </SideBarProvider>
          </DarkModeProvider>
        </MessageProvider>
      </SocketProvider>
    </AuthoProvider>
    <ToastContainer />
  </BrowserRouter>
  // </React.StrictMode>
);

