const request = require("request-promise-native");

const fetchMyIP = () => request("https://api.ipify.org/?format=json");
const fetchCoordsByIP = body => {
  const ip = JSON.parse(body).ip;
  let url = `https://ipvigilante.com/json/${ip}`;
  return request(url);
};
const fetchISSFlyOverTimes = body => {
  let { latitude, longitude } = JSON.parse(body).data;
  let url = `http://api.open-notify.org/iss-pass.json?lat=${latitude}&lon=${longitude}`;
  return request(url);
};
const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then(data => {
      const { response } = JSON.parse(data);
      return response;
    });
};
module.exports = { nextISSTimesForMyLocation };
