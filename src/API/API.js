import axios from "axios";
import Auth from "@aws-amplify/auth";

const ENDPOINT = "https://cse-416-sporadic-api-prod.herokuapp.com";

const getToken = async () => {
  const session = await Auth.currentSession();
  return session.getIdToken().getJwtToken();
};

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
