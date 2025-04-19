import React, { Suspense, lazy } from 'react';
import { Skeleton } from './ui/skeleton';

// Loading skeleton for tools
const ToolSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-64" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-32 w-full" />
  </div>
);

// Define the available tool components using React.lazy
const toolComponents: Record<string, React.ComponentType<any>> = {
  AWVChecklist: lazy(() => import('./tools/AWVChecklist')),
  AWVRevenueCalculator: lazy(() => import('./tools/AWVRevenueCalculator')),
  ChecklistLibrary: lazy(() => import('./tools/ChecklistLibrary')),
  CodeLookup: lazy(() => import('./tools/CodeLookup')),
  MDMLevelCalculator: lazy(() => import('./tools/MDMLevelCalculator')),
  ModifierHelper: lazy(() => import('./tools/ModifierHelper')),
  SmartPhraseLibrary: lazy(() => import('./tools/SmartPhraseLibrary')),
  
  // Placeholder components for future implementation
  AIScribeAssist: () => (
    <div className="p-4 border rounded-md bg-muted">
      <p className="font-medium">AI Documentation Assistant</p>
      <p className="text-muted-foreground">This tool is coming soon.</p>
    </div>
  ),
  NoteAnalyzer: () => (
    <div className="p-4 border rounded-md bg-muted">
      <p className="font-medium">Clinical Note Analyzer</p>
      <p className="text-muted-foreground">This tool is coming soon.</p>
    </div>
  ),
  PreVisitPlanningChecklist: () => (
    <div className="p-4 border rounded-md bg-muted">
      <p className="font-medium">Pre-Visit Planning Checklist</p>
      <p className="text-muted-foreground">This tool is coming soon.</p>
    </div>
  ),
};

interface ToolComponentLoaderProps {
  componentName: string;
}

const ToolComponentLoader: React.FC<ToolComponentLoaderProps> = ({ componentName }) => {
  const Component = toolComponents[componentName];
  
  if (!Component) {
    return (
      <div className="p-4 border rounded-md bg-muted">
        <p>Tool component "{componentName}" not found.</p>
      </div>
    );
  }
  
  // Wrap lazy-loaded components in Suspense
  if (
    componentName === 'AWVChecklist' ||
    componentName === 'AWVRevenueCalculator' ||
    componentName === 'ChecklistLibrary' ||
    componentName === 'CodeLookup' ||
    componentName === 'MDMLevelCalculator' ||
    componentName === 'ModifierHelper' ||
    componentName === 'SmartPhraseLibrary'
  ) {
    return (
      <Suspense fallback={<ToolSkeleton />}>
        <Component />
      </Suspense>
    );
  }
  
  // For non-lazy components, render directly
  return <Component />;
};

export default ToolComponentLoader;
