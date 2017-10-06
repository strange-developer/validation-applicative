import { expect } from 'chai';
import { curryN, identity, toUpper } from 'ramda';
import { Either, Right, Left } from '../src/index';

describe('Either', () => {
  it('creates wrapped Either instance', () => {
    const expected = Object.create(Either.prototype, {
      value: { value: 'test', enumerable: true },
    });
    expect(new Either('test')).to.deep.eq(expected);
  });
  it('of', () => {
    const expected = new Either('test');
    expect(Either.of('test')).to.deep.eq(expected);
  });
  it('isLeft', () => {
    expect(Either.of('test is left').isLeft()).to.be.false;
  });
  it('isRight', () => {
    expect(Either.of('test is right').isRight()).to.be.true;
  });
  it('noop', () => {
    expect(Either.of('isSuccess').noop()).to.deep.eq(Either.of('isSuccess'));
  });
  it('map', () => {
    expect(new Either('map').map()).to.deep.eq(Either.of('map'));
  });
  describe('ap', () => {
    it('returns Left', () => {
      const expected = Left.of(['error1']);
      const actual = Either.of(curryN(2, identity)('test-value')).ap(
        Left.of(['error1']),
      );
      expect(actual).to.deep.eq(expected);
    });
    it('returns Right', () => {
      const expected = Right.of({
        username: 'strange',
        password: 'developer',
      });
      const innerValue = { username: 'strange', password: 'developer' };
      const actual = Either.of(curryN(2, identity)(innerValue)).ap(
        Right.of(innerValue),
      );
      expect(actual).to.deep.eq(expected);
    });
  });
  describe('fold', () => {
    it('executes leftFn', () => {
      const expected = ['error1', 'error2'];
      const actual = Either.of(curryN(3, identity)('test-value'))
        .ap(Left.of(['error1']))
        .ap(Left.of(['error2']))
        .fold(identity, () => true);
      expect(actual).to.deep.eq(expected);
    });
    it('executes rightFn', () => {
      const expected = { username: 'strange-developer' };
      const innerValue = { username: 'strange-developer' };
      const actual = Either.of(curryN(3, identity)(innerValue))
        .ap(Right.of({ username: 'strange-developer' }))
        .ap(Right.of({ username: 'strange-developer' }))
        .fold(() => false, identity);
      expect(actual).to.deep.eq(expected);
    });
  });
  describe('ffold', () => {
    it('returns a function', () => {
      const actual = Either.of(curryN(3, identity)('test-value'))
        .ap(Left.of(['error1']))
        .ap(Left.of(['error2']))
        .ffold(() => false, () => true);
      expect(actual).to.be.a('function');
    });
    it('executes leftFn', () => {
      const expected = ['error1', 'error2'];
      const actual = Either.of(curryN(3, identity)('test-value'))
        .ap(Left.of(['error1']))
        .ap(Left.of(['error2']))
        .ffold(identity, () => true);
      expect(actual()).to.deep.eq(expected);
    });
    it('executes rightFn', () => {
      const expected = { username: 'strange-developer' };
      const innerValue = { username: 'strange-developer' };
      const actual = Either.of(curryN(3, identity)(innerValue))
        .ap(Right.of({ username: 'strange-developer' }))
        .ap(Right.of({ username: 'strange-developer' }))
        .ffold(() => false, identity);
      expect(actual()).to.deep.eq(expected);
    });
  });
});

describe('Right', () => {
  describe('constructor', () => {
    it('creates wrapped Right instance', () => {
      const expected = Object.create(Right.prototype, {
        value: { value: 'test', enumerable: true },
      });
      expect(new Right('test')).to.deep.eq(expected);
    });
    it('of', () => {
      const expected = new Right('test');
      expect(Right.of('test')).to.deep.eq(expected);
    });
    it('isLeft', () => {
      expect(Right.of('test is left').isLeft()).to.be.false;
    });
    it('isRight', () => {
      expect(Right.of('test is right').isRight()).to.be.true;
    });
    it('map', () => {
      const expected = Right.of('STRANGE-DEVELOPER');
      const actual = Right.of('strange-developer').map(toUpper);
      expect(actual).deep.eq(expected);
    });
    describe('ap', () => {
      it('returns Left', () => {
        const expected = Left.of(['error1']);
        const actual = Right.of(curryN(2, identity)('test-value')).ap(
          Left.of(['error1']),
        );
        expect(actual).to.deep.eq(expected);
      });
      it('returns Right', () => {
        const expected = Right.of({
          username: 'strange',
          password: 'developer',
        });
        const innerValue = { username: 'strange', password: 'developer' };
        const actual = Right.of(curryN(2, identity)(innerValue)).ap(
          Right.of(innerValue),
        );
        expect(actual).to.deep.eq(expected);
      });
    });
  });
});

