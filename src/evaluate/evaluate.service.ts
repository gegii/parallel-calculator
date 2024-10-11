import { Injectable } from '@nestjs/common';
import { WorkerService } from './worker.service'; // Import WorkerService
import { CalculationHelpers } from '../common/utils/calculation-helpers';

@Injectable()
export class EvaluateService {
  constructor(private readonly workerService: WorkerService) {} // Inject WorkerService

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

    // Evaluate the postfix expression using the worker service
    const result = await this.workerService.evaluatePostfix(postfix);
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
        outputQueue.push(token);
      } else if (token in this.operators) {
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
        operatorStack.push(token);
      } else if (token === ')') {
        while (
          operatorStack.length > 0 &&
          operatorStack[operatorStack.length - 1] !== '('
        ) {
          outputQueue.push(operatorStack.pop());
        }
        operatorStack.pop();
      }
    }

    while (operatorStack.length > 0) {
      outputQueue.push(operatorStack.pop());
    }

    return outputQueue;
  }

  private hasHigherPrecedence(op1: string, op2: string): boolean {
    return (
      this.operators[op1].precedence > this.operators[op2].precedence ||
      (this.operators[op1].precedence === this.operators[op2].precedence &&
        this.operators[op1].associativity === 'L')
    );
  }
}
