import axios from "axios";
import Auth from "@aws-amplify/auth";

const ENDPOINT = "https://cse-416-sporadic-api-prod.herokuapp.com";

const getToken = async () => {
  const session = await Auth.currentSession();
  return session.getIdToken().getJwtToken();
};

// TODO: Handle errors

/* Platforms routing */

export const getPlatform = async (platformName) => {
  const token = await getToken();
  try {
    const response = await axios.get(`${ENDPOINT}/platforms/${platformName}`, {
      headers: { authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const postCreatePlatform = async (platformData) => {
  const token = await getToken();
  try {
    await axios.post(
      `${ENDPOINT}/platforms/`,
      { title: platformData.title, description: platformData.description },
      { headers: { authorization: `Bearer ${token}` } }
    );
  } catch (error) {
    throw error;
  }
};

export const getQuizzesFromPlatform = async (platformName) => {
  const token = await getToken();
  try {
    const response = await axios.get(
      `${ENDPOINT}/quizzes?platform=${platformName}`,
      {
        headers: { authorization: `Bearer ${token}` },
      }
    );
    return response.data.items;
  } catch (error) {
    throw error;
  }
};

/* Login Routing */

export const postCreateAccount = async (username, password, email) => {
  try {
    const response = await axios.post(`${ENDPOINT}/users/`, {
      username,
      password,
      email,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const postConfirmCode = async (username, confirmCode) => {
  try {
    await axios.post(`${ENDPOINT}/users/${username}/confirm`, {
      confirmCode,
    });
  } catch (error) {
    throw error;
  }
};
