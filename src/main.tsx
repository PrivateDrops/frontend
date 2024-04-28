import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Providers } from './Providers.tsx';
import LandingPage from './pages/Landing.tsx';
import UploadPage from './pages/Upload.tsx';
import MediaPage from './pages/Media.tsx';
import ProfilePage from './pages/Profile.tsx';
import LoginPage from './pages/Login.tsx';
import ViewPage from './pages/View.tsx';
import InterceptLogin from './pages/InterceptLogin.tsx';
import InterceptPayment from './pages/InterceptPayment.tsx';
import './index.css';
import ErrorPage from './pages/Error.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/login/:nonce',
    element: <InterceptLogin />,
  },
  {
    path: '/payment',
    element: <InterceptPayment />,
  },
  {
    path: '/upload',
    element: <UploadPage />,
  },
  {
    path: '/media',
    element: <MediaPage />,
  },
  {
    path: '/profile',
    element: <ProfilePage />,
  },
  {
    path: '/view/:code',
    element: <ViewPage />,
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  </React.StrictMode>,
);
