// import { createContext, useContext, useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();
//     const BASE_API_URL = "https://your-backend-api.com/api";

//     useEffect(() => {
//         const userData = JSON.parse(localStorage.getItem('user'));
//         if (userData) {
//             setUser(userData);
//         }
//         setLoading(false);
//     }, []);

//     const login = async (name, password) => {
//         try {
//             const response = await fetch(`${BASE_API_URL}/user/auth/login/`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ name, password })
//             });

//             const data = await response.json();
            
//             if (!response.ok || data.status !== "authorize") {
//                 throw new Error(data.message || 'Невірний логін або пароль');
//             }

//             const userData = {
//                 username: data.username,
//                 name: name,
//                 token: data.token || 'dummy-token'
//             };

//             localStorage.setItem('user', JSON.stringify(userData));
//             setUser(userData);
            
//             return { success: true };
//         } catch (error) {
//             return { success: false, message: error.message };
//         }
//     };

//     const logout = async () => {
//         try {
//             if (user?.token) {
//                 await fetch(`${BASE_API_URL}/user/auth/logout/`, {
//                     method: 'POST',
//                     headers: { 'Authorization': `Bearer ${user.token}` }
//                 });
//             }
//         } finally {
//             localStorage.removeItem('user');
//             setUser(null);
//             navigate('/login');
//         }
//     };

//     const register = async (formData) => {
//         try {
//             const response = await fetch(`${BASE_API_URL}/user/registration/`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     name: formData.username,
//                     email: formData.email,
//                     password: formData.password,
//                     Phone: formData.phone,
//                     birthday: formData.birthday
//                 })
//             });

//             const data = await response.json();
            
//             if (!response.ok || data.status !== "success") {
//                 throw new Error(data.message || 'Помилка реєстрації');
//             }

//             return { success: true };
//         } catch (error) {
//             return { success: false, message: error.message };
//         }
//     };

//     return (
//         <AuthContext.Provider value={{ user, loading, login, logout, register }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => useContext(AuthContext);

import axios from 'axios';
axios.defaults.withCredentials = true;

// Базовий URL для API
//const API_URL = 'https://gallery.net/api/user/auth/';
const API_URL = 'http://127.0.0.1:8000/';

// Функція для авторизації користувача (логін)
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}api/user/auth/login/`, {  
      username: username,
      password: password
    });
    const { access, refresh, user } = response.data;
    if (access) {
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      localStorage.setItem("username", user.username);
      return true; // Повертаємо true, якщо авторизація успішна
    }

    return false; // Якщо немає username, повертаємо false
  } catch (error) {
    console.error("Error during login:", error);
    throw new Error("Невірний логін або пароль");
  }
};

// Функція для логауту користувача
export const logout = async () => {
  try {
    const refresh = localStorage.getItem("refresh");

    await axios.post(`${API_URL}api/user/auth/logout/`, { refresh }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`
      }
    });

    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");
    return true;
  } catch (error) {
    console.error("Error during logout:", error);
    return false;
  }
};

// Функція для перевірки, чи авторизований користувач
export const checkAuth = () => {
  const token = localStorage.getItem("access");
  if (!token) return false;

  try {
    const [, payload] = token.split(".");
    const decoded = JSON.parse(atob(payload));
    const now = Math.floor(Date.now() / 1000);

    return decoded.exp > now;
  } catch (error) {
    console.error("Помилка перевірки токена", error);
    return false;
  }
};
/*
export const checkAuth = () => {
  const token = localStorage.getItem('access');
  // Перевірка на наявність токену в localStorage
  return token ? true : false;
};*/

// Функція для отримання імені користувача (якщо авторизований)
export const getUsername = () => {
  return localStorage.getItem('username'); // Отримуємо ім'я користувача з localStorage
};

// Функція для реєстрації нового користувача
export const register = async (form) => {
  try {
    const response = await axios.post(`${API_URL}api/user/registration/`, {
      username: form.username,
      email: form.email,
      password: form.password,
      phone_number: form.number,
      birthday_date: form.birthday
    });

    const { access, refresh, user } = response.data;
    if (access) {
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);
      localStorage.setItem('username', user.username);
      return true; // Повертаємо true, якщо реєстрація успішна
    }

    return false; // Якщо немає username, повертаємо false
  } catch (error) {
    console.error("Error during registration:", error);
    throw new Error("Помилка реєстрації");
  }
};

// Функція запису контактів в бд
export const sendcont = async (form) => {
  try {
    const response = await axios.post(`${API_URL}api/contacts/`, {
      username: form.username,
      email: form.email,
      message: form.message
    });
    
    const username = response.data
    if (username){
      return true;
    }
    return false; // Якщо немає username, повертаємо false
  } catch (error) {
    console.error("Error during adding message:", error);
    throw new Error("Error during adding message.");
  }
};


