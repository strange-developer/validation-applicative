const { Either, Right, Left } = require('./src/index');

module.exports = {
  Either,
  Right,
  Left,
  Failure: Left,
  Fail: Left,
  Success: Right,
};
