import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { ThemeProvider } from './components/theme/theme-provider';

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="light" storageKey="bus-dashboard-theme">
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </ThemeProvider>
);