describe('Left', () => {
  describe('constructor', () => {
    it('creates wrapped Left instance', () => {
      const expected = Object.create(Left.prototype, {
        value: { value: 'test', enumerable: true },
      });
      expect(new Left('test')).to.deep.eq(expected);
    });
    it('of', () => {
      const expected = new Left('test');
      expect(Left.of('test')).to.deep.eq(expected);
    });
    it('isLeft', () => {
      expect(Left.of('test is left').isLeft()).to.be.true;
    });
    it('isRight', () => {
      expect(Left.of('test is right').isRight()).to.be.false;
    });
    describe('ap', () => {
      it('returns Left', () => {
        const expected = Left.of(['error1']);
        const innerValue = { username: 'Bob' };
        const actual = Either.of(curryN(3, identity)('test'))
          .ap(Left.of(['error1']))
          .ap(Right.of(innerValue));
        expect(actual).to.deep.eq(expected);
      });
      it('concatenates errors in Left', () => {
        const expected = Left.of(['error1', 'error2']);
        const innerValue = { username: 'Bob' };
        const actual = Either.of(curryN(3, identity)('test'))
          .ap(Left.of(['error1']))
          .ap(Left.of(['error2']))
          .ap(Right.of(innerValue));
        expect(actual).to.deep.eq(expected);
      });
    });
  });
});

describe('Either, Right and Left Integration tests', () => {
  it('returns Right', () => {
    const expected = Right.of({ username: 'strange', password: 'developer' });
    const innerValue = { username: 'strange', password: 'developer' };
    const actual = Either.of(curryN(4, identity)(innerValue))
      .ap(Right.of(innerValue))
      .ap(Right.of(innerValue))
      .ap(Right.of(innerValue));
    expect(actual).to.deep.eq(expected);
  });
  it('returns Left when first application is error and second is success', () => {
    const expected = Left.of(['first-error']);
    const innerValue = { username: 'strange', password: 'developer' };
    const actual = Either.of(curryN(4, identity)(innerValue))
      .ap(Left.of(['first-error']))
      .ap(Right.of(innerValue))
      .ap(Right.of(innerValue));
    expect(actual).to.deep.eq(expected);
  });
  it('returns Left when last application is error and first is success', () => {
    const expected = Left.of(['last-error']);
    const innerValue = { username: 'strange', password: 'developer' };
    const actual = Either.of(curryN(4, identity)(innerValue))
      .ap(Right.of(innerValue))
      .ap(Right.of(innerValue))
      .ap(Left.of(['last-error']));
    expect(actual).to.deep.eq(expected);
  });
  it('concatenates errors when only errors', () => {
    const expected = Left.of(['first-error', 'second-error', 'third-error']);
    const innerValue = { username: 'strange', password: 'developer' };
    const actual = Either.of(curryN(4, identity)(innerValue))
      .ap(Left.of(['first-error']))
      .ap(Left.of(['second-error']))
      .ap(Left.of(['third-error']));
    expect(actual).to.deep.eq(expected);
  });
  it('concatenates errors when one success', () => {
    const expected = Left.of(['first-error', 'second-error']);
    const innerValue = { username: 'strange', password: 'developer' };
    const actual = Either.of(curryN(4, identity)(innerValue))
      .ap(Left.of(['first-error']))
      .ap(Right.of(innerValue))
      .ap(Left.of(['second-error']));
    expect(actual).to.deep.eq(expected);
  });
});
