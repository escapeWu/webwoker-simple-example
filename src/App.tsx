import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function fib(num: number): number {
  console.log('fib', num)
  if (num <= 1) return num;
  return fib(num - 1) + fib(num - 2);
}
const worker = new Worker('/worker.js');
// 封装 Web Worker 调用成 Promise
function calculateFibonacci(n: number): Promise<number> {
  return new Promise((resolve, reject) => {
    
    worker.postMessage(n);

    worker.onmessage = (event) => {
      resolve(event.data);
    };

    worker.onerror = (error) => {
      reject(error);
    };
  });
}

function App() {
  const [count, setCount] = useState(0);
  const [calcRes, setCalcRes] = useState(0);

  const [syncCount, setSyncCount] = useState(0);
  const [syncRes, setSyncRes] = useState(0);

  const [isCalculating, setIsCalculating] = useState(false)
  const [isCalculatingSync, setIsCalculatingSync] = useState(false)
  const [timestamp, setTimestamp] = useState(Date.now())
  const [param, setParam] = useState(20)

  useEffect(() => {
    if (count <= 0) return
    setIsCalculating(true)
    calculateFibonacci(count)
      .then((result) => {
        setCalcRes(result);
      })
      .catch((error) => {
        console.error('Error calculating Fibonacci:', error);
      }).finally(() => {
        setIsCalculating(false)
      })
  }, [count]);

  
  useEffect(() => {
    if (syncCount <= 0) return

    setIsCalculatingSync(true)
    setSyncRes(fib(syncCount))
    setIsCalculatingSync(false)

  }, [syncCount])

  // 用于界面判断**渲染进程**是否被阻塞
  useEffect(() => {
    function logTime() {
      setTimestamp(Date.now())
      requestAnimationFrame(logTime)
    }
    requestAnimationFrame(logTime)
  }, [])

  function reset() {
    setParam(0)
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>{timestamp}</h1>
      <div className="card">
        <button onClick={() => setParam((param) => param + 10)}>
          param(click to + 10): {param}
        </button>
        
        <div style={{ marginTop: '10px' }}></div>

        <button onClick={() => setCount(param)}>
          worker 计算: {param}
        </button>

        <span >fib is {isCalculating ? 'computing ...': calcRes}</span>
        
        <div style={{ marginTop: '10px' }}></div>
        <button style={{marginLeft: '10px'}} onClick={() => setSyncCount(param)}>
          默认计算: {param}
        </button>
        <span >fib is {isCalculatingSync ? 'computing ...': syncRes}</span>
        <p>
          <button style={{marginLeft: '10px'}} onClick={reset}>Reset</button>
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
