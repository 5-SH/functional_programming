// https://api.iamport.kr
// https:github.com/iamport/iamport-manual/blob/master/%EC%9D%B8%EC%A6%9D%EA%B2%B0%EC%A0%9C/README.md

const delay = (time, a) => new Promise(resolve => setTimeout(() => resolve(a), time));
const curry = f => (a, ...bs) => (bs.length ? f(a, ...bs) : (...bs) => f(a, ...bs));
const L = {};
L.range = function*(stop) {
  let i = -1;
  while (++i < stop) yield i;
};
L.filter = curry(function*(f, iter) {
  for (const a of iter) {
    if (f(a)) {
      yield a;
    }
  }
});
L.map = curry(function*(f, iter) {
  for (const a of iter) {
    yield f(a);
  }
});
const take = curry(function(length, iter) {
  let res = [];
  for (const a of iter) {
    res.push(a);
    if (length == res.length) {
      return res;
    }
  }
  return res;
});
const reduce = curry(function(f, acc, iter) {
  if (arguments.length == 2) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  }
  for (const a of iter) {
    acc = f(acc, a);
  }
  return acc;
});
L.flat = function*(iter) {
  for (const a of iter) {
    if (a && a[Symbol.iterator]) yield* a;
    else yield a;
  }
};
const go1 = (a, f) => (a instanceof Promise ? a.then(f) : f(a));
const go = (...as) => {
  return reduce(go1, as);
};

const Impt = {
  payments: {
    0: [
      { iid: 11, oid: 1 },
      { iid: 12, oid: 2 },
      { iid: 13, oid: 3 }
    ],
    1: [
      { iid: 14, oid: 4 },
      { iid: 15, oid: 5 },
      { iid: 16, oid: 6 }
    ],
    2: [
      { iid: 17, oid: 7 },
      { iid: 18, oid: 8 }
    ],
    3: [],
    4: []
    // ...
  },
  getPayments: page => {
    console.log(`http://..?page=${page}`);
    return delay(1000 * 2, Impt.payments[page]);
  },
  cancelPayment: paymentId => Promise.resolve(`${paymentId}: cancel complete`)
};

const getOrders = ids => delay(100, [{ id: 1 }, { id: 3 }, { id: 7 }]);

const takeWhile = curry(function(f, iter) {
  iter = iter[Symbol.iterator]();
  iter.return = null;
  let res = [];
  return (function recur() {
    for (const a of iter) {
      const b = go1(a, f);
      if (!b) return res;
      if (b instanceof Promise) return b.then(async b => (b ? (res.push(await a), recur()) : res));
      res.push(a);
    }
    return res;
  })();
});

async function job() {
  const payments = await go(
    L.range(Infinity),
    L.map(Impt.getPayments),
    takeWhile(ps => ps.length),
    L.flat,
    take(Infinity)
  );

  const orderIds = await go(
    payments,
    L.map(p => p.oid),
    take(Infinity),
    getOrders,
    L.map(o => o.id),
    take(Infinity)
  );

  return Promise.all(
    go(
      payments,
      L.filter(p => !orderIds.includes(p.oid)),
      L.map(p => p.iid),
      take(Infinity),
      L.map(Impt.cancelPayment),
      take(Infinity)
    )
  );
}

async function recur() {
  return Promise.all([delay(1000 * 3), job().then(console.log)]).then(recur);
}

recur();
