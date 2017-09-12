# validation-applicative
Composable, accumulative validations built on an Either Monad

[![Build Status](https://travis-ci.org/strange-developer/validation-applicative.svg?branch=master)](https://travis-ci.org/strange-developer/validation-applicative)

Usage:

```
const validator = require('validator');
const { curryN } = require('ramda');
const {
  Either,
  Right,
  Left,
} = require('validation-applicative');

function isUsernameEmpty(username) {
  return validator.isEmpty(username)
    ? Left.of(['Username is empty'])
    : Right.of(username);
}

function isUsernameAnEmail(username) {
  return validator.isEmail(username)
    ? Right.of(username)
    : Left.of(['Please supply a valid email address as a username']);
}

function errorFn(errorList) {
  return errorList;
}

function successFn(username) {
  return username;
}

function validate(username) {
  // using ramda's curryN methpd
  // curry the success function by the number of .ap's used
  // in this case, we want to return the parameters that were validated
  const success = curryN(2, () => username);
  Either.of(success)
    .ap(isUsernameEmpty(username))
    .ap(isUsernameAnEmail(username))
    .fold(errorFn, successFn); //will return an array of errors, or the username
}

```
