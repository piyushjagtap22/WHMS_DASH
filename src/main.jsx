import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import NotFoundPage from './components/Pages/NotFoundPage.jsx';

import { PersistGate } from 'redux-persist/integration/react';
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
import DashboardValidator from './components/Validators/DashboardValidator.jsx';
import LoginValidator from './components/Validators/LoginValidator.jsx';
import SuperAdminValidator from './components/Validators/SuperAdminValidator.jsx';

import LoginScreen from './components/Pages/LoginScreen.jsx';
// import ImageTesting from './components/Pages/ImageTesting.jsx';
import { createTheme } from '@mui/material/styles';
import Dashboard from './components/Pages/Dashboard.jsx';
import DefaultPage from './components/Pages/DefaultPage.jsx';
import DocumentVerificationScreen from './components/Pages/DocumentVerificationScreen.jsx';
import EmailRegister from './components/Pages/EmailRegister.jsx';
import Layout from './components/Layout.jsx';
import Register from './components/Pages/Register.jsx';
import SuperAdminScreen from './components/Pages/SuperAdminScreen.jsx';
import './index.css';
import store, { persistor } from './store';
import { themeSettings } from './theme';

import EmailRegisterValidator from './components/Validators/EmailRegisterValidator.jsx';
import RegisterValidator from './components/Validators/RegisterValidator.jsx';
import VerifyValidator from './components/Validators/VerifyValidator.jsx';
const theme = createTheme(themeSettings('dark'));

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
      <Route path='/Default' element={<DefaultPage />} />
      {/* <Route path='' element={<Layout />}>
        <Route
          path='/Default'
          element={<DefaultPageValidator component={DefaultPage} />}
        />
      </Route> */}
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
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}></PersistGate>
    {/* <AppInitializer /> */}
    {/* <React.StrictMode> */}
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
    {/* </React.StrictMode> */}
  </Provider>
);
