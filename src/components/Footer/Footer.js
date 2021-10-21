import React from "react";
import { Link } from "react-router-dom";
import "./styles.css";

const Footer = () => {
    return (
        <div className="footer">
            <div className="items">
                <div className="navItem">
                    <Link className="link" to="/About">About Us</Link>
                </div>
                <div className="navItem">
                    <Link className="link" to="Contact">Contact Us</Link>
                </div>
            </div>
        </div>
    )
}

export default Footer;