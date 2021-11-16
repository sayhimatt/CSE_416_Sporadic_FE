import axios from "axios";
import Auth from "@aws-amplify/auth";

const ENDPOINT = "https://cse-416-sporadic-api-prod.herokuapp.com";
const AWS_ENDPOINT = "https://sporadic-development-bucket.s3.us-east-1.amazonaws.com";

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

export const postStartQuiz = async (platform, quizTitle) => {
  const token = await getToken();
  const response = await axios.post(
    `${ENDPOINT}/quizzes/${platform}/${quizTitle}/start`,
    {},
    {
      headers: { authorization: `Bearer ${token}` },
    },
  );
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

export const getUserIcon = async (username) => {
  try {
    const response = await axios.get(`${AWS_ENDPOINT}/users/${username}/avatar.png`);
    return `${AWS_ENDPOINT}/users/${username}/avatar.png`;
  } catch {
    return "/propic.png";
  }
};

/* User routing */

export const getUser = async (username) => {
  const token = await getToken();
  const response = await axios.get(`${ENDPOINT}/users/${username}`, {
    headers: { authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const manageFriend = async (username, action) => {
  const token = await getToken();
  const response = await axios.put(
    `${ENDPOINT}/users/updateRelationship`,
    {
      targetUsername: username,
      action: action,
    },
    { headers: { authorization: `Bearer ${token}` } },
  );
  return response;
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

export const deleteQuiz = async (platform, quiz) => {
  const token = await getToken();
  const response = await axios.delete(`${ENDPOINT}/quizzes/${platform}/${quiz}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
};
