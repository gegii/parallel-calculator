export class CalculationHelpers {
  // Helper method to check operator precedence
  static hasHigherPrecedence(
    op1: string,
    op2: string,
    operators: any,
  ): boolean {
    const o1 = operators[op1];
    const o2 = operators[op2];
    return (
      o1.precedence > o2.precedence ||
      (o1.precedence === o2.precedence && o1.associativity === 'L')
    );
  }

  static checkParentheses(expression: string): boolean {
    let balance = 0;

    for (const char of expression) {
      if (char === '(') {
        balance++;
      } else if (char === ')') {
        balance--;
        // If balance goes negative, we have a closing parenthesis without a matching opening parenthesis
        if (balance < 0) {
          return false;
        }
      }
    }

    // At the end, balance should be zero if all parentheses are matched
    return balance === 0;
  }

  // Validate the expression (only digits, operators, and parentheses)
  static validateExpression(expression: string): boolean {
    const validExpression = /^[0-9+\-*/() ]+$/.test(expression);
    return validExpression && this.checkParentheses(expression);
  }

  // Utility method to detect division by zero (can be extended)
  static checkForDivisionByZero(tokens: string[]): boolean {
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i] === '/' && tokens[i + 1] === '0') {
        return true; // Division by zero found
      }
    }
    return false;
  }
}
