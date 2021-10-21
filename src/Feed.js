import { Link } from "react-router-dom";

import Button from "./components/Button/Button";
import SubNav from "./components/NavBar/SubNav/SubNav";

const Feed = () => {
  const subNavButtons = [
    <Link to="/createPlatform">
      <Button>Create A Platform</Button>
    </Link>,
    <Link to="/Notifications">
      <Button>Notifications</Button>
    </Link>,
  ];
  return (
    <div>
      <SubNav heading="Welcome Back John1!" buttons={subNavButtons} />
    </div>
  );
};

export default Feed;
