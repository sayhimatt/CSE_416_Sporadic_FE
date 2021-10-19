import logo from "./spore.svg";
import { AmplifySignOut, withAuthenticator } from "@aws-amplify/ui-react";
import "./App.css";
import { API, Auth } from "aws-amplify";
import { useState } from "react";

function App() {
  const [textToSend, setTextToSend] = useState("");
  const [dbData, setDbData] = useState([]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="Logo"></img>
        <h2>Welcome to Sporadic!</h2>
        <input
          onChange={(e) => setTextToSend(e.target.value)}
          placeholder={"Add a message to the DB"}
          type="text"
        />
        <button
          onClick={async () => {
            if (textToSend.trim() !== " " && textToSend.trim() !== "") {
              await API.post("BackendAPI", "/items", {
                headers: {
                  Authorization: `Bearer ${(await Auth.currentSession())
                    .getIdToken()
                    .getJwtToken()}`,
                },
                body: {
                  text: textToSend,
                },
              }).catch((err) => {
                console.log(err);
              });

              console.log("Data Sent");
            }
          }}
          type="button"
        >
          Add Message
        </button>
        <button
          onClick={async () => {
            const result = await API.get("BackendAPI", "/items", {
              headers: {
                Authorization: `Bearer ${(await Auth.currentSession())
                  .getIdToken()
                  .getJwtToken()}`,
              },
            }).catch((err) => {
              console.log(err);
            });
            setDbData(result);
            console.log("Data received");
          }}
          type="button"
        >
          Retrieve All
        </button>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <table>
            {dbData.map((item) => (
              <tr>
                <th>{item.text}</th>
              </tr>
            ))}
          </table>
        </div>
      </header>
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);
