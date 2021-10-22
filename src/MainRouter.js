import { BrowserRouter as Router, Route } from "react-router-dom";
import MainNav from "./components/NavBar/MainNav/MainNav";
import Footer from "./components/Footer/Footer";
import Feed from "./pages/Feed/Feed";
import Login from "./pages/Login/MainLogin/MainLogin";

const MainRouter = () => {
  return (
    <Router>
      <Route path="/login" component={Login} />
      <MainNav />
      <Route path="/Homepage" component={Feed}></Route>
      <Route path="/About"></Route>
      <Route path="/Contact"></Route>
      <Footer />
    </Router>
  );
};

export default MainRouter;
