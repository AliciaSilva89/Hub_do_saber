import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin, User, Calendar } from "lucide-react";
import { fetchGroupDetail, joinGroup } from "@/services/groupService";
import type { GroupDetail } from "@/services/groupService";

interface DisplayGroupDetail {
  id: string;
  title: string;
  description: string;
  subject: string;
  leader: string;
  location: string;
  participants: number;
  maxMembers: number;
  schedule?: string;
  image?: string;
}

const GroupView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [groupData, setGroupData] = useState<DisplayGroupDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);

  const fallback: DisplayGroupDetail = {
    id: "",
    title: "Grupo de Estudos",
    description: "Descrição do grupo.",
    subject: "Geral",
    leader: "Organizador",
    location: "Online",
    participants: 0,
    maxMembers: 0,
    schedule: "",
    image: "📚",
  };

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setLoading(false);
        setError("ID do grupo não encontrado");
        return;
      }

      // Verifica se tem token antes de tentar carregar
      const token = localStorage.getItem("hubdosaber-token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setError(null);
        const gd: GroupDetail = await fetchGroupDetail(id);
        const participantsCount = Array.isArray(gd.members) ? gd.members.length : 0;
        
        setGroupData({
          id: gd.id,
          title: gd.name,
          description: gd.description,
          subject: gd.disciplineName,
          leader: gd.ownerName,
          location: gd.universityName || "Online",
          participants: participantsCount,
          maxMembers: gd.maxMembers,
          schedule: gd.schedule || "Não definido",
          image: "📚",
        });
      } catch (err: unknown) {
        const error = err instanceof Error ? err : new Error("Erro desconhecido");
        console.error("Erro ao carregar grupo:", error);
        setError(error.message || "Erro ao carregar grupo");
        
        // Se for erro de autenticação, redireciona para login
        if (error.message?.includes("login")) {
          setTimeout(() => navigate("/login"), 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, navigate]);

  const handleJoin = async () => {
    const token = localStorage.getItem("hubdosaber-token");
    
    if (!token) {
      navigate("/login");
      return;
    }

    if (!id) {
      alert("ID do grupo não encontrado");
      return;
    }

    try {
      setJoining(true);
      await joinGroup(id);
      alert("Você entrou no grupo com sucesso!");
      
      // Recarrega os dados do grupo para atualizar o número de participantes
      const gd: GroupDetail = await fetchGroupDetail(id);
      const participantsCount = Array.isArray(gd.members) ? gd.members.length : 0;
      
      setGroupData({
        id: gd.id,
        title: gd.name,
        description: gd.description,
        subject: gd.disciplineName,
        leader: gd.ownerName,
        location: gd.universityName || "Online",
        participants: participantsCount,
        maxMembers: gd.maxMembers,
        schedule: gd.schedule || "Não definido",
        image: "📚",
      });
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error("Erro desconhecido");
      console.error("Erro ao entrar no grupo:", error);
      alert(error.message || "Erro ao entrar no grupo");
      
      // Se for erro de autenticação, redireciona para login
      if (error.message?.includes("login")) {
        navigate("/login");
      }
    } finally {
      setJoining(false);
    }
  };

  const displayData = groupData || fallback;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <img
              src="/logohubdosaber.png"
              alt="Logo da plataforma Hub do Saber"
              className="w-16 h-16 rounded-lg object-cover"
            />
            <span className="font-semibold text-lg">Hub do Saber</span>
          </div>
          
          <nav className="flex items-center gap-6">
            <Link to="/dashboard" className="text-muted-foreground hover:text-primary">
              Grupos
            </Link>
            <Link to="/profile" className="text-muted-foreground hover:text-primary">
              Perfil
            </Link>
            <Link to="/saiba" className="text-muted-foreground hover:text-primary">
              Saiba
            </Link>
            <Link to="/create-group">
              <Button className="bg-black hover:bg-black/90 text-white">
                Criar Grupo
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Saiba mais sobre o grupo</h1>
        </div>

        {loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => navigate("/dashboard")}>
              Voltar para Dashboard
            </Button>
          </div>
        )}

        {!loading && !error && (
          <Card className="bg-gray-50">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Group Image and Info */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      {displayData.title}
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      {displayData.description}
                    </p>
                  </div>

                  {/* Group Image */}
                  <div className="w-full max-w-sm mx-auto">
                    <div className="bg-gradient-to-r from-blue-100 via-purple-50 to-orange-50 rounded-lg p-8 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl mb-4">
                          {displayData.image}
                        </div>
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                          <div className="text-2xl">🔍</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="p-2">
                        <span className="text-sm">📖</span>
                      </Badge>
                      <span className="font-medium">
                        {displayData.subject}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="p-2">
                        <User className="h-4 w-4" />
                      </Badge>
                      <span className="font-medium">
                        {displayData.leader}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="p-2">
                        <MapPin className="h-4 w-4" />
                      </Badge>
                      <span className="font-medium">
                        {displayData.location}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="p-2">
                        <Users className="h-4 w-4" />
                      </Badge>
                      <span className="font-medium">
                        {displayData.participants} participantes - 
                        {Math.max(
                          displayData.maxMembers - displayData.participants, 
                          0
                        )} vagas restantes
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="p-2">
                        <Calendar className="h-4 w-4" />
                      </Badge>
                      <span className="font-medium">
                        {displayData.schedule}
                      </span>
                    </div>
                  </div>

                  <div className="pt-6">
                    <Button 
                      onClick={handleJoin}
                      disabled={joining}
                      className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white py-3 text-lg font-medium disabled:opacity-50"
                    >
                      {joining ? "Entrando..." : "Participar do Grupo"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default GroupView;