import './App.css';
import Index from './myApp';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Inbox from './Routes/inbox';  
import Starred from './Routes/starred'; 
import Snoozed from './Routes/snoozed';
import Sent from './Routes/sent'; 
import Draft from './Routes/draft'; 
import Bin from './Routes/bin'; 
import AllMail from './Routes/allMail';
import ViewEmail from './Components/ViewEmails'; 
import Signup from './Components/Signup';
import Login from './Components/Login';
import { AuthProvider, useAuth } from './contexts/authContext';
import ProtectedRoute from './Routes/ProtectedRoute';
import AccountPage from './Components/AccountPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login /> 
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: '/inbox',
    element: (
      <ProtectedRoute>
        <Inbox />
        <Index />
      </ProtectedRoute>
    )
  },
  {
    path: '/starred',
    element: (
      <ProtectedRoute>
        <Starred />
        <Index />
      </ProtectedRoute>
    )
  },
  {
    path: '/snoozed',
    element: (
      <ProtectedRoute>
        <Snoozed />
        <Index />
      </ProtectedRoute>
    )
  },
  {
    path: '/sent',
    element: (
      <ProtectedRoute>
        <Sent />
        <Index />
      </ProtectedRoute>
    )
  },
  {
    path: '/draft',
    element: (
      <ProtectedRoute>
        <Draft />
        <Index />
      </ProtectedRoute>
    )
  },
  {
    path: '/bin',
    element: (
      <ProtectedRoute>
        <Bin />
        <Index />
      </ProtectedRoute>
    )
  },
  {
    path: '/all-mail',
    element: (
      <ProtectedRoute>
        <AllMail />
        <Index />
      </ProtectedRoute>
    )
  },
  {
    path: '/view-email',
    element: (
      <ProtectedRoute>
        <ViewEmail />
        <Index />
      </ProtectedRoute>
    )
  },
  {
  path: '/account',
  element: <AccountPage />
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
