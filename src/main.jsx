import React from 'react';
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
import ProfileScreen from './components/Pages/ProfileScreen.jsx';
import RegisterScreen from './components/Pages/RegisterScreen.jsx';
import VerifyScreen from './components/Pages/VerifyScreen.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import AdminScreen from './components/Pages/adminScreen.jsx';
import Dashboard from './components/Pages/dashboard.jsx';
import Layout from './components/Pages/Layout.jsx';
import SuperAdminScreen from './components/Pages/superAdminScreen.jsx';
import initialUserScreen from './components/Pages/initialUserScreen.jsx';
import UserScreen from './components/Pages/UserScreen.jsx';
import './index.css';
import store from './store.js';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='' element={<Layout/>}>
        <Route path='/login' element={<LoginScreen />} />
        <Route path='/register' element={<RegisterScreen />} />{' '}
        <Route path='/verify' element={<VerifyScreen />} />
        <Route path='' element={<PrivateRoute />}>
        <Route path='/profile' element={<ProfileScreen />} />
        <Route path='/home' element={<HomeScreen />} />
        <Route path='/admin' element={<AdminScreen />} />
        <Route path='/superadmin' element={<SuperAdminScreen />} />
        <Route path='/user' element={<UserScreen />} />
          <Route path='/dashboard' element={<Dashboard/>}/>
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
