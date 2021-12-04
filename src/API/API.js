import axios from "axios";
import Auth from "@aws-amplify/auth";

const ENDPOINT = "https://cse-416-sporadic-api-prod.herokuapp.com";
const AWS_ENDPOINT = "https://sporadic-development-bucket.s3.us-east-1.amazonaws.com";

const getToken = async () => {
  const session = await Auth.currentSession();
  return session.getIdToken().getJwtToken();
};

export const authenticate = async () => {
  return await Auth.currentSession();
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

export const getQuizzesFromPlatform = async (platformName, page) => {
  const AMOUNT_PER_PAGE = 10;
  const token = await getToken();
  const response = await axios.get(
    `${ENDPOINT}/quizzes?platform=${platformName}&page=${page}&amountPerPage=${AMOUNT_PER_PAGE}`,
    {
      headers: { authorization: `Bearer ${token}` },
    },
  );
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

export const putBanStatus = async (platform, username, action) => {
  const token = await getToken();
  const response = await axios.put(
    `${ENDPOINT}/platforms/${platform}/updateBannedUsers`,
    {
      targetUsername: username,
      action,
    },
    { headers: { authorization: `Bearer ${token}` } },
  );
  return response;
};

export const putModeratorStatus = async (platform, username, action) => {
  const token = await getToken();
  const response = await axios.put(
    `${ENDPOINT}/platforms/${platform}/updateModerators`,
    {
      targetUsername: username,
      action,
    },
    { headers: { authorization: `Bearer ${token}` } },
  );
  return response;
};

export const postSubmitQuiz = async (platform, quizTitle, answers) => {
  const token = await getToken();
  const response = await axios.post(
    `${ENDPOINT}/quizzes/${platform}/${quizTitle}/submit`,
    {
      answers: answers,
    },
    {
      headers: { authorization: `Bearer ${token}` },
    },
  );
  return response.data;
};

export const putUpdatePinStatus = async (platform, quizTitle, action) => {
  const token = await getToken();
  const response = await axios.put(
    `${ENDPOINT}/platforms/${platform}/updatePinnedQuizzes`,
    {
      targetQuiz: quizTitle,
      action,
    },
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

/* User routing */

export const getUser = async (username) => {
  const token = await getToken();
  const response = await axios.get(`${ENDPOINT}/users/${username}`, {
    headers: { authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const patchGlobalBanStatus = async (username, action) => {
  const token = await getToken();
  const response = await axios.patch(
    `${ENDPOINT}/users/updateGlobalBanStatus`,
    { targetUsername: username, action },
    {
      headers: { authorization: `Bearer ${token}` },
    },
  );
  return response;
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

export const patchUserAbout = async (username, text) => {
  const token = await getToken();
  const response = await axios.patch(
    `${ENDPOINT}/users/about`,
    { aboutSection: text },
    { headers: { authorization: `Bearer ${token}` } },
  );
  return response;
};

/* Feed routing */
export const getFeedQuizzes = async (page) => {
  const AMOUNT_PER_PAGE = 10;
  const token = await getToken();
  const response = await axios.get(
    `${ENDPOINT}/quizzes/feed?page=${page}&amountPerPage=${AMOUNT_PER_PAGE}`,
    {
      headers: { authorization: `Bearer ${token}` },
    },
  );
  return response.data;
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

export const putComment = async (platform, quiz, text) => {
  const token = await getToken();
  const response = await axios.put(
    `${ENDPOINT}/quizzes/${platform}/${quiz}/comment`,
    {
      commentText: text,
    },
    { headers: { authorization: `Bearer ${token}` } },
  );
  return response;
};

export const patchVote = async (platform, quiz, vote) => {
  const token = await getToken();
  const response = await axios.patch(
    `${ENDPOINT}/quizzes/${platform}/${quiz}/${vote}`,
    {},
    { headers: { authorization: `Bearer ${token}` } },
  );
  return response;
};

/* Search Routing */
export const getSearchResults = async (type, query, page, userFilter = null) => {
  const AMOUNT_PER_PAGE = 10;
  const token = await getToken();
  const response = await axios.get(
    `${ENDPOINT}/search?scope=${type}&searchQuery=${query}&page=${page}&amountPerPage=${AMOUNT_PER_PAGE}${
      userFilter ? `&userFilter=${userFilter}` : ""
    }`,
    {
      headers: { authorization: `Bearer ${token}` },
    },
  );
  return response.data.items;
};

/* AWS S3 Routing */
export const getUserIcon = async (username) => {
  try {
    const response = await axios.get(`${AWS_ENDPOINT}/users/${username}/avatar.png`);
    return `${AWS_ENDPOINT}/users/${username}/avatar.png`;
  } catch {
    return "/propic.png";
  }
};

export const getAllUserIcons = async (usernames) => {
  const promises = [];
  const icons = {};
  usernames.forEach((username) =>
    promises.push(
      getUserIcon(username).then((link) => {
        icons[username] = link;
      }),
    ),
  );
  await Promise.all(promises);
  return icons;
};

// https://sporadic-development-bucket.s3.amazonaws.com/platforms/MattLand/banner.png
export const getPlatformIcon = async (platform) => {
  try {
    const resp = await axios.get(`${AWS_ENDPOINT}/platforms/${platform}/icon.png`);
    if (resp.status != 200) {
      return "/platformIcon.png";
    }
    return `${AWS_ENDPOINT}/platforms/${platform}/icon.png`;
  } catch {
    return "/platformIcon.png";
  }
};

export const getAllPlatformIcons = async (platforms) => {
  const promises = [];
  const icons = {};
  platforms.forEach((platform) =>
    promises.push(
      getPlatformIcon(platform).then((link) => {
        icons[platform] = link;
      }),
    ),
  );
  await Promise.all(promises);
  return icons;
};

export const getPlatformBanner = async (platform) => {
  try {
    const resp = await axios.get(`${AWS_ENDPOINT}/platforms/${platform}/banner.png`);
    if (resp.status != 200) {
      return "/banner.jpg";
    }
    return `${AWS_ENDPOINT}/platforms/${platform}/banner.png`;
  } catch {
    return "/banner.jpg";
  }
};

export const getQuizIcon = async (platform, quiz) => {
  try {
    const resp = await axios.get(`${AWS_ENDPOINT}/platforms/${platform}/${quiz}/icon.png`);
    if (resp.status != 200) {
      return "/quizIcon.svg";
    }
    return `${AWS_ENDPOINT}/platforms/${platform}/${quiz}/icon.png`;
  } catch {
    return "/quizIcon.png";
  }
};

export const generateSetUserIconURL = async (username) => {
  try {
    const token = await getToken();
    const response = await axios.get(`${ENDPOINT}/users/${username}/set-avatar`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status == 200) {
      return response.data;
    } else {
      return null;
    }
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const generateSetQuizIconURL = async (platform, quiz) => {
  try {
    const token = await getToken();
    const response = await axios.get(`${ENDPOINT}/quizzes/${platform}/${quiz}/set-icon`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status == 200) {
      return response.data;
    } else {
      return null;
    }
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const generateSetPlatformIconURL = async (platform) => {
  try {
    const token = await getToken();
    const response = await axios.get(`${ENDPOINT}/platforms/${platform}/set-icon`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status == 200) {
      return response.data;
    } else {
      return null;
    }
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const generateSetPlatformBannerURL = async (platform) => {
  try {
    const token = await getToken();
    const response = await axios.get(`${ENDPOINT}/platforms/${platform}/set-banner`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status == 200) {
      return response.data;
    } else {
      return null;
    }
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const setImage = async (url, file) => {
  try {
    const response = await axios.put(url, file);
    if (response.status !== 200) {
      return -1;
    }
    return 1;
  } catch (e) {
    console.log(e);
    return -1;
  }
};
