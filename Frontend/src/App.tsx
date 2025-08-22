import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import Index from "./pages/Index";
import PortfolioDetail from "./pages/PortfolioDetail";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import AppLayout from "./layouts/AppLayout"; 


const PrivateRoute = ({ children }) => {
  const isAuth = localStorage.getItem("isAuth") === "true";
  return isAuth ? children : <Navigate to="/" />;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes (no sidebar) */}
          <Route path="/" element={<Login />} />

          {/* Protected routes (with sidebar) */}
          <Route element={<AppLayout />}>
            <Route path="/home" element={ <PrivateRoute><Index /></PrivateRoute>} />
            <Route path="/portfolio/:portfolioId" element={<PrivateRoute><PortfolioDetail /></PrivateRoute>} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
