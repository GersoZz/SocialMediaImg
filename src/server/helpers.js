const moment = require("moment");
const path = require("path");

const helpers = {};

helpers.timeago = (timestamp) => {
  return moment(timestamp).startOf("minute").fromNow();
};

helpers.ext = (filename) => {
  return filename.replace(path.extname(filename), "");
};

module.exports = helpers;
