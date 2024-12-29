import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css';
import './App.css';

import AuthRoute from './util/AuthRoute.tsx';
import { AuthProvider } from './context/auth.tsx';

import MenuBar from './components/MenuBar.tsx';
import Footer from './components/Footer.tsx';
import Home from './pages/Home.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import SinglePost from './pages/SinglePost.tsx';
import UserProfile from './pages/UserProfile.tsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Container>
          <MenuBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={
                <AuthRoute>
                  <Login />
                </AuthRoute>
              }
            />
            <Route
              path="/register"
              element={
                <AuthRoute>
                  <Register />
                </AuthRoute>
              }
            />
            <Route path="/posts/:postId" element={<SinglePost />} />
            <Route path="/posts/edit/:postId" element={<SinglePost edit={true} />} />
            <Route path="/user/:userId" element={<UserProfile />} />
          </Routes>
          <Footer />
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
