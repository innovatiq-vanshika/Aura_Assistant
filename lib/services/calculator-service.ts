"use client";

class CalculatorService {
  calculate(a: number, b: number, operation: string): number {
    switch (operation) {
      case 'add':
        return a + b;
      case 'subtract':
        return a - b;
      case 'multiply':
        return a * b;
      case 'divide':
        if (b === 0) throw new Error('Division by zero');
        return a / b;
      case 'power':
        return Math.pow(a, b);
      default:
        throw new Error('Unknown operation');
    }
  }
  
  factorial(n: number): number {
    // Check for valid input
    if (n < 0 || !Number.isInteger(n)) {
      throw new Error('Factorial requires a non-negative integer');
    }
    
    if (n === 0 || n === 1) {
      return 1;
    }
    
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    
    return result;
  }
}

export const calculatorService = new CalculatorService();