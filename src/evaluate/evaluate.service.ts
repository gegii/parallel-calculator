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

  evaluate(expression: string): number {
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

    // Evaluate the postfix expression
    return this.evaluatePostfix(postfix);
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
          CalculationHelpers.hasHigherPrecedence(
            operatorStack[operatorStack.length - 1],
            o1,
            this.operators,
          )
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

  // Evaluate the postfix expression
  private evaluatePostfix(postfix: string[]): number {
    const stack: number[] = [];

    for (const token of postfix) {
      if (/\d/.test(token)) {
        // If the token is a number, push it onto the stack
        stack.push(parseFloat(token));
      } else if (token in this.operators) {
        // If the token is an operator, pop two operands and apply the operator
        const b = stack.pop();
        const a = stack.pop();

        switch (token) {
          case '+':
            stack.push(a + b);
            break;
          case '-':
            stack.push(a - b);
            break;
          case '*':
            stack.push(a * b);
            break;
          case '/':
            stack.push(a / b);
            break;
        }
      }
    }

    return stack.pop(); // The final result should be the last item on the stack
  }
}
