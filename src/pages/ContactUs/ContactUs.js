import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Button/Button";
import SubNav from "../../components/NavBar/SubNav/SubNav";
import MainNav from "../../components/NavBar/MainNav/MainNav";
import Footer from "../../components/Footer/Footer";
import IframeResizer from "iframe-resizer-react";
import "iframe-resizer/js/iframeResizer.contentWindow";
import "./styles.scss";

const ContactUs = () => {
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
      <SubNav heading={`Contact The Sporadic Team`} buttons={subNavButtons} />
      <IframeResizer
        className="min-vh-100 w-100"
        src="https://docs.google.com/forms/d/e/1FAIpQLSepVnJjB3h44OAZnivkiXwRcy-qNGysC7XLWM21q_i-eFCQiw/viewform"
      />
      <Footer />
    </div>
  );
};

export default ContactUs;
