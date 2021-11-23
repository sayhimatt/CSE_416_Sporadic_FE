import React from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Button/Button";
import SubNav from "../../components/NavBar/SubNav/SubNav";
import MainNav from "../../components/NavBar/MainNav/MainNav";
import Footer from "../../components/Footer/Footer";
import "./styles.scss";

const About = () => {
  const subNavButtons = [
    <Link key="nav-createPlatformB" to="/createPlatform">
      <Button>Create A Platform</Button>
    </Link>,
    <Link key="nav-notificationsB" to="/Notifications">
      <Button>Notifications</Button>
    </Link>,
  ];
  return (
    <div>
      <MainNav />
      <SubNav heading={`The Sporadic Team`} buttons={subNavButtons} />
      <div className="about d-flex flex-row align-items-center justify-content-center min-vh-100 ">
        <div className="d-flex flex-column">
          <img className="avatar p1" alt="avatar" src={"/matt.png"} />
          <img className="avatar p2" alt="avatar" src={"/jackson.png"} />
        </div>
        <div>
          <p>Our Team:</p>
          <p className="p1">Matthew Montalbano</p>
          <p className="p2">Jackson Ludwig</p>
          <p className="p3">Luke Kaicher</p>
          <p className="p4">Matt Guidi</p>
          <p>We Sincerely Hope You Enjoy Our Website!</p>
        </div>

        <div className="d-flex flex-column">
          <img className="avatar p3" alt="avatar" src={"/luke.png"} />
          <img className="avatar p4" alt="avatar" src={"/guidi.png"} />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
