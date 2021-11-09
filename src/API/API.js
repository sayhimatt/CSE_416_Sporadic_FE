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
  const response = await axios.get(`${ENDPOINT}/platforms/${platformName}`, {
    headers: { authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const postCreatePlatform = async (platformData) => {
  const token = await getToken();
  await axios.post(
    `${ENDPOINT}/platforms/`,
    { title: platformData.title, description: platformData.description },
    { headers: { authorization: `Bearer ${token}` } },
  );
};

export const getQuizzesFromPlatform = async (platformName) => {
  const token = await getToken();
  const response = await axios.get(`${ENDPOINT}/quizzes?platform=${platformName}`, {
    headers: { authorization: `Bearer ${token}` },
  });
  return response.data.items;
};

export const patchSubscribe = async (platformName) => {
  const token = await getToken();
  const response = await axios.patch(
    `${ENDPOINT}/platforms/${platformName}/subscribe`,
    {},
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
  );
  return response;
};

export const patchUnsubscribe = async (platformName) => {
  const token = await getToken();
  const response = await axios.patch(
    `${ENDPOINT}/platforms/${platformName}/unsubscribe`,
    {},
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
  );
  return response;
};

export const getQuizByTitle = async (platform, quizTitle) => {
  const token = await getToken();
  const response = await axios.get(`${ENDPOINT}/quizzes/${platform}/${quizTitle}`, {
    headers: { authorization: `Bearer ${token}` },
  });
  return response.data;
};

/* Login Routing */

export const postCreateAccount = async (username, password, email) => {
  const response = await axios.post(`${ENDPOINT}/users/`, {
    username,
    password,
    email,
  });
  return response;
};

export const postConfirmCode = async (username, confirmCode) => {
  await axios.post(`${ENDPOINT}/users/${username}/confirm`, {
    confirmCode,
  });
};

/* User routing */

export const getUser = async (username) => {
  const token = await getToken();
  const response = await axios.get(`${ENDPOINT}/users/${username}`, {
    headers: { authorization: `Bearer ${token}` },
  });
  console.log(response.data);
  return response.data;
};

/* Feed routing */
export const getFeedQuizzes = async (username) => {
  return;
};

/* Quiz Routing */
export const postCreateQuiz = async (quiz) => {
  const token = await getToken();
  const response = await axios.post(
    `${ENDPOINT}/quizzes/`,
    {
      ...quiz,
    },
    {
      headers: { authorization: `Bearer ${token}` },
    },
  );
  return response;
};
