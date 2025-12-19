// Dashboard.tsx - VERSÃO CORRIGIDA E OTIMIZADA
import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Users, Clock, MapPin, Loader2, RefreshCw } from "lucide-react";
import { fetchAllGroups, fetchMyGroups, Group } from "@/services/groupService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [allGroups, setAllGroups] = useState<Group[]>([]);
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "my">("all");

  // ✅ Verificar autenticação primeiro
  useEffect(() => {
    const token = localStorage.getItem("hubdosaber-token");
    if (!token) {
      console.warn("⚠️ Token não encontrado. Redirecionando para login...");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // ✅ useCallback para evitar recriação da função
  const loadGroups = useCallback(async (showRefreshing = false) => {
    const token = localStorage.getItem("hubdosaber-token");
    
    if (!token) {
      console.warn("⚠️ Token não encontrado durante carregamento");
      navigate("/login", { replace: true });
      return;
    }

    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      console.log("🔄 Carregando grupos...");
      
      const [allGroupsData, myGroupsData] = await Promise.all([
        fetchAllGroups(),
        fetchMyGroups()
      ]);
      
      setAllGroups(allGroupsData);
      setMyGroups(myGroupsData);
      
      console.log("✅ Grupos carregados com sucesso:", {
        total: allGroupsData.length,
        meus: myGroupsData.length,
        timestamp: new Date().toLocaleTimeString()
      });
    } catch (err: any) {
      console.error("❌ Erro ao carregar grupos:", err);
      
      // ✅ Tratamento específico para erro 401
      if (err.response?.status === 401 || err.message?.includes("401")) {
        console.error("🔒 Token inválido ou expirado");
        setError("Sessão expirada. Redirecionando para login...");
        localStorage.removeItem("hubdosaber-token");
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 2000);
      } else {
        setError(err.message || "Erro ao carregar grupos. Tente novamente.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [navigate]);

  // ✅ Carregar grupos ao montar o componente
  useEffect(() => {
    const token = localStorage.getItem("hubdosaber-token");
    if (token) {
      loadGroups();
    }
  }, [loadGroups]);

  // ✅ Auto-refresh a cada 30 segundos (opcional - pode remover se preferir)
  useEffect(() => {
    const token = localStorage.getItem("hubdosaber-token");
    if (!token) return;

    const interval = setInterval(() => {
      console.log("🔄 Auto-refresh de grupos");
      loadGroups(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [loadGroups]);

  const displayGroups = activeTab === "my" ? myGroups : allGroups;

  const subjects = Array.from(
    new Set(displayGroups.map(group => group.disciplineName).filter(Boolean))
  ).sort();

  const filteredGroups = displayGroups.filter(group => {
    const matchesSearch = 
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = !selectedSubject || group.disciplineName === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  // ✅ Handler para navegação para perfil
  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/profile");
  };

  // ✅ Handler para criar grupo
  const handleCreateGroup = () => {
    navigate("/create-group");
  };

  // ✅ Handler para limpar filtros
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedSubject("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">HS</span>
            </div>
            <span className="font-semibold text-lg">Hub do Saber</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link to="/dashboard" className="text-foreground font-medium">Grupos</Link>
            <button 
              onClick={handleProfileClick}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Perfil
            </button>
            <Button 
              onClick={handleCreateGroup} 
              className="bg-black text-white hover:bg-black/90"
            >
              Criar Grupo
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Encontre seu grupo!</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Conecte-se com pessoas que compartilham sua paixão pelo conhecimento.
          </p>
          <p className="text-lg text-muted-foreground">
            Descubra grupos interativos e tenha acesso a aulas presenciais e online.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Tabs com contador e botão refresh */}
        <div className="flex gap-3 mb-8 justify-center items-center flex-wrap">
          <Button
            variant={activeTab === "all" ? "default" : "outline"}
            onClick={() => setActiveTab("all")}
            className="min-w-[200px] h-12"
            size="lg"
          >
            <span className="flex items-center gap-2">
              Todos os Grupos
              <Badge variant={activeTab === "all" ? "secondary" : "outline"}>
                {allGroups.length}
              </Badge>
            </span>
          </Button>
          <Button
            variant={activeTab === "my" ? "default" : "outline"}
            onClick={() => setActiveTab("my")}
            className="min-w-[200px] h-12"
            size="lg"
          >
            <span className="flex items-center gap-2">
              Meus Grupos
              <Badge variant={activeTab === "my" ? "secondary" : "outline"}>
                {myGroups.length}
              </Badge>
            </span>
          </Button>
          
          {/* Botão de refresh */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => loadGroups(true)}
            disabled={refreshing || loading}
            title="Atualizar grupos"
            className="h-12 w-12"
          >
            <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Buscar grupos por nome ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-2 border rounded-md bg-background min-w-[200px]"
          >
            <option value="">Todas as disciplinas</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
          {(searchTerm || selectedSubject) && (
            <Button 
              variant="outline" 
              onClick={handleClearFilters}
              className="whitespace-nowrap"
            >
              Limpar Filtros
            </Button>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
            <span className="text-lg">Carregando grupos...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6">
            <p className="font-semibold">❌ Erro ao carregar grupos</p>
            <p>{error}</p>
            {!error.includes("Sessão expirada") && (
              <Button 
                onClick={() => loadGroups()} 
                variant="outline" 
                size="sm" 
                className="mt-2"
              >
                Tentar novamente
              </Button>
            )}
          </div>
        )}

        {/* Groups Grid */}
        {!loading && !error && (
          <>
            {filteredGroups.length === 0 ? (
              <Card className="p-12 text-center border-dashed border-2">
                <div className="text-6xl mb-4">
                  {activeTab === "my" ? "📚" : "🔍"}
                </div>
                <p className="text-xl text-muted-foreground mb-4">
                  {activeTab === "my" 
                    ? "Você ainda não participa de nenhum grupo."
                    : searchTerm || selectedSubject
                    ? "Nenhum grupo encontrado com os filtros aplicados."
                    : "Nenhum grupo disponível no momento."}
                </p>
                <Button
                  onClick={() => {
                    if (activeTab === "my") {
                      setActiveTab("all");
                    } else {
                      handleClearFilters();
                    }
                  }}
                  variant="outline"
                >
                  {activeTab === "my" ? "Explorar todos os grupos" : "Limpar filtros"}
                </Button>
              </Card>
            ) : (
              <>
                {/* Contador de resultados */}
                <div className="mb-4 text-sm text-muted-foreground">
                  Mostrando <span className="font-semibold">{filteredGroups.length}</span> grupo(s)
                  {(searchTerm || selectedSubject) && " com os filtros aplicados"}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredGroups.map((group) => (
                    <Card
                      key={group.id}
                      className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary/30"
                      onClick={() => navigate(`/group/${group.id}`)}
                    >
                      <CardHeader>
                        <div className="w-full h-32 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg mb-4 flex items-center justify-center text-4xl">
                          📚
                        </div>
                        <CardTitle className="text-xl">{group.name}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {group.description || "Sem descrição disponível"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <Badge variant="secondary" className="mb-2">
                            {group.disciplineName}
                          </Badge>
                          
                          {/* Número de participantes */}
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4 flex-shrink-0" />
                            <span>
                              <span className="font-semibold text-foreground">
                                {group.currentMembers ?? 0}
                              </span>
                              {" / "}
                              {group.maxMembers}
                              {" participantes"}
                            </span>
                          </div>

                          {group.monitoring && (
                            <Badge variant="outline" className="text-xs">
                              🎓 Monitoria
                            </Badge>
                          )}
                          
                          {group.courseName && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>📖 {group.courseName}</span>
                            </div>
                          )}
                          
                          {group.universityName && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate">{group.universityName}</span>
                            </div>
                          )}

                          {/* Badge de grupo cheio */}
                          {group.currentMembers >= group.maxMembers && (
                            <Badge variant="destructive" className="text-xs">
                              Grupo Cheio
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
