import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { getModuleById } from '@/lib/module-data';

// Map old module IDs to new module slugs
const moduleIdToSlugMap: Record<string, string> = {
  'introduction': 'practice-efficiency',
  'physician-reimbursement': 'em-coding',
  'coding-review': 'em-coding',
  'billing-time-vs-complexity': 'em-coding',
  'office-visits': 'em-coding',
  'annual-exams': 'awv-optimization',
  'new-patient-visits': 'em-coding',
  'missed-codes': 'tools',
  'preventative-medicine': 'awv-optimization',
  'procedures': 'special-services',
  'medicare-billing': 'awv-optimization',
  'medicare-wellness': 'awv-optimization',
  'transition-care-management': 'special-services',
  'daily-schedule': 'practice-efficiency',
  'extras': 'tools',
};

export default function LegacyModuleRedirect() {
  const params = useParams();
  const navigate = useNavigate();
  const moduleId = params.moduleId;

  useEffect(() => {
    if (moduleId) {
      const moduleIdStr = moduleId as string;
      
      // Check if the module exists in the old structure
      const oldModule = getModuleById(moduleIdStr);
      
      if (oldModule) {
        // Map to new structure if possible
        const newSlug = moduleIdToSlugMap[moduleIdStr] || 'modules';
        navigate(`/modules/${newSlug}`, { replace: true });
      } else {
        // If module doesn't exist, redirect to modules index
        navigate('/modules', { replace: true });
      }
    }
  }, [moduleId, navigate]);

  return (
    <div className="container py-8">
      <p>Redirecting to new module structure...</p>
    </div>
  );
}
