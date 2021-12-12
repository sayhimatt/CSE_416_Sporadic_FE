import React from "react";
import LinkButton from "../../components/Buttons/LinkButton/LinkButton";
import SubNav from "../../components/NavBar/SubNav/SubNav";
import MainNav from "../../components/NavBar/MainNav/MainNav";
import Footer from "../../components/Footer/Footer";
import IframeResizer from "iframe-resizer-react";
import "iframe-resizer/js/iframeResizer.contentWindow";
import "./styles.scss";

const ContactUs = () => {
  const subNavButtons = [<LinkButton to="/createPlatform">Create A Platform</LinkButton>];
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
