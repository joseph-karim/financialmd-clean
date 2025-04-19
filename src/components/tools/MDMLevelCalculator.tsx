import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { useSupabaseClient } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Info } from 'lucide-react';
import { Separator } from '../ui/separator';
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from '../ui/label';
import { Button } from '../ui/button';

const MDMLevelCalculator: React.FC = () => {
  const supabase = useSupabaseClient<Database>();
  
  // State for the three MDM elements
  const [problemsLevel, setProblemsLevel] = useState<string | null>(null);
  const [dataLevel, setDataLevel] = useState<string | null>(null);
  const [riskLevel, setRiskLevel] = useState<string | null>(null);
  
  // Calculate the overall MDM level
  const calculateMDMLevel = () => {
    if (!problemsLevel || !dataLevel || !riskLevel) {
      return null;
    }
    
    // Convert levels to numeric values
    const levelValues = {
      'minimal': 1,
      'low': 2,
      'moderate': 3,
      'high': 4
    };
    
    const problemsValue = levelValues[problemsLevel as keyof typeof levelValues];
    const dataValue = levelValues[dataLevel as keyof typeof levelValues];
    const riskValue = levelValues[riskLevel as keyof typeof levelValues];
    
    // Get the middle value (2nd highest of the three elements)
    const sortedValues = [problemsValue, dataValue, riskValue].sort((a, b) => a - b);
    const middleValue = sortedValues[1];
    
    // Convert back to level
    const valueToLevel = {
      1: 'minimal',
      2: 'low',
      3: 'moderate',
      4: 'high'
    };
    
    return valueToLevel[middleValue as keyof typeof valueToLevel];
  };
  
  // Map MDM level to E/M code
  const getMDMCode = (level: string | null) => {
    if (!level) return null;
    
    const levelToCode = {
      'minimal': '99202/99212',
      'low': '99202/99212',
      'moderate': '99203/99213',
      'high': '99204/99214'
    };
    
    return levelToCode[level as keyof typeof levelToCode];
  };
  
  const mdmLevel = calculateMDMLevel();
  const emCode = getMDMCode(mdmLevel);
  
  // Reset all selections
  const resetSelections = () => {
    setProblemsLevel(null);
    setDataLevel(null);
    setRiskLevel(null);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Medical Decision Making (MDM) Calculator</CardTitle>
        <CardDescription>
          Determine the appropriate level of MDM for E/M coding
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>About MDM Calculation</AlertTitle>
          <AlertDescription>
            As of 2021, E/M code selection is primarily based on Medical Decision Making (MDM) or time. This calculator helps determine the level of MDM based on the 2021 guidelines.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Number and Complexity of Problems Addressed</h3>
            <RadioGroup value={problemsLevel || ""} onValueChange={setProblemsLevel}>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="minimal" id="problems-minimal" />
                  <Label htmlFor="problems-minimal" className="leading-normal">
                    <span className="font-medium">Minimal</span> - 1 self-limited or minor problem
                  </Label>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="low" id="problems-low" />
                  <Label htmlFor="problems-low" className="leading-normal">
                    <span className="font-medium">Low</span> - 2+ self-limited or minor problems; 1 stable chronic illness; 1 acute, uncomplicated illness/injury
                  </Label>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="moderate" id="problems-moderate" />
                  <Label htmlFor="problems-moderate" className="leading-normal">
                    <span className="font-medium">Moderate</span> - 1+ chronic illnesses with exacerbation; 2+ stable chronic illnesses; 1 undiagnosed new problem with uncertain prognosis; 1 acute illness with systemic symptoms
                  </Label>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="high" id="problems-high" />
                  <Label htmlFor="problems-high" className="leading-normal">
                    <span className="font-medium">High</span> - 1+ chronic illnesses with severe exacerbation; 1 acute/chronic illness that poses threat to life or bodily function
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-medium mb-3">Amount and/or Complexity of Data to be Reviewed and Analyzed</h3>
            <RadioGroup value={dataLevel || ""} onValueChange={setDataLevel}>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="minimal" id="data-minimal" />
                  <Label htmlFor="data-minimal" className="leading-normal">
                    <span className="font-medium">Minimal or None</span> - Minimal or no data review
                  </Label>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="low" id="data-low" />
                  <Label htmlFor="data-low" className="leading-normal">
                    <span className="font-medium">Low</span> - Review of prior external notes; order of labs/tests; assessment requiring independent historian
                  </Label>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="moderate" id="data-moderate" />
                  <Label htmlFor="data-moderate" className="leading-normal">
                    <span className="font-medium">Moderate</span> - Review of prior testing; independent interpretation of tests; discussion of management with external physician/QHP
                  </Label>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="high" id="data-high" />
                  <Label htmlFor="data-high" className="leading-normal">
                    <span className="font-medium">High</span> - Analysis of complex tests; discussion of management with external physician/QHP requiring extensive additional work
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-medium mb-3">Risk of Complications and/or Morbidity or Mortality</h3>
            <RadioGroup value={riskLevel || ""} onValueChange={setRiskLevel}>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="minimal" id="risk-minimal" />
                  <Label htmlFor="risk-minimal" className="leading-normal">
                    <span className="font-medium">Minimal</span> - Minimal risk (e.g., bandaid, OTC medications)
                  </Label>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="low" id="risk-low" />
                  <Label htmlFor="risk-low" className="leading-normal">
                    <span className="font-medium">Low</span> - Low risk (e.g., minor surgery without risk factors, OTC medications, IV fluids without additives)
                  </Label>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="moderate" id="risk-moderate" />
                  <Label htmlFor="risk-moderate" className="leading-normal">
                    <span className="font-medium">Moderate</span> - Moderate risk (e.g., minor surgery with risk factors, prescription drug management, diagnosis or treatment significantly limited by social determinants of health)
                  </Label>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="high" id="risk-high" />
                  <Label htmlFor="risk-high" className="leading-normal">
                    <span className="font-medium">High</span> - High risk (e.g., major surgery, parenteral controlled substances, drug therapy requiring intensive monitoring, decision regarding hospitalization)
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>
          
          <Separator />
          
          <div className="p-4 border rounded-md bg-muted">
            <h3 className="text-lg font-medium mb-2">MDM Level Assessment</h3>
            {mdmLevel ? (
              <>
                <p className="mb-2">Based on your selections, the MDM level is: <span className="font-bold">{mdmLevel.toUpperCase()}</span></p>
                <p>Corresponding E/M code (new/established): <span className="font-bold">{emCode}</span></p>
              </>
            ) : (
              <p>Please select all three elements to determine the MDM level.</p>
            )}
          </div>
          
          <div className="flex justify-end">
            <Button variant="outline" onClick={resetSelections}>Reset</Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">Source: AMA CPT® E/M Office Visit Guidelines (2021)</p>
      </CardFooter>
    </Card>
  );
};

export default MDMLevelCalculator;
