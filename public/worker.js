function fib(num) {
  console.log('fib', num);
  if (num <= 1) return num;
  return fib(num - 1) + fib(num - 2);
}

// 监听主线程的消息
onmessage = function (event) {
  const n = event.data;
  const result = fib(n);
  console.log('result', result);
  postMessage(result);
};
