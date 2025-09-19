import { useState } from 'react';
import { Calculator, Trash2, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

type Operation = '+' | '-' | '*' | '/';

interface CalculationHistory {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export const BasicCalculator = () => {
  const [firstNumber, setFirstNumber] = useState('');
  const [secondNumber, setSecondNumber] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null);
  const [history, setHistory] = useState<CalculationHistory[]>([]);
  const [errors, setErrors] = useState<{ first?: string; second?: string }>({});

  const validateInputs = (): boolean => {
    const newErrors: { first?: string; second?: string } = {};
    
    const firstNum = parseFloat(firstNumber);
    const secondNum = parseFloat(secondNumber);
    
    if (!firstNumber || isNaN(firstNum) || firstNum < -999999 || firstNum > 999999) {
      newErrors.first = 'Number must be between -999,999 and 999,999';
    }
    
    if (!secondNumber || isNaN(secondNum) || secondNum < -999999 || secondNum > 999999) {
      newErrors.second = 'Number must be between -999,999 and 999,999';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculate = (operation: Operation) => {
    if (!validateInputs()) return;
    
    const num1 = parseFloat(firstNumber);
    const num2 = parseFloat(secondNumber);
    let calculationResult: number;
    let displaySymbol: string = operation;
    
    switch (operation) {
      case '+':
        calculationResult = num1 + num2;
        break;
      case '-':
        calculationResult = num1 - num2;
        break;
      case '*':
        calculationResult = num1 * num2;
        displaySymbol = '×';
        break;
      case '/':
        if (num2 === 0) {
          setResult('Error: Division by zero');
          setSelectedOperation(operation);
          return;
        }
        calculationResult = num1 / num2;
        displaySymbol = '÷';
        break;
      default:
        return;
    }
    
    const resultStr = calculationResult.toString();
    const expression = `${firstNumber} ${displaySymbol} ${secondNumber}`;
    
    setResult(resultStr);
    setSelectedOperation(operation);
    
    // Add to history
    const newCalculation: CalculationHistory = {
      id: Date.now().toString(),
      expression,
      result: resultStr,
      timestamp: Date.now()
    };
    
    setHistory(prev => [newCalculation, ...prev].slice(0, 5));
  };

  const clear = () => {
    setFirstNumber('');
    setSecondNumber('');
    setResult(null);
    setSelectedOperation(null);
    setErrors({});
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const getOperationButton = (operation: Operation, label: string, icon?: React.ReactNode) => (
    <Button
      onClick={() => calculate(operation)}
      className={`h-14 text-lg font-semibold transition-all duration-200 ${
        selectedOperation === operation
          ? 'bg-primary shadow-primary'
          : 'bg-calculator-button hover:bg-calculator-button-hover shadow-button'
      }`}
    >
      {icon || label}
    </Button>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Calculator className="w-12 h-12 mx-auto mb-4 text-primary" />
        <h2 className="text-3xl font-bold mb-2">Basic Calculator</h2>
        <p className="text-muted-foreground">Perform basic arithmetic operations</p>
      </div>

      <Card className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm">
        <div className="space-y-4">
          <div>
            <Label htmlFor="first-number" className="text-sm font-medium">First Number</Label>
            <Input
              id="first-number"
              type="number"
              placeholder="Enter first number (-999,999 to 999,999)"
              value={firstNumber}
              onChange={(e) => setFirstNumber(e.target.value)}
              className={`mt-1 text-lg ${errors.first ? 'border-destructive' : ''}`}
              min="-999999"
              max="999999"
            />
            {errors.first && (
              <p className="text-sm text-destructive mt-1">{errors.first}</p>
            )}
          </div>

          <div>
            <Label htmlFor="second-number" className="text-sm font-medium">Second Number</Label>
            <Input
              id="second-number"
              type="number"
              placeholder="Enter second number (-999,999 to 999,999)"
              value={secondNumber}
              onChange={(e) => setSecondNumber(e.target.value)}
              className={`mt-1 text-lg ${errors.second ? 'border-destructive' : ''}`}
              min="-999999"
              max="999999"
            />
            {errors.second && (
              <p className="text-sm text-destructive mt-1">{errors.second}</p>
            )}
          </div>

          <div>
            <Label className="text-sm font-medium mb-3 block">Operations</Label>
            <div className="grid grid-cols-2 gap-3">
              {getOperationButton('+', '+')}
              {getOperationButton('-', '−')}
              {getOperationButton('*', '×')}
              {getOperationButton('/', '÷')}
            </div>
          </div>

          <Button onClick={clear} variant="outline" className="w-full">
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>
      </Card>

      {result !== null && (
        <Card className="p-6 animate-fade-in bg-primary/10 border-primary/20">
          <div className="text-center">
            <div className="text-2xl font-bold mb-2">Result</div>
            <div className="text-4xl font-bold text-primary">{result}</div>
            {selectedOperation && !result.includes('Error') && (
              <div className="text-sm text-muted-foreground mt-2">
                {firstNumber} {selectedOperation === '*' ? '×' : selectedOperation === '/' ? '÷' : selectedOperation} {secondNumber} = {result}
              </div>
            )}
          </div>
        </Card>
      )}

      {history.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Recent Calculations</h3>
            </div>
            <Button onClick={clearHistory} variant="ghost" size="sm">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {history.map((calc) => (
              <div
                key={calc.id}
                className="flex justify-between items-center p-3 rounded-lg bg-muted/50 text-sm"
              >
                <span className="font-mono">{calc.expression}</span>
                <span className="font-bold">{calc.result}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};