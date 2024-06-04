function fib(num: number): number {
  if (num <= 1) return num;
  return fib(num - 1) + fib(num - 2);
}

// 监听主线程的消息
onmessage = function (event: MessageEvent): void {
  const n: number = event.data;
  const result: number = fib(n);
  postMessage(result);
};
