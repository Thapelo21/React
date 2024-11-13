import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import Dashboard from './Dashboard';
import ProductManagement from './ProductManagement';
import UserManagement from './UserManagement';
import QuantityChart from './QuantityChart'; // Import the QuantityChart component
import './App.css';

const App = () => {
  // State to manage the list of products
  const [products, setProducts] = useState(JSON.parse(localStorage.getItem('products')) || []);
  // State to manage the list of users
  const [users, setUsers] = useState(JSON.parse(localStorage.getItem('users')) || []);
  // State to track the currently logged-in user
  const [currentUser, setCurrentUser] = useState(localStorage.getItem('currentUser') || null);

  // Syncs 'products' and 'users' states with localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('users', JSON.stringify(users));
  }, [products, users]);

  // Handles login by setting the current user and saving it in localStorage
  const handleLogin = (username) => {
    setCurrentUser(username);
    localStorage.setItem('currentUser', username);
  };

  // Handles logout by clearing the current user from both state and localStorage
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  // Component for handling user login
  const Login = ({ onLogin, users }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
      e.preventDefault();
      const user = users.find(user => user.username === username && user.password === password);
      if (user) {
        onLogin(username);
      } else {
        alert('Invalid username or password');
      }
    };

    return (
      <div className="form-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="show-password-button"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <button type="submit">Login</button>
        </form>
        <p>
          Haven't Registered yet? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    );
  };

  // Component for handling user sign-up
  const SignUp = ({ users, setUsers }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
      e.preventDefault();
      const newUser = { username, password };
      
      // Check if the username already exists
      if (users.some(user => user.username === username)) {
        alert('Username already exists!');
        return;
      }

      // Update users state in App component
      setUsers([...users, newUser]);
      alert('Sign up successful! You can now log in.');
      
      // Clear input fields
      setUsername('');
      setPassword('');
    };

    return (
      <div className="form-container">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="show-password-button"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <button type="submit">Register</button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    );
  };

  return (
    <Router>
      <header className="App-header">
        <h1>Wings Cafe Inventory System</h1>
        <nav>
          <button onClick={() => (window.location.href = '/')}>Dashboard</button>
          <button onClick={() => (window.location.href = '/product-management')}>Product Management</button>
          <button onClick={() => (window.location.href = '/user-management')}>User Management</button>
          {currentUser ? (
            <button onClick={handleLogout}>Logout</button>
          ) : null /* Removed Login and Sign Up buttons */}
        </nav>
      </header>
      <Routes>
        <Route
          path="/login"
          element={currentUser ? <Navigate to="/" /> : <Login onLogin={handleLogin} users={users} />}
        />
        <Route
          path="/signup"
          element={currentUser ? <Navigate to="/" /> : <SignUp users={users} setUsers={setUsers} />}
        />
        <Route
          path="/product-management"
          element={currentUser ? <ProductManagement products={products} setProducts={setProducts} /> : <Navigate to="/login" />}
        />
        <Route
          path="/user-management"
          element={currentUser ? <UserManagement users={users} setUsers={setUsers} /> : <Navigate to="/login" />}
        />
        <Route
          path="/"
          element={
            currentUser ? (
              <div>
                <Dashboard products={products} setProducts={setProducts} />
                <QuantityChart products={products} /> {/* Add QuantityChart here */}
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;