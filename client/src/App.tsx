import { SignupForm } from './pages/SignupForm';
import { SigninForm } from './pages/SigninForm';
import { Route, Routes, Navigate } from 'react-router-dom';
import { User, Auth } from './lib/types';
import { AppContext } from './components/AppContext';
import { Home } from './pages/Home';
import { useEffect, useState } from 'react';

export default function App() {
  const [user, setUser] = useState<User>();
  const [token, setToken] = useState<string>();
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [isAuthorizing, setIsAuthorizing] = useState(true);

  /**
   * Renders page after auth token has been checked
   *
   * auth: {token: "", user: {userID: 0, username: ""}}
   */
  useEffect(() => {
    const auth = localStorage.getItem('auth');
    if (auth) {
      const a = JSON.parse(auth);
      setUser(a.user);
      setToken(a.token);
      setLoggedIn(true);
    }
    setIsAuthorizing(false);
  }, []);

  // Do not render page if localStorage auth token hasn't been checked
  if (isAuthorizing) return null;

  function handleSignIn(auth: Auth) {
    localStorage.setItem('auth', JSON.stringify(auth));
    setUser(auth.user);
    setToken(auth.token);
    setLoggedIn(true);
  }

  function handleSignOut() {
    localStorage.removeItem('auth');
    setUser(undefined);
    setToken(undefined);
    setLoggedIn(false);
  }

  // Go to Home screen if auth token and user info found, else Login screen
  const contextValue = { user, token, handleSignIn, handleSignOut };
  return (
    <AppContext.Provider value={contextValue}>
      <Routes>
        <Route
          path="/"
          element={loggedIn ? <Home /> : <Navigate to="/login" />}
        />
        <Route path="/register" element={<SignupForm />} />
        <Route path="/login" element={<SigninForm />} />
      </Routes>
    </AppContext.Provider>
  );
}
