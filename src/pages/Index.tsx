import { useState } from 'react';
import { Calculator, Activity, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BmiCalculator } from '@/components/BmiCalculator';
import { BasicCalculator } from '@/components/BasicCalculator';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'bmi' | 'calculator'>('bmi');

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-card/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-primary">
                <Menu className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Dual Calculator</h1>
                <p className="text-sm text-muted-foreground">BMI & Basic Operations</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center mb-8">
          <div className="bg-card/80 backdrop-blur-sm p-1 rounded-lg border border-border/50 shadow-card">
            <div className="flex gap-1">
              <Button
                onClick={() => setActiveTab('bmi')}
                variant={activeTab === 'bmi' ? 'default' : 'ghost'}
                className={`flex items-center gap-2 px-6 py-3 transition-all duration-200 ${
                  activeTab === 'bmi'
                    ? 'bg-gradient-primary shadow-primary text-primary-foreground'
                    : 'hover:bg-muted/50'
                }`}
              >
                <Activity className="w-4 h-4" />
                BMI Calculator
              </Button>
              <Button
                onClick={() => setActiveTab('calculator')}
                variant={activeTab === 'calculator' ? 'default' : 'ghost'}
                className={`flex items-center gap-2 px-6 py-3 transition-all duration-200 ${
                  activeTab === 'calculator'
                    ? 'bg-gradient-primary shadow-primary text-primary-foreground'
                    : 'hover:bg-muted/50'
                }`}
              >
                <Calculator className="w-4 h-4" />
                Basic Calculator
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-md mx-auto">
          <div className="animate-fade-in">
            {activeTab === 'bmi' ? <BmiCalculator /> : <BasicCalculator />}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Built with Lovable • Modern dual-purpose calculator
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
