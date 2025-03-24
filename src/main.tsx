import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router-dom";
import Routes from './Routes/Routes';
import { ThemeProvider } from './Providers/ThemeProvider';
import { Toaster } from './components/ui/sonner';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/react-query';

createRoot(document.getElementById('root')!).render(
  <StrictMode>


    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={Routes} />
      </QueryClientProvider>
      <Toaster position="top-center" richColors />
    </ThemeProvider>


  </StrictMode>,
)
