import { modules } from '@/lib/module-data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';
import { ClipboardList, Calendar, FileCode, HeartPulse, Plus, Wrench } from 'lucide-react';

// Create a map of icon components
const iconComponents: Record<string, LucideIcon> = {
  ClipboardList,
  Calendar,
  FileCode,
  HeartPulse,
  Plus,
  Wrench
};

export default function ModulesPage() {
  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-2">Medical Billing & Coding Modules</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Comprehensive learning modules to optimize your primary care practice's revenue and efficiency.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => {
          const IconComponent = iconComponents[module.icon];
          
          return (
            <Card key={module.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-2">
                  {IconComponent && <IconComponent className="h-5 w-5" />}
                  <CardTitle>{module.title}</CardTitle>
                </div>
                {module.isPreview && (
                  <Badge variant="secondary" className="w-fit">Preview</Badge>
                )}
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{module.description}</CardDescription>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button asChild className="w-full">
                  <Link to={`/modules/${module.slug}`}>
                    Explore Module
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
