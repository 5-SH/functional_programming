console.clear();

const users = [
  {
    name: 'a',
    age: 21,
    family: [
      { name: 'a1', age: 53 },
      { name: 'a2', age: 47 },
      { name: 'a3', age: 16 },
      { name: 'a4', age: 14 }
    ]
  },
  {
    name: 'b',
    age: 24,
    family: [
      { name: 'b1', age: 58 },
      { name: 'b2', age: 51 },
      { name: 'b3', age: 10 },
      { name: 'b4', age: 22 }
    ]
  },
  {
    name: 'c',
    age: 31,
    family: [
      { name: 'c1', age: 63 },
      { name: 'c2', age: 62 }
    ]
  },
  {
    name: 'd',
    age: 20,
    family: [
      { name: 'd1', age: 42 },
      { name: 'd1', age: 42 },
      { name: 'd3', age: 11 },
      { name: 'd4', age: 7 }
    ]
  }
];

const arr = [
  [1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [9, 10]
];

L.flat = function*(iter) {
  for (const a of iter) {
    if (a && a[Symbol.iterator]) yield* a;
    // {
    //   for (const b of a) {
    //     yield b;
    //   }
    // }
    else yield a;
  }
};

go(
  arr,
  L.flat,
  L.c_filter(a => a % 2),
  L.c_map(a => a * a),
  c_take(3),
  c_reduce(c_add),
  console.log
);

go(
  users,
  L.c_map(u => u.family),
  L.flat,
  L.c_filter(u => u.age < 20),
  L.c_map(u => u.age),
  c_take(3),
  c_reduce(c_add),
  console.log
);

function main() {}

main();
