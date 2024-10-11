# Math Expression Evaluator

A NestJS application that evaluates mathematical expressions using a worker thread for parallel computation. This project demonstrates the use of a service-oriented architecture and worker threads in Node.js to handle complex calculations without blocking the main thread.

## Table of Contents

- [Features](#features)
- [Installation & Usage](#installation--usage)
- [How It Works](#how-it-works)
- [Example](#example)
- [Testing](#testing)

## Features

- Evaluates simple and complex mathematical expressions.
- Supports parentheses and operator precedence.
- Utilizes worker threads and promises to perform calculations in parallel.
- Unit tests for service logic.
- Error handling.

## Installation & Usage

- npm install
- npm run start

## How It Works

1. **Expression Submission**: The client sends a mathematical expression to the server via a POST request to the `/evaluate` endpoint.

2. **Validation**: The `EvaluateService` validates the expression to check for invalid characters and division by zero.

3. **Tokenization**: The expression is tokenized into individual components (numbers, operators, and parentheses).

4. **Infix to Postfix Conversion**: The expression is converted from infix notation (standard mathematical notation) to postfix notation (Reverse Polish Notation) using the shunting-yard algorithm.

5. **Parallel Evaluation**: The postfix expression is sent to a worker thread via the `WorkerService`, which evaluates it in parallel.

6. **Result Return**: The result is sent back to the client.

## Example

To evaluate the expression `(1 - 1) * 2 + 3 * (1 - 3 + 4) + 10 / 2`, you can send a POST request to the `/evaluate` endpoint.

### Example Request

Using cURL, you can execute the following command:

```bash
curl -X POST http://localhost:3000/evaluate -H "Content-Type: application/json" -d '{"expression": "(1 - 1) * 2 + 3 * (1 - 3 + 4) + 10 / 2"}'
```

{
"result": 11
}

## Testing

To run the tests for the application, use the following command:

- npm run test
