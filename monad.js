///////////////////////////////////// monad /////////////////////////////////////
// - f.g
// f(g(x)) = f(g(x))
// f(g(x)) = x
// 안전한 함수 합성을 위해 모나드 사용

// const g = a => a + 1;
// const f = a => a * a;

// console.log(f(g(1)));
// [1, 2, 3, 4, 5]
//   .map(g)
//   .map(f)
//   .forEach(a => console.log(a));

// promise : future monad
// Promise.resolve(1)
//   .then(g)
//   .then(f)
//   .then(a => console.log(a));

///////////////////////////////////// promise /////////////////////////////////////
// Kleisli Composition, Promise
// f(g(x)) = g(x)

const g = JSON.parse;
const f = ({ k }) => k;

const fg = x =>
  Promise.resolve(x)
    .then(g)
    .then(f);

// fg(`{ "k": 10 }`).then(console.log);
// fg(`{ "k: 10 }`)
//   .catch(_ => 'error')
//   .then(console.log);

// 일급, promise, go1
// promise 는 비동기 상황을 일급함수 처럼 사용할 수 있게 한다.
const delay = (time, a) => new Promise(resolve => setTimeout(() => resolve(a), time));

// delay(100, 5).then(console.log);
const a = delay(100, 5);
// console.log(a);
// console.log(a instanceof Promise);
// if (true) a.then(console.log);

const curry = f => (a, ...bs) => (bs.length ? f(a, ...bs) : (...bs) => f(a, ...bs));
const c_reduce = curry(function(f, acc, iter) {
  if (arguments.length == 2) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  }
  for (const a of iter) {
    acc = f(acc, a);
  }
  return acc;
});

const go1 = (a, f) => (a instanceof Promise ? a.then(f) : f(a));
const go2 = (...as) => {
  return c_reduce(go1, as);
};

const b = 10;
const c = delay(1000, 5);
// go1(b, console.log);
// go1(c, console.log);

go2(
  Promise.resolve(1),
  a => a + 1,
  a => delay(2000, a),
  console.log
);

const d = go2(
  Promise.resolve(2),
  a => a + 1,
  a => delay(3000, a)
);

// 원하는 시점에 평가 할 수 있다.
if (true) d.then(console.log);

async function af() {
  const a = await go2(
    Promise.resolve(3),
    a => a + 1,
    a => delay(4000, a)
  );

  const b = await go2(
    Promise.resolve(4),
    a => a + 1,
    a => delay(5000, a)
  );
  // 9초 뒤 실행
  console.log(a, b);
  // 15초 뒤 실행
  setTimeout(() => console.log(a + 1, b + 1), 6000);
}

af();
