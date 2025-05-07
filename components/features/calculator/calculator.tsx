"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { calculatorService } from '@/lib/services/calculator-service';

export default function Calculator() {
  const [displayValue, setDisplayValue] = useState('0');
  const [storedValue, setStoredValue] = useState<string | null>(null);
  const [operationType, setOperationType] = useState<string | null>(null);
  const [isNewInput, setIsNewInput] = useState(true);
  const [calculatorType, setCalculatorType] = useState<'standard' | 'scientific'>('standard');
  const [history, setHistory] = useState<string[]>([]);

  const clear = () => {
    setDisplayValue('0');
    setStoredValue(null);
    setOperationType(null);
    setIsNewInput(true);
  };

  const clearEntry = () => {
    setDisplayValue('0');
    setIsNewInput(true);
  };

  const toggleSign = () => {
    setDisplayValue(displayValue.startsWith('-') ? displayValue.substring(1) : '-' + displayValue);
  };

  const appendNumber = (num: string) => {
    if (isNewInput) {
      setDisplayValue(num);
      setIsNewInput(false);
    } else {
      setDisplayValue(displayValue === '0' ? num : displayValue + num);
    }
  };

  const appendDecimal = () => {
    if (isNewInput) {
      setDisplayValue('0.');
      setIsNewInput(false);
    } else if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
    }
  };

  const doOperation = (operation: string) => {
    if (operationType) {
      calculate();
    }
    
    setStoredValue(displayValue);
    setOperationType(operation);
    setIsNewInput(true);
  };

  const calculate = () => {
    if (!operationType || !storedValue) return;
    
    try {
      const result = calculatorService.calculate(
        parseFloat(storedValue),
        parseFloat(displayValue),
        operationType
      );
      
      // Store calculation in history
      const calculation = `${storedValue} ${getOperationSymbol(operationType)} ${displayValue} = ${result}`;
      setHistory([calculation, ...history.slice(0, 9)]);
      
      setDisplayValue(result.toString());
      setStoredValue(null);
      setOperationType(null);
      setIsNewInput(true);
    } catch (error) {
      setDisplayValue('Error');
      setIsNewInput(true);
    }
  };

  const getOperationSymbol = (op: string) => {
    switch (op) {
      case 'add': return '+';
      case 'subtract': return '-';
      case 'multiply': return '×';
      case 'divide': return '÷';
      case 'power': return '^';
      default: return op;
    }
  };

  const scientificOperation = (operation: string) => {
    try {
      const value = parseFloat(displayValue);
      let result: number;
      
      switch (operation) {
        case 'square':
          result = value * value;
          break;
        case 'sqrt':
          result = Math.sqrt(value);
          break;
        case 'reciprocal':
          result = 1 / value;
          break;
        case 'sin':
          result = Math.sin(value);
          break;
        case 'cos':
          result = Math.cos(value);
          break;
        case 'tan':
          result = Math.tan(value);
          break;
        case 'log':
          result = Math.log10(value);
          break;
        case 'ln':
          result = Math.log(value);
          break;
        case 'factorial':
          result = calculatorService.factorial(value);
          break;
        default:
          return;
      }
      
      // Store calculation in history
      const calculation = `${operation}(${displayValue}) = ${result}`;
      setHistory([calculation, ...history.slice(0, 9)]);
      
      setDisplayValue(result.toString());
      setIsNewInput(true);
    } catch (error) {
      setDisplayValue('Error');
      setIsNewInput(true);
    }
  };

  const memoryOperation = (operation: string) => {
    // Implementation for memory operations
    // MS, MR, M+, M-, MC operations
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calculator</CardTitle>
        <CardDescription>Perform calculations with standard and scientific functions</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs 
          defaultValue="standard" 
          value={calculatorType}
          onValueChange={(value) => setCalculatorType(value as 'standard' | 'scientific')}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="standard">Standard</TabsTrigger>
            <TabsTrigger value="scientific">Scientific</TabsTrigger>
          </TabsList>
          
          <div className="my-4">
            <div className="relative">
              <div className="text-xs text-muted-foreground absolute top-1 right-4">
                {operationType && `${storedValue} ${getOperationSymbol(operationType)}`}
              </div>
              <input
                type="text"
                className="w-full p-6 text-3xl text-right font-mono bg-muted rounded-md overflow-hidden"
                value={displayValue}
                readOnly
              />
            </div>
            
            {/* History panel - collapsible */}
            {history.length > 0 && (
              <div className="mt-2 mb-4 p-2 max-h-32 overflow-y-auto bg-muted/50 rounded-md">
                <div className="text-xs font-medium mb-1">History</div>
                {history.map((item, i) => (
                  <div key={i} className="text-sm font-mono text-right text-muted-foreground py-1 px-2">
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <TabsContent value="standard" className="mt-0">
            <div className="grid grid-cols-4 gap-2">
              <Button variant="secondary" className="text-lg h-12" onClick={() => clearEntry()}>CE</Button>
              <Button variant="secondary" className="text-lg h-12" onClick={() => clear()}>C</Button>
              <Button variant="secondary" className="text-lg h-12" onClick={() => setDisplayValue(displayValue.slice(0, -1) || '0')}>⌫</Button>
              <Button variant="secondary" className="text-lg h-12" onClick={() => doOperation('divide')}>÷</Button>
              
              <Button className="text-lg h-12" onClick={() => appendNumber('7')}>7</Button>
              <Button className="text-lg h-12" onClick={() => appendNumber('8')}>8</Button>
              <Button className="text-lg h-12" onClick={() => appendNumber('9')}>9</Button>
              <Button variant="secondary" className="text-lg h-12" onClick={() => doOperation('multiply')}>×</Button>
              
              <Button className="text-lg h-12" onClick={() => appendNumber('4')}>4</Button>
              <Button className="text-lg h-12" onClick={() => appendNumber('5')}>5</Button>
              <Button className="text-lg h-12" onClick={() => appendNumber('6')}>6</Button>
              <Button variant="secondary" className="text-lg h-12" onClick={() => doOperation('subtract')}>−</Button>
              
              <Button className="text-lg h-12" onClick={() => appendNumber('1')}>1</Button>
              <Button className="text-lg h-12" onClick={() => appendNumber('2')}>2</Button>
              <Button className="text-lg h-12" onClick={() => appendNumber('3')}>3</Button>
              <Button variant="secondary" className="text-lg h-12" onClick={() => doOperation('add')}>+</Button>
              
              <Button className="text-lg h-12" onClick={() => toggleSign()}>±</Button>
              <Button className="text-lg h-12" onClick={() => appendNumber('0')}>0</Button>
              <Button className="text-lg h-12" onClick={() => appendDecimal()}>.</Button>
              <Button variant="default" className="text-lg h-12" onClick={() => calculate()}>=</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="scientific" className="mt-0">
            <div className="grid grid-cols-5 gap-2">
              <Button variant="secondary" size="sm" className="h-10" onClick={() => scientificOperation('square')}>x²</Button>
              <Button variant="secondary" size="sm" className="h-10" onClick={() => scientificOperation('sqrt')}>√x</Button>
              <Button variant="secondary" size="sm" className="h-10" onClick={() => doOperation('power')}>x^y</Button>
              <Button variant="secondary" size="sm" className="h-10" onClick={() => scientificOperation('reciprocal')}>1/x</Button>
              <Button variant="secondary" size="sm" className="h-10" onClick={() => scientificOperation('factorial')}>n!</Button>
              
              <Button variant="secondary" size="sm" className="h-10" onClick={() => scientificOperation('sin')}>sin</Button>
              <Button variant="secondary" size="sm" className="h-10" onClick={() => scientificOperation('cos')}>cos</Button>
              <Button variant="secondary" size="sm" className="h-10" onClick={() => scientificOperation('tan')}>tan</Button>
              <Button variant="secondary" size="sm" className="h-10" onClick={() => scientificOperation('log')}>log</Button>
              <Button variant="secondary" size="sm" className="h-10" onClick={() => scientificOperation('ln')}>ln</Button>
              
              <Button variant="secondary" size="sm" className="h-10">π</Button>
              <Button variant="secondary" size="sm" className="h-10">e</Button>
              <Button variant="secondary" size="sm" className="h-10" onClick={() => clearEntry()}>CE</Button>
              <Button variant="secondary" size="sm" className="h-10" onClick={() => clear()}>C</Button>
              <Button variant="secondary" size="sm" className="h-10" onClick={() => setDisplayValue(displayValue.slice(0, -1) || '0')}>⌫</Button>
              
              <Button className="h-10" onClick={() => appendNumber('7')}>7</Button>
              <Button className="h-10" onClick={() => appendNumber('8')}>8</Button>
              <Button className="h-10" onClick={() => appendNumber('9')}>9</Button>
              <Button variant="secondary" size="sm" className="h-10" onClick={() => doOperation('divide')}>÷</Button>
              <Button variant="secondary" size="sm" className="h-10" onClick={() => memoryOperation('mc')}>MC</Button>
              
              <Button className="h-10" onClick={() => appendNumber('4')}>4</Button>
              <Button className="h-10" onClick={() => appendNumber('5')}>5</Button>
              <Button className="h-10" onClick={() => appendNumber('6')}>6</Button>
              <Button variant="secondary" size="sm" className="h-10" onClick={() => doOperation('multiply')}>×</Button>
              <Button variant="secondary" size="sm" className="h-10" onClick={() => memoryOperation('mr')}>MR</Button>
              
              <Button className="h-10" onClick={() => appendNumber('1')}>1</Button>
              <Button className="h-10" onClick={() => appendNumber('2')}>2</Button>
              <Button className="h-10" onClick={() => appendNumber('3')}>3</Button>
              <Button variant="secondary" size="sm" className="h-10" onClick={() => doOperation('subtract')}>−</Button>
              <Button variant="secondary" size="sm" className="h-10" onClick={() => memoryOperation('m+')}>M+</Button>
              
              <Button className="h-10" onClick={() => toggleSign()}>±</Button>
              <Button className="h-10" onClick={() => appendNumber('0')}>0</Button>
              <Button className="h-10" onClick={() => appendDecimal()}>.</Button>
              <Button variant="secondary" size="sm" className="h-10" onClick={() => doOperation('add')}>+</Button>
              <Button variant="default" size="sm" className="h-10" onClick={() => calculate()}>=</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}