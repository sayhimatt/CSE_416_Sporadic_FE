import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import MainRouter from "./MainRouter";
import reportWebVitals from "./reportWebVitals";
import Amplify from "aws-amplify";
import { Auth } from "aws-amplify";

Amplify.configure({
  Auth: {
    identityPoolId: "us-east-1:c87c6503-30c3-4252-a7e3-35c2a9d1c112",
    region: "us-east-1",
    userPoolId: "us-east-1_eDxyVw4Db",
    userPoolWebClientId: "75qdrepaagbasjgoopuv05ub00",
  },
  API: {
    endpoints: [
      {
        name: "BackendAPI",
        endpoint: "https://matt-training-server.herokuapp.com",
        custom_header: async () => {
          return {
            Authorization: `Bearer ${(await Auth.currentSession())
              .getIdToken()
              .getJwtToken()}`,
          };
        },
      },
    ],
  },
});
ReactDOM.render(
  <React.StrictMode>
    <MainRouter />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
