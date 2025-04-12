

// import React from 'react';
// import { Link } from 'react-router-dom'; // Для навігації
// import '../styles/header.css'; // Підключення стилів
// import logo from "../assets/img/logo.png"; // Підключення логотипу

// const Header = () => {
//     // Тимчасова заглушка
//     const user = null; // або { username: "Anna" } для перевірки
//     const logout = () => {
//         console.log("User logged out"); 
//         // Тут ти зможеш реалізувати очищення localStorage і перенаправлення
//     };

//     return (
//         <header className="header-container">
//             <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between mb-4">
//                 <div className="mb-2 mb-md-0">
//                     <Link to="/" className="d-inline-flex link-body-emphasis text-decoration-none">
//                         <img src={logo} alt="Логотип" />
//                     </Link>
//                 </div>

//                 <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
//                     <li><Link to="/" className="nav-link px-2">Головна</Link></li>
//                     <li><Link to="/exhibitions" className="nav-link px-2">Виставки</Link></li>
//                     <li><Link to="/catalog" className="nav-link px-2">Каталог</Link></li>
//                     <li><Link to="/contact" className="nav-link px-2">Контакти</Link></li>
//                 </ul>

//                 <div className="text-end">
//                     {user ? (
//                         <>
//                             <span className="me-2">{user.username}</span>
//                             <button onClick={logout} className="btn btn-outline-dark">Вийти</button>
//                         </>
//                     ) : (
//                         <>
//                             <Link to="/login" className="login btn me-2">Увійти</Link>
//                             <Link to="/register" className="register btn">Зареєструватись</Link>
//                         </>
//                     )}
//                 </div>
//             </div>
//         </header>
//     );
// };

// export default Header;

import React from 'react';
import { Link } from 'react-router-dom';
import { checkAuth, getUsername, logout } from '../context/AuthContext.jsx'; // Підключаємо функції для авторизації
import '../styles/header.css';
import logo from "../assets/img/logo.png";

const Header = () => {
  const isAuthenticated = checkAuth();
  const username = getUsername(); // Отримуємо ім'я користувача з localStorage


  const handleLogout = async () => {
    await logout(); // Викликаємо функцію для логауту
    window.location.reload(); // Перезавантажуємо сторінку, щоб відобразити зміни
  };

  return (
    <header className="header-container">
      <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between mb-4">
        <div className="mb-2 mb-md-0">
          <Link to="/" className="d-inline-flex link-body-emphasis text-decoration-none">
            <img src={logo} alt="Логотип" />
          </Link>
        </div>

        <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
          <li><Link to="/" className="nav-link px-2">Головна</Link></li>
          <li><Link to="/exhibitions" className="nav-link px-2">Виставки</Link></li>
          <li><Link to="/catalog" className="nav-link px-2">Каталог</Link></li>
          <li><Link to="/contact" className="nav-link px-2">Контакти</Link></li>
        </ul>

        <div className="text-end">
          {isAuthenticated ? (
            <>
            <div className="d-flex align-items-center">
              <Link 
                to="/add-exhibition" 
                className="user-icon-container"
                title="Додати виставку"
              >
                <i className="fa-solid fa-user"></i>
                <span className="me-2 username">{username}</span>
              </Link>
              <button 
                onClick={handleLogout} 
                className="btn btn-outline-dark ms-3"
              >
                Вийти
              </button>
            </div>
            </>
          ) : (
            <>
              <Link to="/login" className="login btn me-2">Увійти</Link>
              <Link to="/register" className="register btn">Зареєструватись</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
