'use client';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }) {
  return (
    <>
      {children}
      <Toaster 
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#333',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            fontSize: '14px',
            maxWidth: '400px',
            fontWeight: '500'
          },
          success: {
            style: {
              background: '#dcfce7',
              color: '#15803d',
              border: '1px solid #86efac'
            },
            iconTheme: {
              primary: '#22c55e',
              secondary: '#dcfce7'
            }
          },
          error: {
            style: {
              background: '#fef2f2',
              color: '#b91c1c',
              border: '1px solid #fecaca'
            },
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fef2f2'
            }
          }
        }}
      />
    </>
  );
} 