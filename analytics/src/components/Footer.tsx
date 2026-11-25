import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <div className="footer container-fluid text-white">
      <div className="row pt-3">
        <div className="col-12 text-center">
          <p>
            <i className="fa fa-envelope mr-2"></i>
            soporte@fitshop.com
          </p>
          <p>
            <i className="fab fa-whatsapp mr-2"></i>
            +54 9 261 123 4567
          </p>
        </div>
      </div>
      <div className="container border-top border-dark pt-2">
        <p className="m-0 text-center text-white">
          &copy; <span className="font-weight-bold">FitShop</span>. Tu tienda
          fitness online de confianza. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
};

export default Footer;
