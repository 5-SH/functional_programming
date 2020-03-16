// function f(list, length) {
//   let i = 0;
//   let acc = 0;
//   for (const a of list) {
//     if (a % 2) {
//       acc = acc + a * a;
//       if (++i == length) break;
//     }
//   }
//   return acc;
// };

///////////////////////////////////// functional programming /////////////////////////////////////

function add(a, b) {
  return a + b;
}

function* filter(f, iter) {
  for (const a of iter) {
    if (f(a)) yield a;
  }
}

function* map(f, iter) {
  for (const a of iter) {
    yield f(a);
  }
}

function take(length, iter) {
  let res = [];
  for (const a of iter) {
    res.push(a);
    if (length == res.length) {
      return res;
    }
  }
  return res;
}

function reduce(f, acc, iter) {
  if (arguments.length == 2) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  }
  for (const a of iter) {
    acc = f(acc, a);
  }
  return acc;
}

///////////////////////////////////// list processing /////////////////////////////////////

const go = (...as) => {
  return reduce((a, f) => f(a), as);
};

const f2 = (list, length) =>
  go(
    list,
    list => filter(a => a % 2, list),
    list => map(a => a * a, list),
    list => take(length, list),
    list => reduce(add, 0, list)
  );

const f = (iter, length) =>
  reduce(
    add,
    0,
    take(
      length,
      map(
        a => a * a,
        filter(a => a % 2, iter)
      )
    )
  );

///////////////////////////////////// curry function /////////////////////////////////////

// function 의 argument 가 2 개 일때만 동작
const curry = f => (a, ...bs) => (bs.length ? f(a, ...bs) : (...bs) => f(a, ...bs));

// function curry(f) {
//   return function(a, ...bs) {
//     return bs.length
//       ? f(a, ...bs)
//       : function(...bs) {
//           return f(a, ...bs);
//         };
//   };
// }

// function 의 argument 수와 상관없이 동작
// 하지만 c_reduce 의 argument 는 3개라서 c_reduce(c_add, 0) 로 c_go 의 reduce 가 동작하지 않는다.
// function curry(f) {
//   const arity = f.length;
//   return (function resolver() {
//     const memory = Array.prototype.slice.call(arguments);
//     return function() {
//       const local = memory.slice();
//       Array.prototype.push.apply(local, arguments);
//       next = local.length >= arity ? f : resolver;
//       return next.apply(null, local);
//     };
//   })();
// }

const L = {};

const c_add = curry((a, b) => a + b);

L.range = function*(stop) {
  let i = -1;
  while (++i < stop) yield i;
};

// generator function : yield - return처럼 함수를 종료한다.
// 함수를 재호출(next())할경우 해당 지점에서 시작한다.
// next() - generator를 실행한다. yield구문까지 실행하고 종료한다.
// 그리고 재호출시 마지막 yield지점에서 시작한다.
L.c_filter = curry(function*(f, iter) {
  for (const a of iter) {
    if (f(a)) {
      yield a;
    }
  }
});

L.c_map = curry(function*(f, iter) {
  for (const a of iter) {
    yield f(a);
  }
});

const c_take = curry(function(length, iter) {
  let res = [];
  // const a of iter 에서 filter, map 을 거친 generator 가 실행된다.
  // generator 는 지연 평가
  for (const a of iter) {
    res.push(a);
    if (length == res.length) {
      return res;
    }
  }
  return res;
});

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

const c_go = (...as) => {
  return c_reduce((a, f) => f(a), as);
};

const f3 = (list, length) =>
  c_go(
    list,
    L.c_filter(a => a % 2),
    L.c_map(a => a * a),
    c_take(length),
    c_reduce(c_add)
  );

function main() {
  //////////// functional programming ///////////
  // console.log('//////////// functional programming ///////////');
  // console.log(f([1, 2, 3, 4, 5], 1));
  // console.log(f([1, 2, 3, 4, 5], 2));
  // console.log(f([1, 2, 3, 4, 5], 3));

  //////////// list processing ///////////
  // console.log('//////////// list processing ///////////');
  // console.log(f2([1, 2, 3, 4, 5], 1));
  // console.log(f2([1, 2, 3, 4, 5], 2));
  // console.log(f2([1, 2, 3, 4, 5], 3));

  console.log('//////////// curry function ///////////');
  console.log(f3([1, 2, 3, 4, 5], 1));
  console.log(f3([1, 2, 3, 4, 5], 2));
  console.log(f3(L.range(Infinity), 200));
}

main();

module.exports = L;
