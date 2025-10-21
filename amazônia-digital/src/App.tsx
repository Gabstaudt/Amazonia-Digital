import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AppLayout } from "./components/AppLayout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Explorar from "./pages/Explorar";
import Sobre from "./pages/Sobre";
import Dashboard from "./pages/Dashboard";
import Lotes from "./pages/Lotes";
import LoteDetail from "./pages/LoteDetail";
import Compliance from "./pages/Compliance";
import Auditoria from "./pages/Auditoria";
import Usuarios from "./pages/Usuarios";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/explorar" element={<Explorar />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/app/*" element={<ProtectedRoute><AppLayout><Routes>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="lotes" element={<Lotes />} />
              <Route path="lotes/:id" element={<LoteDetail />} />
              <Route path="compliance/regras" element={<Compliance />} />
              <Route path="auditoria" element={<Auditoria />} />
              <Route path="usuarios" element={<Usuarios />} />
            </Routes></AppLayout></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
