import { Injectable } from '@nestjs/common';
import { CalculationHelpers } from '../common/utils/calculation-helpers';

@Injectable()
export class EvaluateService {
  private operators = {
    '+': { precedence: 1, associativity: 'L' },
    '-': { precedence: 1, associativity: 'L' },
    '*': { precedence: 2, associativity: 'L' },
    '/': { precedence: 2, associativity: 'L' },
  };

  async evaluate(expression: string): Promise<number> {
    // Validate the expression
    if (!CalculationHelpers.validateExpression(expression)) {
      throw new Error('Expression contains invalid characters');
    }

    // Tokenize the expression
    const tokens = this.tokenize(expression);

    // Check for division by zero
    if (CalculationHelpers.checkForDivisionByZero(tokens)) {
      throw new Error('Division by zero is not allowed');
    }

    // Convert to postfix notation using the shunting-yard algorithm
    const postfix = this.infixToPostfix(tokens);

    // Evaluate the postfix expression concurrently
    const result = await this.evaluatePostfix(postfix);
    return result;
  }

  // Tokenize the input expression
  private tokenize(expression: string): string[] {
    const tokens: string[] = [];
    let numBuffer = '';

    for (let i = 0; i < expression.length; i++) {
      const char = expression[i];

      if (/\d/.test(char)) {
        numBuffer += char; // Accumulate digits for numbers
      } else {
        if (numBuffer) {
          tokens.push(numBuffer);
          numBuffer = '';
        }

        if (char in this.operators || char === '(' || char === ')') {
          tokens.push(char);
        }
      }
    }

    if (numBuffer) {
      tokens.push(numBuffer); // Push any remaining number
    }

    return tokens;
  }

  // Convert infix expression to postfix (Reverse Polish Notation)
  private infixToPostfix(tokens: string[]): string[] {
    const outputQueue: string[] = [];
    const operatorStack: string[] = [];

    for (const token of tokens) {
      if (/\d/.test(token)) {
        // If the token is a number, add it to the output queue
        outputQueue.push(token);
      } else if (token in this.operators) {
        // If the token is an operator
        const o1 = token;
        while (
          operatorStack.length > 0 &&
          operatorStack[operatorStack.length - 1] !== '(' &&
          this.hasHigherPrecedence(operatorStack[operatorStack.length - 1], o1)
        ) {
          outputQueue.push(operatorStack.pop());
        }
        operatorStack.push(o1);
      } else if (token === '(') {
        // If the token is a left parenthesis, push it to the stack
        operatorStack.push(token);
      } else if (token === ')') {
        // If the token is a right parenthesis, pop to the output queue until the left parenthesis is found
        while (
          operatorStack.length > 0 &&
          operatorStack[operatorStack.length - 1] !== '('
        ) {
          outputQueue.push(operatorStack.pop());
        }
        operatorStack.pop(); // Remove the left parenthesis
      }
    }

    // Pop any remaining operators
    while (operatorStack.length > 0) {
      outputQueue.push(operatorStack.pop());
    }

    return outputQueue;
  }

  // Check operator precedence
  private hasHigherPrecedence(op1: string, op2: string): boolean {
    return (
      this.operators[op1].precedence > this.operators[op2].precedence ||
      (this.operators[op1].precedence === this.operators[op2].precedence &&
        this.operators[op1].associativity === 'L')
    );
  }

  // Evaluate the postfix expression concurrently
  private async evaluatePostfix(postfix: string[]): Promise<number> {
    const stack: Promise<number>[] = [];

    for (const token of postfix) {
      if (/\d/.test(token)) {
        // If the token is a number, push it onto the stack
        stack.push(Promise.resolve(parseFloat(token)));
      } else if (token in this.operators) {
        // If the token is an operator, pop two operands and apply the operator
        const bPromise = stack.pop();
        const aPromise = stack.pop();

        // Create a new promise for the operation
        const resultPromise = Promise.all([aPromise, bPromise]).then(
          ([a, b]) => {
            return this.performOperation(token, a, b);
          },
        );

        stack.push(resultPromise);
      }
    }

    // Wait for all operations to finish and resolve results
    const results = await Promise.all(stack);
    return results[results.length - 1]; // The final result will be the last one
  }

  // Perform the operation and return a Promise
  private performOperation(operator: string, a: number, b: number): number {
    let result: number;
    switch (operator) {
      case '+':
        result = a + b;
        break;
      case '-':
        result = a - b;
        break;
      case '*':
        result = a * b;
        break;
      case '/':
        result = a / b;
        break;
      default:
        throw new Error(`Unknown operator: ${operator}`);
    }
    return result;
  }
}
