import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  MapPin, 
  User, 
  Calendar, 
  Clock,
  BookOpen,
  ArrowLeft,
  Loader2,
  MessageSquare
} from "lucide-react";
import { fetchGroupDetail, joinGroup } from "@/services/groupService";
import type { GroupDetail } from "@/services/groupService";
import axios from "axios";

const GroupView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [groupData, setGroupData] = useState<GroupDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  const [isAlreadyMember, setIsAlreadyMember] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // ✅ ADICIONAR - Heartbeat para marcar presença
  useEffect(() => {
    const sendHeartbeat = async () => {
      const token = localStorage.getItem("hubdosaber-token");
      if (!token) return;

      try {
        await axios.post("http://localhost:8080/api/users/me/heartbeat", {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("💓 Heartbeat enviado");
      } catch (error) {
        console.error("❌ Erro ao enviar heartbeat:", error);
      }
    };

    // Enviar heartbeat imediatamente
    sendHeartbeat();

    // Enviar heartbeat a cada 2 minutos
    const interval = setInterval(sendHeartbeat, 120000); // 2 minutos

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadGroupData = async () => {
      if (!id) {
        setLoading(false);
        setError("ID do grupo não encontrado");
        return;
      }

      const token = localStorage.getItem("hubdosaber-token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setError(null);
        
        // Buscar dados do usuário logado
        const userResponse = await axios.get("http://localhost:8080/api/users/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const userId = userResponse.data.id;
        setCurrentUserId(userId);
        
        console.log("👤 ID do usuário logado:", userId);
        
        // Buscar dados do grupo
        const data = await fetchGroupDetail(id);
        console.log("📦 Dados do grupo recebidos:", data);
        console.log("👥 Membros do grupo:", data.members);
        
        setGroupData(data);
        
        // Verificar se o usuário já é membro
        let isMember = false;
        
        if (Array.isArray(data.members)) {
          isMember = data.members.some((member: any) => {
            const memberId = member.id || member.userId || member.user?.id;
            console.log("🔍 Comparando:", memberId, "com", userId);
            return memberId === userId || memberId === String(userId) || String(memberId) === String(userId);
          });
        }
        
        setIsAlreadyMember(isMember);
        console.log("✅ Usuário já é membro?", isMember);
        
      } catch (err: unknown) {
        const error = err instanceof Error ? err : new Error("Erro desconhecido");
        console.error("❌ Erro ao carregar grupo:", error);
        setError(error.message || "Erro ao carregar grupo");
        
        if (error.message?.includes("login")) {
          setTimeout(() => navigate("/login"), 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    loadGroupData();
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
      
      const updatedData = await fetchGroupDetail(id);
      setGroupData(updatedData);
      setIsAlreadyMember(true);
      
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error("Erro desconhecido");
      console.error("❌ Erro ao entrar no grupo:", error);
      alert(error.message || "Erro ao entrar no grupo");
      
      if (error.message?.includes("login")) {
        navigate("/login");
      }
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-lg">Carregando grupo...</span>
        </div>
      </div>
    );
  }

  if (error) {
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
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-12">
          <Card className="p-12 text-center border-red-200 bg-red-50">
            <p className="text-xl text-red-700 mb-4">{error}</p>
            <Button onClick={() => navigate("/dashboard")} variant="outline">
              Voltar para Dashboard
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  if (!groupData) {
    return null;
  }

  const uniqueMembers = Array.isArray(groupData.members) 
    ? Array.from(
        new Map(
          groupData.members
            .filter((member: any) => member && (member.id || member.userId))
            .map((member: any) => {
              const memberId = member.id || member.userId || member.user?.id;
              return [memberId, member];
            })
        ).values()
      )
    : [];

  console.log("📊 Membros únicos filtrados:", uniqueMembers);

  const participantsCount = uniqueMembers.length;
  const availableSlots = Math.max(groupData.maxMembers - participantsCount, 0);

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
            <Link to="/dashboard" className="text-muted-foreground hover:text-primary">
              Grupos
            </Link>
            <Link to="/profile" className="text-muted-foreground hover:text-primary">
              Perfil
            </Link>
            <Button onClick={() => navigate("/create-group")} className="bg-black text-white">
              Criar Grupo
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6 -ml-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para grupos
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-2">{groupData.name}</h1>
                    <Badge variant="secondary" className="mb-4">
                      {groupData.disciplineName}
                    </Badge>
                  </div>
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center text-4xl">
                    📚
                  </div>
                </div>

                <p className="text-muted-foreground text-lg mb-6">
                  {groupData.description}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {isAlreadyMember ? (
                    <>
                      <Button
                        onClick={() => navigate(`/group/${id}/chat`)}
                        className="bg-green-600 hover:bg-green-700 flex-1"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Abrir Chat do Grupo
                      </Button>
                      <Badge variant="outline" className="px-4 py-2 text-sm flex items-center">
                        ✓ Você é membro
                      </Badge>
                    </>
                  ) : (
                    <Button
                      onClick={handleJoin}
                      disabled={joining || availableSlots === 0}
                      className="bg-blue-600 hover:bg-blue-700 flex-1"
                    >
                      {joining ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Entrando...
                        </>
                      ) : availableSlots === 0 ? (
                        "Grupo Cheio"
                      ) : (
                        <>
                          <Users className="h-4 w-4 mr-2" />
                          Participar do Grupo
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Group Details */}
            <Card>
              <CardHeader>
                <CardTitle>Detalhes do Grupo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Disciplina</p>
                    <p className="font-medium">{groupData.disciplineName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <User className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Organizador</p>
                    <p className="font-medium">{groupData.ownerName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Universidade</p>
                    <p className="font-medium">{groupData.universityName}</p>
                  </div>
                </div>

                {groupData.schedule && (
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Horário</p>
                      <p className="font-medium">{groupData.schedule}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Participants Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Participantes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="text-2xl font-bold">{participantsCount}</p>
                      <p className="text-sm text-muted-foreground">
                        {/* ✅ Mostrar membros online */}
                        {groupData.onlineMembers || 0} online de {participantsCount} membros
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{availableSlots}</p>
                      <p className="text-sm text-blue-700">Vagas disponíveis</p>
                    </div>
                    <Calendar className="h-8 w-8 text-blue-600" />
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground mb-3">
                      Capacidade máxima: {groupData.maxMembers} membros
                    </p>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{
                          width: `${(participantsCount / groupData.maxMembers) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Lista de Membros com fotos */}
                {uniqueMembers.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3 text-sm">Membros do grupo</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {uniqueMembers.map((member: any) => (
                        <div
                          key={member.id}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50"
                        >
                          {/* ✅ Avatar com foto de perfil */}
                          <Avatar className="h-8 w-8">
                            <AvatarImage 
                              src={member.profilePicture || undefined} 
                              alt={member.name} 
                            />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                              {member.name?.[0]?.toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{member.name || "Usuário"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GroupView;
