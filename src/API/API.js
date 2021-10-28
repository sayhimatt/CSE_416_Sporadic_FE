import axios from "axios";
import Auth from "@aws-amplify/auth";

const ENDPOINT = "https://cse-416-sporadic-api-prod.herokuapp.com";

const getToken = async () => {
  const session = await Auth.currentSession();
  return session.getIdToken().getJwtToken();
};

/* Platforms routing */

export const getPlatform = async (platformName) => {
  const token = await getToken();
  try {
    const response = await axios.get(`${ENDPOINT}/platforms/${platformName}`, {
      headers: { authorization: `Bearer: ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/* Login Routing */

export const postCreateAccount = async (username, password, email) => {
  try {
    const response = await axios.post(
      "https://cse-416-sporadic-api-prod.herokuapp.com/users/",
      {
        username,
        password,
        email,
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};
