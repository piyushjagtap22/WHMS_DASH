import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import NotFoundPage from './components/Pages/NotFoundPage.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { Navigate } from 'react-router-dom';
// import PrivateRoute2 from './components/PrivateRoute2.jsx';
import DashboardValidator from './components/DashboardValidator.jsx';
import LoginValidator from './components/LoginValidator.jsx';
import SuperAdminValidator from './components/SuperAdminValidator.jsx';

import LoginScreen from './components/Pages/LoginScreen.jsx';
// import ImageTesting from './components/Pages/ImageTesting.jsx';
import { createTheme } from '@mui/material/styles';
import Dashboard from './components/Pages/Dashboard.jsx';
import DefaultPage from './components/Pages/DefaultPage.jsx';
import DocumentVerificationScreen from './components/Pages/DocumentVerificationScreen.jsx';
import EmailRegister from './components/Pages/EmailRegister.jsx';
import Layout from './components/Pages/Layout.jsx';
import Register from './components/Pages/Register.jsx';
import SuperAdminScreen from './components/Pages/superAdminScreen.jsx';
import './index.css';
import store from './store.js';
import { themeSettings } from './theme';

// import PrivateRoute3 from './components/PrivateRoute3.jsx';
import EmailRegisterValidator from './components/EmailRegisterValidator.jsx';
import RegisterValidator from './components/RegisterValidator.jsx';
import VerifyValidator from './components/VerifyValidator.jsx';
// import UniqueLayout from './components/Pages/uniqueLayout.jsx';
import GraphByDate from './components/Pages/GraphByDate.jsx';
import TempPage from './components/Pages/TempPage.jsx';
const theme = createTheme(themeSettings('dark'));
//
//Firebase auth Initilialization
// store.dispatch(initializeAuthUser());

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index element={<Navigate to='/register' />} />{' '}
      {/* Redirects root path to /register */}
      <Route
        path='/register'
        element={<RegisterValidator component={Register} />}
      />
      <Route
        path='/verify'
        element={<VerifyValidator component={DocumentVerificationScreen} />}
      />
      <Route path='/GraphByDate' element={<GraphByDate />} />
      <Route path='/Default' element={<DefaultPage />} />
      <Route path='' element={<Layout />}>
        <Route
          path='/dashboard'
          element={<DashboardValidator component={Dashboard} />}
        />
      </Route>
      <Route
        path='/superadmin'
        element={<SuperAdminValidator component={SuperAdminScreen} />}
      />
      <Route
        path='/emailregister'
        element={<EmailRegisterValidator component={EmailRegister} />}
      />
      <Route
        path='/login'
        element={<LoginValidator component={LoginScreen} />}
      />
      <Route path='*' element={<NotFoundPage />} />
      <Route path='/test' element={<TempPage />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    {/* <AppInitializer /> */}
    {/* <React.StrictMode> */}
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
    {/* </React.StrictMode> */}
  </Provider>
);
