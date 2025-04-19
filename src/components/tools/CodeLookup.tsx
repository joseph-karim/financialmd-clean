import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useSupabaseClient } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Alert, AlertDescription } from '../ui/alert';

interface CodeData {
  code: string;
  description_short: string;
  national_wrvu: number;
}

const CodeLookup: React.FC = () => {
  const supabase = useSupabaseClient<Database>();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<CodeData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would search the database
      // For this mock, we'll filter the mock data
      const { data, error } = await supabase
        .from('codes')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      // Filter the results based on the search term
      const filteredData = data.filter(code => 
        code.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
        code.description_short.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setResults(filteredData);
      
      if (filteredData.length === 0) {
        setError('No codes found matching your search term.');
      }
    } catch (err) {
      console.error('Error searching codes:', err);
      setError('Failed to search codes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>CPT/HCPCS Code Lookup</CardTitle>
        <CardDescription>
          Search for codes by number or description
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-6">
          <Input
            placeholder="Enter code or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </div>
        
        {error && (
          <Alert className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {results.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">wRVU</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((code) => (
                <TableRow key={code.code}>
                  <TableCell className="font-medium">{code.code}</TableCell>
                  <TableCell>{code.description_short}</TableCell>
                  <TableCell className="text-right">{code.national_wrvu.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Note: wRVU values shown are national values and may vary by location. Always verify with your local Medicare Administrative Contractor.
        </p>
      </CardFooter>
    </Card>
  );
};

export default CodeLookup;
