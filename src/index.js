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

  ffold(leftFn, rightFn) {
    const that = this;
    return function() {
      return that.isLeft() ? leftFn(that.value) : rightFn(that.value);
    };
  }
}

class Right extends Either {
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
