import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { useSupabaseClient } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Progress } from '../ui/progress';

const AWVChecklist: React.FC = () => {
  const supabase = useSupabaseClient<Database>();
  
  // Initial AWV checklist items
  const [initialItems, setInitialItems] = useState([
    { id: 'i1', label: 'Health Risk Assessment (HRA) completed', checked: false },
    { id: 'i2', label: 'Establish/update medical and family history', checked: false },
    { id: 'i3', label: 'List of current providers and suppliers', checked: false },
    { id: 'i4', label: 'Height, weight, BMI, and blood pressure', checked: false },
    { id: 'i5', label: 'Cognitive impairment assessment', checked: false },
    { id: 'i6', label: 'Depression screening', checked: false },
    { id: 'i7', label: 'Functional ability assessment', checked: false },
    { id: 'i8', label: 'Fall risk assessment', checked: false },
    { id: 'i9', label: 'Home safety assessment', checked: false },
    { id: 'i10', label: 'Advance care planning discussion offered', checked: false },
    { id: 'i11', label: 'Written screening schedule provided', checked: false },
    { id: 'i12', label: 'Personalized health advice provided', checked: false }
  ]);
  
  // Subsequent AWV checklist items
  const [subsequentItems, setSubsequentItems] = useState([
    { id: 's1', label: 'Update Health Risk Assessment (HRA)', checked: false },
    { id: 's2', label: 'Update medical and family history', checked: false },
    { id: 's3', label: 'Update list of current providers and suppliers', checked: false },
    { id: 's4', label: 'Height, weight, BMI, and blood pressure', checked: false },
    { id: 's5', label: 'Cognitive impairment assessment', checked: false },
    { id: 's6', label: 'Update screening schedule', checked: false },
    { id: 's7', label: 'Update personalized health advice', checked: false }
  ]);
  
  // Optional elements that can be billed separately
  const [optionalItems, setOptionalItems] = useState([
    { id: 'o1', label: 'Depression screening (G0444) - can be billed with subsequent AWV only', checked: false },
    { id: 'o2', label: 'Alcohol screening (G0442)', checked: false },
    { id: 'o3', label: 'Advance care planning (99497) - waived cost-sharing when done with AWV', checked: false },
    { id: 'o4', label: 'Separate E/M service (99212-99215 with modifier 25) for significant separate problem', checked: false }
  ]);
  
  // Calculate completion percentage
  const calculateCompletion = (items: { checked: boolean }[]) => {
    const completed = items.filter(item => item.checked).length;
    return Math.round((completed / items.length) * 100);
  };
  
  const initialCompletion = calculateCompletion(initialItems);
  const subsequentCompletion = calculateCompletion(subsequentItems);
  
  // Toggle checklist item
  const toggleInitialItem = (id: string) => {
    setInitialItems(items => 
      items.map(item => 
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };
  
  const toggleSubsequentItem = (id: string) => {
    setSubsequentItems(items => 
      items.map(item => 
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };
  
  const toggleOptionalItem = (id: string) => {
    setOptionalItems(items => 
      items.map(item => 
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };
  
  // Reset checklist
  const resetChecklist = () => {
    setInitialItems(items => items.map(item => ({ ...item, checked: false })));
    setSubsequentItems(items => items.map(item => ({ ...item, checked: false })));
    setOptionalItems(items => items.map(item => ({ ...item, checked: false })));
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Medicare Annual Wellness Visit Checklist</CardTitle>
        <CardDescription>
          Required elements for Medicare Annual Wellness Visit (AWV) documentation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="initial">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="initial">Initial AWV (G0438)</TabsTrigger>
            <TabsTrigger value="subsequent">Subsequent AWV (G0439)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="initial" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Required Elements</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{initialCompletion}% complete</span>
                <Progress value={initialCompletion} className="w-[100px]" />
              </div>
            </div>
            
            <div className="space-y-3">
              {initialItems.map((item) => (
                <div key={item.id} className="flex items-start space-x-2">
                  <Checkbox 
                    id={item.id} 
                    checked={item.checked}
                    onCheckedChange={() => toggleInitialItem(item.id)}
                  />
                  <Label 
                    htmlFor={item.id}
                    className={`leading-normal ${item.checked ? 'line-through text-muted-foreground' : ''}`}
                  >
                    {item.label}
                  </Label>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="subsequent" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Required Elements</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{subsequentCompletion}% complete</span>
                <Progress value={subsequentCompletion} className="w-[100px]" />
              </div>
            </div>
            
            <div className="space-y-3">
              {subsequentItems.map((item) => (
                <div key={item.id} className="flex items-start space-x-2">
                  <Checkbox 
                    id={item.id} 
                    checked={item.checked}
                    onCheckedChange={() => toggleSubsequentItem(item.id)}
                  />
                  <Label 
                    htmlFor={item.id}
                    className={`leading-normal ${item.checked ? 'line-through text-muted-foreground' : ''}`}
                  >
                    {item.label}
                  </Label>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <Separator className="my-6" />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Optional Billable Elements</h3>
          <div className="space-y-3">
            {optionalItems.map((item) => (
              <div key={item.id} className="flex items-start space-x-2">
                <Checkbox 
                  id={item.id} 
                  checked={item.checked}
                  onCheckedChange={() => toggleOptionalItem(item.id)}
                />
                <Label 
                  htmlFor={item.id}
                  className="leading-normal"
                >
                  {item.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-xs text-muted-foreground">Source: CMS Medicare Learning Network</p>
        <Button variant="outline" onClick={resetChecklist}>Reset Checklist</Button>
      </CardFooter>
    </Card>
  );
};

export default AWVChecklist;
