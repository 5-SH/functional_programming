// generator 를 활용한 async, await 구현
// promise retrun
// promise.then() return promise object
// promise.reject() return rejected promise object resolved with given value
// promise.resolve(value) return promise.then() object
// await promise return fullfilled value

function* orderCoffee(phoneNumber) {
  const id = yield getId(phoneNumber);
  const email = yield getEmail(id);
  const name = yield getName(email);
  const result = yield order(name, 'coffee');
  return result;
}

const iterator = orderCoffee('010-0000-0000');

let ret;
(function runNext(val) {
  ret = iterator.next(val);
  if (!ret.done) {
    ret.value.then(runNext, error => {});
  } else {
    console.log('result : ', ret.value);
  }
})();

function getId(phoneNumber) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (phoneNumber === '010-0000-0000') {
        console.log('getId');
        resolve('asdf1234');
      } else reject('getId');
    }, 1000);
  });
}

function getEmail(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id === 'asdf1234') {
        console.log('getEmail');
        resolve('asdf1234@naver.com');
      } else reject('getEmail');
    }, 1000);
  });
}

function getName(email) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === 'asdf1234@naver.com') {
        console.log('getName');
        resolve('ki');
      } else reject('getName');
    }, 1000);
  });
}

function order(name) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (name === 'ki') {
        console.log('order');
        resolve('order success');
      } else reject('order');
    }, 1000);
  });
}
