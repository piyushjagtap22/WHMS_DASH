import React, { useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import HomeScreen from './components/Pages/HomeScreen.jsx';
import LoginScreen from './components/Pages/LoginScreen.jsx';
// import ImageTesting from './components/Pages/ImageTesting.jsx';
import ProfileScreen from './components/Pages/ProfileScreen.jsx';
import RegisterScreen from './components/Pages/RegisterScreen.jsx';
import VerifyScreen from './components/Pages/VerifyScreen.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import AuthValidations from './components/AuthValidations.jsx';
import AdminScreen from './components/Pages/adminScreen.jsx';
import Dashboard from './components/Pages/Dashboard.jsx';
import Layout from './components/Pages/Layout.jsx';
import SuperAdminScreen from './components/Pages/superAdminScreen.jsx';
import InitialUserScreen from './components/Pages/initialUserScreen.jsx';
import UserScreen from './components/Pages/userScreen.jsx';
import './index.css';
import store from './store.js';
import { createTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { themeSettings } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import DefaultPage from './components/Pages/DefaultPage.jsx';
import Register from './components/Pages/Register.jsx';
import EmailRegister from './components/Pages/EmailRegister.jsx';
import DocumentVerificationScreen from './components/Pages/DocumentVerificationScreen.jsx';
import { initializeAuthUser } from './slices/authSlice';

import Tabsnavigation from './components/Pages/Tabsnavigation.tsx';
import UniqueLayout from './components/Pages/uniqueLayout.jsx';

const theme = createTheme(themeSettings('dark'));
//
//Firebase auth Initilialization 
store.dispatch(initializeAuthUser());


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='/unique' element={<UniqueLayout />} />
      <Route path='/tabbar' element={<Tabsnavigation />} />
      <Route path='' element={<AuthValidations />}>
 
        <Route path='/login' element={<LoginScreen />} />
        <Route path='/register' element={<Register />} />
        <Route path='/emailregister' element={<EmailRegister />} />
        <Route path='/verify' element={<DocumentVerificationScreen />} />
        <Route path='' element={<PrivateRoute />}>
          <Route path='' element={<Layout />}>
            <Route path='/profile' element={<ProfileScreen />} />
            <Route path='/home' element={<HomeScreen />} />
            <Route path='/admin' element={<AdminScreen />} />
            <Route path='/superadmin' element={<SuperAdminScreen />} />
            <Route path='/user' element={<UserScreen />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/imagetesting' element={<ImageTesting />} />
            <Route path='/Default' element={<DefaultPage />} />
            <Route path='/newuser' element={<InitialUserScreen />} />
          </Route>
        </Route>
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
);
