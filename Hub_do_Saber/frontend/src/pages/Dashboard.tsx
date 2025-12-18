import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Users, Clock, MapPin, Loader2 } from "lucide-react";
import { fetchAllGroups, fetchMyGroups, Group } from "@/services/groupService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [allGroups, setAllGroups] = useState<Group[]>([]);
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const loadGroups = async () => {
      const token = localStorage.getItem("hubdosaber-token");
      
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const [allGroupsData, myGroupsData] = await Promise.all([
          fetchAllGroups(),
          fetchMyGroups()
        ]);
        
        setAllGroups(allGroupsData);
        setMyGroups(myGroupsData);
        
        console.log("✅ Grupos carregados:", {
          total: allGroupsData.length,
          meus: myGroupsData.length
        });
      } catch (err: any) {
        console.error("❌ Erro ao carregar grupos:", err);
        setError(err.message || "Erro ao carregar grupos");
        
        if (err.message?.includes("login")) {
          setTimeout(() => navigate("/login"), 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    loadGroups();
  }, [navigate]);

  const displayGroups = activeTab === "my" ? myGroups : allGroups;

  const subjects = Array.from(
    new Set(displayGroups.map(group => group.disciplineName).filter(Boolean))
  ).sort();

  const filteredGroups = displayGroups.filter(group => {
    const matchesSearch = 
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = !selectedSubject || group.disciplineName === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="min-h-screen bg-background">
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
            <Link to="/profile" className="text-muted-foreground hover:text-primary">Perfil</Link>
            <Button onClick={() => navigate("/create-group")} className="bg-black text-white">
              Criar Grupo
            </Button>
          </nav>
        </div>
      </header>

      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-16 px-6">
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

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex gap-3 mb-8 justify-center">
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
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Buscar grupos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-2 border rounded-md bg-background"
          >
            <option value="">Todas as disciplinas</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-lg">Carregando grupos...</span>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-semibold">Erro ao carregar grupos</p>
            <p>{error}</p>
          </div>
        )}

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
                    : "Nenhum grupo encontrado com os filtros aplicados."}
                </p>
                <Button
                  onClick={() => {
                    if (activeTab === "my") {
                      setActiveTab("all");
                    } else {
                      setSearchTerm("");
                      setSelectedSubject("");
                    }
                  }}
                  variant="outline"
                >
                  {activeTab === "my" ? "Explorar todos os grupos" : "Limpar filtros"}
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGroups.map((group) => (
                  <Card
                    key={group.id}
                    className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary/30"
                    onClick={() => navigate(`/group/${group.id}`)}
                  >
                    <CardHeader>
                      <div className="w-full h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg mb-4 flex items-center justify-center text-4xl">
                        📚
                      </div>
                      <CardTitle className="text-xl">{group.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {group.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Badge variant="secondary" className="mb-2">
                          {group.disciplineName}
                        </Badge>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>
                            {group.currentMembers || 0} / {group.maxMembers} participantes
                          </span>
                        </div>
                        {group.schedule && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{group.schedule}</span>
                          </div>
                        )}
                        {group.universityName && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{group.universityName}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
