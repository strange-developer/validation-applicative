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

# API

## Either (superclass)

### of(val: Any): Either
Accepts a value which will be wrapped in an `Either` instance. The value is a `Right` which can be `ap`'d over as depicted in the example.

### map(): Either
Accepts no parameters. Calling `.map` on an `Either` instance will return the `Either` instance.

### fold(errorFn: () => {}, successFn: () => {}): Any
Accepts two parameters of error and success which are both functions.
In the event of the instance being a `Left`, the `errorFn` will be called and passed an array of errors.
In the event of the instance being a `Right`, the `successFn` will be called and passed the value contained in the monad.
`fold` will return the ouput of the called function.

## Right (subclass of `Either`)

### of(val: Any): Right
Accepts a value which will be wrapped in a `Right` instance.

### map(fn: () => {}): Right
Accepts a function which will receive the value contained in the `Right` instance. No checks are done to validate whether the instance is a `Right`. This functionality is supplied by the `.ap` method on the `Right`.

### ap(functor: Either): Either
Accepts a parameter of type `Either`, `Left` or `Right`.
If the supplied parameter is a `Left`, the parameter will be returned.
If the supplied parameter is a `Right` or an `Either`, the supplied parameter's map method will be called and passed the value contained in current instance.

Code snippet of the `.ap` implementation:
```
class Right {
  ap(functor) {
    return functor.isLeft() ? functor : functor.map(this.value);
  }
}
```

## Left (subclass of Either)

### of(val: [])
Accepts a parameter of type `Array` which will be wrapped in a `Left` instance.

### ap(functor: Either): Left
Accepts a parameter of type `Either`, `Left` or `Right`.
If the supplied parameter is a `Left`, the supplied parameter's value will be concatenated into an error list.
If the supplied parameter is a `Right or an `Either`, the current instance will be returned.
