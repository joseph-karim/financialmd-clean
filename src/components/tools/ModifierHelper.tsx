import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { useSupabaseClient } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Info } from 'lucide-react';
import { Separator } from '../ui/separator';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Button } from '../ui/button';

interface Modifier {
  code: string;
  description: string;
}

const ModifierHelper: React.FC = () => {
  const supabase = useSupabaseClient<Database>();
  const [modifiers, setModifiers] = useState<Modifier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modifier 25 checklist
  const [mod25Items, setMod25Items] = useState([
    { id: '1', label: 'The E/M service is significant and separately identifiable from the procedure', checked: false },
    { id: '2', label: 'The E/M service is above and beyond the usual pre- and post-procedure work', checked: false },
    { id: '3', label: 'The patient's condition required additional work beyond the procedure', checked: false },
    { id: '4', label: 'Documentation clearly identifies the separate E/M service', checked: false },
    { id: '5', label: 'The diagnosis supports the need for the separate E/M service', checked: false },
    { id: '6', label: 'The documentation would stand alone as a billable service', checked: false }
  ]);
  
  // Modifier 59 checklist
  const [mod59Items, setMod59Items] = useState([
    { id: '1', label: 'The procedure is distinct and independent from other services performed on the same day', checked: false },
    { id: '2', label: 'The procedure was performed at a different session or patient encounter', checked: false },
    { id: '3', label: 'The procedure was performed on a different site or organ system', checked: false },
    { id: '4', label: 'The procedure was performed on a separate lesion or injury', checked: false },
    { id: '5', label: 'The procedure was performed by a different practitioner', checked: false },
    { id: '6', label: 'Documentation clearly supports the distinct procedural service', checked: false }
  ]);
  
  useEffect(() => {
    const fetchModifiers = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('modifiers')
          .select('*');
        
        if (error) {
          throw error;
        }

        if (data) {
          setModifiers(data);
        }
      } catch (err) {
        console.error('Error fetching modifiers:', err);
        setError('Failed to load modifiers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchModifiers();
  }, [supabase]);
  
  // Toggle checklist item
  const toggleMod25Item = (id: string) => {
    setMod25Items(items => 
      items.map(item => 
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };
  
  const toggleMod59Item = (id: string) => {
    setMod59Items(items => 
      items.map(item => 
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };
  
  // Calculate if modifier is appropriate
  const isMod25Appropriate = () => {
    return mod25Items.filter(item => item.checked).length >= 5;
  };
  
  const isMod59Appropriate = () => {
    return mod59Items.filter(item => item.checked).length >= 4;
  };
  
  // Reset checklist
  const resetChecklist = (type: '25' | '59') => {
    if (type === '25') {
      setMod25Items(items => items.map(item => ({ ...item, checked: false })));
    } else {
      setMod59Items(items => items.map(item => ({ ...item, checked: false })));
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Modifier Helper</CardTitle>
        <CardDescription>
          Determine when to use common modifiers correctly
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="25">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="25">Modifier 25</TabsTrigger>
            <TabsTrigger value="59">Modifier 59</TabsTrigger>
          </TabsList>
          
          <TabsContent value="25" className="space-y-4 mt-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Modifier 25</AlertTitle>
              <AlertDescription>
                Significant, separately identifiable E/M service by the same physician on the same day of the procedure or other service.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Checklist for Appropriate Use</h3>
              <div className="space-y-3">
                {mod25Items.map((item) => (
                  <div key={item.id} className="flex items-start space-x-2">
                    <Checkbox 
                      id={`mod25-${item.id}`} 
                      checked={item.checked}
                      onCheckedChange={() => toggleMod25Item(item.id)}
                    />
                    <Label 
                      htmlFor={`mod25-${item.id}`}
                      className="leading-normal"
                    >
                      {item.label}
                    </Label>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              <div className="p-4 border rounded-md bg-muted">
                <h4 className="font-medium mb-2">Assessment</h4>
                {isMod25Appropriate() ? (
                  <p className="text-green-600">Based on your selections, Modifier 25 appears appropriate.</p>
                ) : (
                  <p className="text-amber-600">Based on your selections, Modifier 25 may not be appropriate. Review documentation.</p>
                )}
              </div>
              
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => resetChecklist('25')}>Reset</Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="59" className="space-y-4 mt-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Modifier 59</AlertTitle>
              <AlertDescription>
                Distinct procedural service. Used to identify procedures/services that are not normally reported together, but are appropriate under the circumstances.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Checklist for Appropriate Use</h3>
              <div className="space-y-3">
                {mod59Items.map((item) => (
                  <div key={item.id} className="flex items-start space-x-2">
                    <Checkbox 
                      id={`mod59-${item.id}`} 
                      checked={item.checked}
                      onCheckedChange={() => toggleMod59Item(item.id)}
                    />
                    <Label 
                      htmlFor={`mod59-${item.id}`}
                      className="leading-normal"
                    >
                      {item.label}
                    </Label>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              <div className="p-4 border rounded-md bg-muted">
                <h4 className="font-medium mb-2">Assessment</h4>
                {isMod59Appropriate() ? (
                  <p className="text-green-600">Based on your selections, Modifier 59 appears appropriate.</p>
                ) : (
                  <p className="text-amber-600">Based on your selections, Modifier 59 may not be appropriate. Review documentation.</p>
                )}
              </div>
              
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => resetChecklist('59')}>Reset</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">Source: AMA CPT® guidelines, CMS NCCI Policy Manual</p>
      </CardFooter>
    </Card>
  );
};

export default ModifierHelper;
