// eslint-disable-next-line @typescript-eslint/no-require-imports
const { parentPort, workerData } = require('worker_threads');

const operators = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b,
};

const evaluatePostfix = (postfix) => {
  const stack = [];

  for (const token of postfix) {
    if (/\d/.test(token)) {
      stack.push(parseFloat(token));
    } else if (token in operators) {
      const b = stack.pop();
      const a = stack.pop();
      const result = operators[token](a, b);
      stack.push(result);
    }
  }

  return stack[0];
};

const result = evaluatePostfix(workerData.postfix);
parentPort.postMessage(result);
