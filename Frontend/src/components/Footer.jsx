import React from 'react';
import '../styles/footer.css';
import footer from "../assets/img/footer.png"; // Заміни шлях згідно з реальною структурою

const Footer = () => {
    return (
        <footer>
            <div className="container-footer">
                <div className="footer">
                    <div className="content">
                        <div className="menu">
                            <a href="/">Головна</a>
                            <a href="/exhibitions">Виставки</a>
                            <a href="/catalog">Каталог</a>
                            <a href="/contact">Контакти</a>
                        </div>
                        <div className="contacts">
                            <p>Телефон:<br /> 380673456277</p>
                            <p>E-mail:<br /> <a href="mailto:vagallery@gmail.com">vagallery@gmail.com</a></p>
                        </div>
                    </div>
                </div>
                <div className="logo-content">
                    <div className="logo-icons">
                    <img src={footer} alt="Логотип" />
                        <p className="footer-copyright">© 2024 VA Gallery. Усі права захищені.</p>
                    </div>
                    <div className="icons-left">
                        <i className="fa-brands fa-instagram"></i>
                        <i className="fa-brands fa-tiktok"></i>
                        <i className="fa-brands fa-youtube"></i>
                        <i className="fa-brands fa-facebook-f"></i>
                        <i className="fa-brands fa-x-twitter"></i>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
