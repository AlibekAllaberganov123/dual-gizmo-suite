import { useState } from 'react';
import { Calculator, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

interface BmiResult {
  value: number;
  category: 'underweight' | 'normal' | 'overweight' | 'obese';
  description: string;
}

export const BmiCalculator = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [heightUnit, setHeightUnit] = useState<'cm' | 'm'>('cm');
  const [result, setResult] = useState<BmiResult | null>(null);
  const [errors, setErrors] = useState<{ weight?: string; height?: string }>({});

  const validateInputs = (): boolean => {
    const newErrors: { weight?: string; height?: string } = {};
    
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    
    if (!weight || isNaN(weightNum) || weightNum < 20 || weightNum > 300) {
      newErrors.weight = 'Weight must be between 20 and 300 kg';
    }
    
    if (!height || isNaN(heightNum)) {
      newErrors.height = 'Please enter a valid height';
    } else if (heightUnit === 'cm' && (heightNum < 50 || heightNum > 250)) {
      newErrors.height = 'Height must be between 50 and 250 cm';
    } else if (heightUnit === 'm' && (heightNum < 0.5 || heightNum > 2.5)) {
      newErrors.height = 'Height must be between 0.5 and 2.5 m';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateBmi = () => {
    if (!validateInputs()) return;
    
    const weightKg = parseFloat(weight);
    let heightM = parseFloat(height);
    
    if (heightUnit === 'cm') {
      heightM = heightM / 100;
    }
    
    const bmiValue = weightKg / (heightM * heightM);
    
    let category: BmiResult['category'];
    let description: string;
    
    if (bmiValue < 18.5) {
      category = 'underweight';
      description = 'Underweight - Consider gaining healthy weight';
    } else if (bmiValue < 25) {
      category = 'normal';
      description = 'Normal weight - Keep up the good work!';
    } else if (bmiValue < 30) {
      category = 'overweight';
      description = 'Overweight - Consider a healthier lifestyle';
    } else {
      category = 'obese';
      description = 'Obese - Consult a healthcare professional';
    }
    
    setResult({
      value: Math.round(bmiValue * 10) / 10,
      category,
      description
    });
  };

  const reset = () => {
    setWeight('');
    setHeight('');
    setResult(null);
    setErrors({});
  };

  const getCategoryColor = (category: BmiResult['category']) => {
    const colors = {
      underweight: 'text-bmi-underweight border-bmi-underweight bg-bmi-underweight/10',
      normal: 'text-bmi-normal border-bmi-normal bg-bmi-normal/10',
      overweight: 'text-bmi-overweight border-bmi-overweight bg-bmi-overweight/10',
      obese: 'text-bmi-obese border-bmi-obese bg-bmi-obese/10'
    };
    return colors[category];
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Calculator className="w-12 h-12 mx-auto mb-4 text-primary" />
        <h2 className="text-3xl font-bold mb-2">BMI Calculator</h2>
        <p className="text-muted-foreground">Calculate your Body Mass Index</p>
      </div>

      <Card className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm">
        <div className="space-y-4">
          <div>
            <Label htmlFor="weight" className="text-sm font-medium">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              placeholder="Enter weight (20-300 kg)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className={`mt-1 ${errors.weight ? 'border-destructive' : ''}`}
              min="20"
              max="300"
            />
            {errors.weight && (
              <p className="text-sm text-destructive mt-1">{errors.weight}</p>
            )}
          </div>

          <div>
            <Label htmlFor="height" className="text-sm font-medium">Height</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="height"
                type="number"
                placeholder={heightUnit === 'cm' ? 'Enter height (50-250 cm)' : 'Enter height (0.5-2.5 m)'}
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className={`flex-1 ${errors.height ? 'border-destructive' : ''}`}
                min={heightUnit === 'cm' ? '50' : '0.5'}
                max={heightUnit === 'cm' ? '250' : '2.5'}
                step={heightUnit === 'cm' ? '1' : '0.01'}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setHeightUnit(heightUnit === 'cm' ? 'm' : 'cm')}
                className="px-6"
              >
                {heightUnit}
              </Button>
            </div>
            {errors.height && (
              <p className="text-sm text-destructive mt-1">{errors.height}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button onClick={calculateBmi} className="flex-1 bg-gradient-primary hover:opacity-90">
              Calculate BMI
            </Button>
            <Button onClick={reset} variant="outline" size="icon">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {result && (
        <Card className={`p-6 animate-fade-in border ${getCategoryColor(result.category)}`}>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{result.value}</div>
            <div className="text-lg font-semibold mb-2 capitalize">{result.category}</div>
            <p className="text-sm">{result.description}</p>
          </div>
        </Card>
      )}

      <Card className="p-4 bg-muted/50">
        <h3 className="font-semibold mb-2">BMI Categories:</h3>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Underweight:</span>
            <span className="text-bmi-underweight font-medium">&lt; 18.5</span>
          </div>
          <div className="flex justify-between">
            <span>Normal weight:</span>
            <span className="text-bmi-normal font-medium">18.5 - 24.9</span>
          </div>
          <div className="flex justify-between">
            <span>Overweight:</span>
            <span className="text-bmi-overweight font-medium">25 - 29.9</span>
          </div>
          <div className="flex justify-between">
            <span>Obese:</span>
            <span className="text-bmi-obese font-medium">≥ 30</span>
          </div>
        </div>
      </Card>
    </div>
  );
};