// Mock Supabase client for development and deployment
// This file replaces the actual Supabase client with a mock implementation

// Define the mock Supabase client type
export type SupabaseClient = {
  from: (table: string) => {
    select: (columns: string) => {
      eq: (column: string, value: any) => Promise<{ data: any; error: any }>;
      order: (column: string, options?: { ascending?: boolean }) => {
        limit: (limit: number) => Promise<{ data: any; error: any }>;
      };
      limit: (limit: number) => Promise<{ data: any; error: any }>;
    };
    insert: (data: any) => Promise<{ data: any; error: any }>;
    update: (data: any) => {
      eq: (column: string, value: any) => Promise<{ data: any; error: any }>;
    };
    delete: () => {
      eq: (column: string, value: any) => Promise<{ data: any; error: any }>;
    };
  };
  auth: {
    signIn: (credentials: any) => Promise<{ data: any; error: any }>;
    signOut: () => Promise<{ error: any }>;
    onAuthStateChange: (callback: (event: string, session: any) => void) => { data: any };
  };
};

// Create a mock Supabase client
export const supabase: SupabaseClient = {
  from: (table: string) => ({
    select: (columns: string) => ({
      eq: (column: string, value: any) => Promise.resolve({
        data: getMockData(table),
        error: null
      }),
      order: (column: string, options?: { ascending?: boolean }) => ({
        limit: (limit: number) => Promise.resolve({
          data: getMockData(table).slice(0, limit),
          error: null
        })
      }),
      limit: (limit: number) => Promise.resolve({
        data: getMockData(table).slice(0, limit),
        error: null
      })
    }),
    insert: (data: any) => Promise.resolve({ data, error: null }),
    update: (data: any) => ({
      eq: (column: string, value: any) => Promise.resolve({ data, error: null })
    }),
    delete: () => ({
      eq: (column: string, value: any) => Promise.resolve({ data: null, error: null })
    })
  }),
  auth: {
    signIn: (credentials: any) => Promise.resolve({ data: { user: { id: '1', email: 'user@example.com' } }, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      callback('SIGNED_IN', { user: { id: '1', email: 'user@example.com' } });
      return { data: { unsubscribe: () => {} } };
    }
  }
};

// Mock data for different tables
function getMockData(table: string) {
  switch (table) {
    case 'codes':
      return [
        { code: 'G0438', description_short: 'Initial AWV', national_wrvu: 2.43 },
        { code: 'G0439', description_short: 'Subsequent AWV', national_wrvu: 1.50 },
        { code: '99214', description_short: 'Office/outpatient visit est', national_wrvu: 1.92 },
        { code: '99497', description_short: 'Advance care planning', national_wrvu: 1.50 },
        { code: 'G0444', description_short: 'Depression screen annual', national_wrvu: 0.18 },
        { code: 'G0442', description_short: 'Annual alcohol screen', national_wrvu: 0.18 }
      ];
    case 'checklists':
      return [
        { 
          id: 'f8c3de3d-1fea-4d7c-a8b0-29f63c4c3454', 
          title: 'AWV Checklist', 
          description: 'Annual Wellness Visit Documentation Checklist',
          checklist_type: 'documentation',
          source: 'CMS'
        },
        { 
          id: '2e0cfc8f-60c3-4b7c-b1a2-9f63c4c3454a', 
          title: 'Modifier 25 Checklist', 
          description: 'Checklist for appropriate use of Modifier 25',
          checklist_type: 'coding',
          source: 'AAPC'
        },
        { 
          id: '3a1dfc8f-70c3-4b7c-b1a2-9f63c4c3454b', 
          title: 'Pre-Visit Planning', 
          description: 'Pre-Visit Planning Checklist',
          checklist_type: 'workflow',
          source: 'AAFP'
        },
        { 
          id: '4b2efc8f-80c3-4b7c-b1a2-9f63c4c3454c', 
          title: 'MDM Level Estimator', 
          description: 'Medical Decision Making Level Estimator',
          checklist_type: 'coding',
          source: 'AMA'
        }
      ];
    case 'modifiers':
      return [
        { code: '25', description: 'Significant, separately identifiable E/M service by the same physician on the same day of the procedure or other service' },
        { code: '59', description: 'Distinct procedural service' },
        { code: 'XU', description: 'Unusual non-overlapping service' }
      ];
    case 'smart_phrases':
      return [
        { id: '1', title: 'AWV Introduction', content: 'Patient presents for Medicare Annual Wellness Visit. Patient understands this is a preventive visit focused on screening and prevention, not for addressing acute or chronic conditions.' },
        { id: '2', title: 'Preventive Plan', content: 'Preventive care plan discussed with patient including recommended screenings, immunizations, and lifestyle modifications.' }
      ];
    default:
      return [];
  }
}

// Export a hook to use the Supabase client
export function useSupabaseClient<T = any>() {
  return supabase as any;
}
