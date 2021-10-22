import { Link } from "react-router-dom";

import Button from "../../components/Button/Button";
import SubNav from "../../components/NavBar/SubNav/SubNav";
import MainNav from "../../components/NavBar/MainNav/MainNav";
import Footer from "../../components/Footer/Footer";

const Feed = ({ children, logoutHandler }) => {
  const subNavButtons = [
    <Link to="/createPlatform">
      <Button>Create A Platform</Button>
    </Link>,
    <Link to="/Notifications">
      <Button>Notifications</Button>
    </Link>,
    <Button buttonStyle="btn--special" onClick={logoutHandler}>
      Sign Out
    </Button>,
  ];
  return (
    <div>
      <MainNav />
      <SubNav heading="Welcome Back John1!" buttons={subNavButtons} />
      <Footer />
    </div>
  );
};

export default Feed;
