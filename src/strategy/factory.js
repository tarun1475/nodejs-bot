const Simple = require("./simple");

exports.create = function(type, data) {
  // TODO: we can handle different strategis through switch case and some map.
  return new Simple(data);
};
