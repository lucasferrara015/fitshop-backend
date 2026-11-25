import React from "react";

const Hero = () => {
  return (
    <div className="container-fluid p-0">
      <div className="hero-banner position-relative">
        <img className="w-100" src="/images/hero-bg.jpg" alt="Portada" />
        <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
          <h3 className="text-primary text-capitalize m-0">
            Entrená con lo mejor
          </h3>
          <h2 className="display-2 m-0 mt-2 mt-md-4 text-white font-weight-bold text-capitalize">
            Tu tienda fitness
          </h2>
          <a
            href="#productos"
            className="btn btn-lg btn-outline-light mt-3 mt-md-5 py-md-3 px-md-5"
          >
            Ver productos
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;
