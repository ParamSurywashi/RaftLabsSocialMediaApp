import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon, Menu, Dropdown, MenuProps } from 'semantic-ui-react';

import { AuthContext } from '../context/auth.tsx';
import { ThemeContext } from '../context/theme.tsx';
import PostForm from './PostForm.tsx';

interface User {
  id: string;
  username: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  logout: () => void;
}

interface ThemeContextType {
  isDarkTheme: boolean;
  toggleTheme: () => void;
}

function MenuBar() {
  const { user, logout } = useContext(AuthContext);
  const { isDarkTheme, toggleTheme } = useContext(ThemeContext);
  const pathname = window.location.pathname;
  const path = pathname === '/' ? 'home' : pathname.substring(1);
  const [activeItem, setActiveItem] = useState<string>(path);
  const [isPostFormOpen, setIsPostFormOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleItemClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    { name }: { name?: string }
  ) => {
    if (name) setActiveItem(name);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const MenuStyle: MenuProps = isDarkTheme
    ? {
        inverted: true,
        pointing: false,
        secondary: false,
        size: 'massive',
      }
    : {
        inverted: false,
        pointing: true,
        secondary: true,
        size: 'massive',
        color: 'teal',
      };

  const dropdownItems: JSX.Element[] = [];

  if (pathname.includes('/post') || pathname.includes('/user')) {
    dropdownItems.push(
      <Dropdown.Item key="home" as={Link} to="/">
        Home
      </Dropdown.Item>
    );
  }

  if (user && !pathname.includes('/user')) {
    dropdownItems.push(
      <Dropdown.Item key="profile" as={Link} to={`/user/${user.id}`}>
        {user.username.charAt(0).toUpperCase() + user.username.slice(1)}'s Profile
      </Dropdown.Item>
    );
  }

  const menuBar = user ? (
    <Menu {...MenuStyle}>
      <Dropdown item icon="home" text="Menu">
        <Dropdown.Menu>{dropdownItems}</Dropdown.Menu>
      </Dropdown>
      {user.isAdmin && <Menu.Item name="admin">Admin</Menu.Item>}
      <Menu.Item name="addPost" onClick={() => setIsPostFormOpen(true)}>
        Add Post
      </Menu.Item> 
      <Menu.Menu position="right">
        <Menu.Item name="logout" onClick={handleLogout}>
          Logout
        </Menu.Item>
        <Menu.Item name="theme" onClick={toggleTheme}>
          <Icon name={isDarkTheme ? 'sun' : 'moon'} />
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  ) : (
    <Menu {...MenuStyle}>
      <Menu.Item
        name="home"
        active={activeItem === 'home'}
        onClick={handleItemClick}
        as={Link}
        to="/"
      />
      <Menu.Menu position="right">
        <Menu.Item
          name="login"
          active={activeItem === 'login'}
          onClick={handleItemClick}
          as={Link}
          to="/login"
        />
        <Menu.Item
          name="register"
          active={activeItem === 'register'}
          onClick={handleItemClick}
          as={Link}
          to="/register"
        />
        <Menu.Item name="theme" onClick={toggleTheme}>
          <Icon name={isDarkTheme ? 'sun' : 'moon'} />
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );

  return (
    <>
      {menuBar}
      {isPostFormOpen && user && ( 
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000, background: '#e91f46', padding: 50, borderRadius: '10%' }}>
          <PostForm />
          <button onClick={() => setIsPostFormOpen(false)} style={{ position: 'absolute', top: 10, right: 10,backgroundColor: 'black', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001, }}>
            X
          </button>
        </div>
      )}
    </>
  );
}

export default MenuBar;
