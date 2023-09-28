import React from "react";
import LogoLight2x from "../../images/logo2x.png";
import LogoDark2x from "../../images/log.png";
import LogoSmall from "../../images/logo-small.png";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to={`${process.env.PUBLIC_URL}/`} className="logo-link">
      <img className="logo-dark logo-img" src={LogoDark2x} alt="logo" />
    </Link>
  );
};

export default Logo;
