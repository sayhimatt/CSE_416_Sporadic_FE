import React from "react";

const IQhelper = {
  a: 100,
  b: 15,
  // returns the totalCorrect value for specified username
  getUserScore: function(scores, username){
    const userScore = scores.scores.find( (score) => {
      return score.username == username;
    }).totalCorrect;
    return userScore;
  },
  // returns an array of all the score numbers, without usernames
  getScoresArray: function(scores){
    return scores.map(score => score.totalCorrect);
  },
  // returns the mean of an array of scores
  calcMean: function(scoresArray){

  },
  // returns the standard deviation of an array of scores
  calcSD: function(scoresArray){
    const n = scoresArray.length
    if (n == 0) throw 'No users have taken a quiz in this platform';
    const mean = scoresArray.reduce((a, b) => a + b) / n
    var sd = Math.sqrt(scoresArray.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
    if (sd == 0) sd = 1;
    return sd;
  },

  calcUserIQ: function(scores, username){

  },

  calcMultipleIQs: function(scores, usernames){
    
  } 

}

export default IQhelper