class Either {
  constructor(value) {
    this.value = value;
  }

  static of(value) {
    return new Right(value);
  }

  isLeft() {
    return false;
  }

  isRight() {
    return true;
  }

  noop() {
    return this;
  }

  map() {
    return this.noop();
  }

  ap(functor) {
    return functor.isLeft() ? functor : functor.map(this.value);
  }

  fold(leftFn, rightFn) {
    return this.isLeft() ? leftFn(this.value) : rightFn(this.value);
  }
}

class Right extends Either {
  constructor(val) {
    super(val);
  }

  isLeft() {
    return false;
  }

  isRight() {
    return true;
  }

  map(fn) {
    return Right.of(fn(this.value));
  }

  ap(functor) {
    return functor.isLeft() ? functor : functor.map(this.value);
  }
}

class Left extends Either {
  constructor(val) {
    super(val);
  }

  static of(val) {
    return new Left(val);
  }

  isLeft() {
    return true;
  }

  isRight() {
    return false;
  }

  ap(functor) {
    return functor.isLeft() ? new Left(this.value.concat(functor.value)) : this;
  }
}

module.exports = { Either, Right, Left };
