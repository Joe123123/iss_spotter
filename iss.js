const request = require("request");

const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  request("https://api.ipify.org/?format=json", (err, response, body) => {
    if (err) {
      callback(err, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    let ip = JSON.parse(body).ip;
    callback(null, ip);
  });
};

const fetchCoordsByIP = function(ip, callback) {
  let url = `https://ipvigilante.com/${ip}`;
  request(url, (err, response, body) => {
    if (err) {
      callback(err, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    let { latitude, longitude } = JSON.parse(body).data;
    let obj = { latitude, longitude };
    callback(null, obj);
  });
};

const fetchISSFlyOverTimes = function(coords, callback) {
  let { latitude, longitude } = coords;
  let url = `http://api.open-notify.org/iss-pass.json?lat=${latitude}&lon=${longitude}`;
  request(url, (err, response, body) => {
    if (err) {
      callback(err, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    let arr = JSON.parse(body).response;
    callback(null, arr);
  });
};

const nextISSTimesForMyLocation = function(callback) {
  // ************* TRY THE HANDLER, FAILED **************
  // const handler = function(err, data) {
  //   if (err) {
  //     return callback(err, null);
  //   } else {
  //     return data;
  //   }
  // };
  // return callback(
  //   null,
  //   fetchISSFlyOverTimes(fetchCoordsByIP(fetchMyIP(handler), handler), handler)
  // );

  // ************* ANSWER FROM COMPASS **************
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, coords) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(coords, (error, arr) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, arr);
      });
    });
  });

  // ************ TRY PROMISES, FAILED *************
  // const handler = function(err, data) {
  //   if (err) {
  //     console.log(err);
  //     return;
  //     // return callback(err, null);
  //   } else {
  //     return data;
  //   }
  // };
  // let promise1 = new Promise(resolved => {
  //   return resolved(fetchMyIP(handler));
  // });
  // let promise2 = new Promise(resolved => {
  //   return resolved(fetchCoordsByIP(handler));
  // });
  // let promise3 = new Promise(resolved => {
  //   return resolved(fetchISSFlyOverTimes(handler));
  // });
  // promise1
  //   .then(() => promise2)
  //   .then(() => promise3)
  //   .then(arr => callback(null, arr))
  //   .catch(err => console.log(err));
};

module.exports = {
  fetchMyIP,
  fetchCoordsByIP,
  fetchISSFlyOverTimes,
  nextISSTimesForMyLocation
};
