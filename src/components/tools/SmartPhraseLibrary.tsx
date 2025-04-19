import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { useSupabaseClient } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Alert, AlertDescription } from '../ui/alert';
import { Copy } from 'lucide-react';
import { Separator } from '../ui/separator';
import { useToast } from '../ui/use-toast';

interface SmartPhrase {
  id: string;
  title: string;
  content: string;
}

const SmartPhraseLibrary: React.FC = () => {
  const supabase = useSupabaseClient<Database>();
  const { toast } = useToast();
  const [phrases, setPhrases] = useState<SmartPhrase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPhrases, setFilteredPhrases] = useState<SmartPhrase[]>([]);
  
  useEffect(() => {
    const fetchPhrases = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('smart_phrases')
          .select('*')
          .order('title');
        
        if (error) {
          throw error;
        }

        if (data) {
          setPhrases(data);
          setFilteredPhrases(data);
        }
      } catch (err) {
        console.error('Error fetching smart phrases:', err);
        setError('Failed to load smart phrases. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPhrases();
  }, [supabase]);
  
  // Filter phrases based on search term
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredPhrases(phrases);
      return;
    }
    
    const filtered = phrases.filter(phrase => 
      phrase.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      phrase.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredPhrases(filtered);
  };
  
  // Copy phrase to clipboard
  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "The smart phrase has been copied to your clipboard.",
        duration: 3000
      });
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      toast({
        title: "Failed to copy",
        description: "Please try again or copy manually.",
        variant: "destructive",
        duration: 3000
      });
    });
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Smart Phrase Library</CardTitle>
        <CardDescription>
          Reusable text snippets for common documentation scenarios
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-6">
          <Input
            placeholder="Search phrases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={loading}>
            Search
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p>Loading smart phrases...</p>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : filteredPhrases.length === 0 ? (
          <Alert>
            <AlertDescription>No smart phrases found matching your search.</AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {filteredPhrases.map((phrase) => (
              <Card key={phrase.id}>
                <CardHeader className="py-3">
                  <CardTitle className="text-base">{phrase.title}</CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <p className="text-sm whitespace-pre-wrap">{phrase.content}</p>
                </CardContent>
                <CardFooter className="py-2 flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => copyToClipboard(phrase.content)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Note: Always review and customize smart phrases to ensure they accurately reflect the patient's specific situation.
        </p>
      </CardFooter>
    </Card>
  );
};

export default SmartPhraseLibrary;
