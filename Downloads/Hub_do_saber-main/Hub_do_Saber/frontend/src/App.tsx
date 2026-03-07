import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";

// Suas páginas
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Cadastro from "@/pages/Cadastro";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import GroupView from "@/pages/GroupView";
import GroupChat from "@/pages/GroupChat";
import CreateGroup from "@/pages/CreateGroup";
import NotFound from "@/pages/NotFound";
import Saiba from "@/pages/Saiba";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter
          future={{
            v7_startTransition: true,      // ✅ ADICIONADO
            v7_relativeSplatPath: true,    // ✅ ADICIONADO
          }}
        >
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/group/:id" element={<GroupView />} />
            <Route path="/group/:id/chat" element={<GroupChat />} />
            <Route path="/create-group" element={<CreateGroup />} />
            <Route path="/saiba" element={<Saiba />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
