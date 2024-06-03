import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from 'react-router-dom';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import * as Sentry from '@sentry/react';
import { Providers } from './Providers.tsx';
import LandingPage from './pages/Landing.tsx';
import UploadPage from './pages/Upload.tsx';
import MediaPage from './pages/Media.tsx';
import ProfilePage from './pages/Profile.tsx';
import LoginPage from './pages/Login.tsx';
import ViewPage from './pages/View.tsx';
import InterceptLogin from './pages/InterceptLogin.tsx';
import InterceptPayment from './pages/InterceptPayment.tsx';
import ErrorPage from './pages/Error.tsx';
import BannedPage from './pages/Banned.tsx';
import InterceptVerifcation from './pages/InterceptVerifcation.tsx';
import './index.css';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    Sentry.browserTracingIntegration({}),
    Sentry.reactRouterV6BrowserTracingIntegration({
      useEffect: React.useEffect,
      useLocation,
      useNavigationType,
      createRoutesFromChildren,
      matchRoutes,
    }),
    Sentry.replayIntegration(),
  ],

  // Captures 75% transactions for performance monitoring
  tracesSampleRate: 0.75,

  // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ['localhost', 'privatedrops.me'],

  // Capture Replay for 100% of all sessions,
  // and for 100% of sessions with an error
  replaysSessionSampleRate: 1.0,
  replaysOnErrorSampleRate: 1.0,
});

const sentryCreateBrowserRouter =
  Sentry.wrapCreateBrowserRouter(createBrowserRouter);
const router = sentryCreateBrowserRouter([
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
    path: '/verified',
    element: <InterceptVerifcation />,
  },
  {
    path: '/banned',
    element: <BannedPage />,
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
TimeAgo.addDefaultLocale(en);
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  </React.StrictMode>,
);
