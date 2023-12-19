import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="bg-dark text-light p-3 text-center">
      All Rights Reserverd &copy; Omar Mahmood
      <p className="text-center mt-3">
        <Link to="/">Home</Link>|<Link to="/contact">Contact</Link>|
        <Link to="/aboutus">About Us</Link>|<Link to="/policy">Policy</Link>|
      </p>
    </div>
  );
};

export default Footer;
