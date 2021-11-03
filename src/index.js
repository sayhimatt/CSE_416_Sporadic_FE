import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Amplify from "aws-amplify";
import { Auth } from "aws-amplify";

import "bootstrap/dist/css/bootstrap.css";

Amplify.configure({
  Auth: {
    identityPoolId: "us-east-1:2fb9bb37-a2ed-4c01-8875-cfd0cadadeb4",
    region: "us-east-1",
    userPoolId: "us-east-1_STt8RuvC6",
    userPoolWebClientId: "28b2mfltdfri759991ftg5l9p6",
  },
  API: {
    endpoints: [
      {
        name: "BackendAPI",
        endpoint: "https://matt-training-server.herokuapp.com",
        custom_header: async () => {
          return {
            Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
          };
        },
      },
    ],
  },
});
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root"),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
