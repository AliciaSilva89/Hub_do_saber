import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Plus, BookOpen, GraduationCap, Video, ExternalLink, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";

// Interface para garantir que o TypeScript entenda os dados do Grupo
interface Group {
  id: string;
  name: string;
  disciplineName: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  type: "trabalho" | "aula" | "reuniao";
  date: Date;
  time: string;
  link?: string;
  groupName?: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  
  // Estados para Grupos e Carregamento
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(true);

  const [userData, setUserData] = useState({
    fullName: "Usuário do Hub",
    email: "carregando...",
    registration: "---",
    address: "---",
    interests: "",
    bio: "Bem-vindo ao meu perfil!"
  });

  // --- BUSCA DE DADOS ---
  useEffect(() => {
    // Definimos a função
    const fetchUserData = async () => {
      const token = localStorage.getItem("hubdosaber-token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const headers = { Authorization: `Bearer ${token}` };
        
        // Busca os grupos reais do usuário (Dono e Membro)
        const groupsRes = await axios.get("http://localhost:3000/bff/group?mygroup=true", { headers });
        setMyGroups(groupsRes.data);

        // Se você tiver uma rota de perfil, pode descomentar abaixo:
        // const profileRes = await axios.get("http://localhost:3000/bff/user/profile", { headers });
        // setUserData(profileRes.data);
        
      } catch (error) {
        console.error("Erro ao carregar dados do perfil:", error);
      } finally {
        setLoadingGroups(false);
      }
    };

    // CORREÇÃO: Chamamos o nome correto da função definida acima
    fetchUserData();
  }, [navigate]);

  // --- LÓGICA DE AGENDA (MOCK) ---
  const [events, setEvents] = useState<CalendarEvent[]>([
    { id: "1", title: "Aula de Programação", type: "aula", date: new Date(), time: "19:00" }
  ]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", type: "trabalho" as any, date: new Date(), time: "", link: "", groupName: "" });

  const handleSave = () => setIsEditing(false);
  const handleInputChange = (field: string, value: string) => setUserData(prev => ({ ...prev, [field]: value }));
  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.time) return;
    setEvents(prev => [...prev, { ...newEvent, id: Date.now().toString() }]);
    setIsAddEventOpen(false);
  };
  const handleDeleteEvent = (eventId: string) => setEvents(prev => prev.filter(e => e.id !== eventId));
  const getEventsForDate = (date: Date) => events.filter(e => e.date.toDateString() === date.toDateString());
  const datesWithEvents = events.map(e => e.date.toDateString());

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
            <Link to="/dashboard" className="text-muted-foreground hover:text-primary">Grupos</Link>
            <Link to="/profile" className="text-foreground font-medium">Perfil</Link>
            <Button onClick={() => navigate("/create-group")} className="bg-black text-white">Criar Grupo</Button>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Avatar className="w-20 h-20"><AvatarFallback>US</AvatarFallback></Avatar>
          <div>
            <h1 className="text-2xl font-bold">{userData.fullName}</h1>
            <p className="text-muted-foreground">{userData.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-end mb-6">
                  <Button onClick={() => setIsEditing(!isEditing)} className="bg-purple-600 text-white">
                    {isEditing ? "Salvar" : "Editar Perfil"}
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-4">
                    <div><Label>Nome Completo</Label><Input value={userData.fullName} disabled={!isEditing} onChange={e => handleInputChange('fullName', e.target.value)} /></div>
                    <div><Label>Matrícula</Label><Input value={userData.registration} disabled={!isEditing} onChange={e => handleInputChange('registration', e.target.value)} /></div>
                  </div>
                  <div className="space-y-4">
                    <div><Label>Biografia</Label><Textarea value={userData.bio} disabled={!isEditing} className="min-h-[100px]" onChange={e => handleInputChange('bio', e.target.value)} /></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SEÇÃO DINÂMICA: LISTA DE GRUPOS DO BANCO */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Meus grupos</h2>
              {loadingGroups ? (
                <p>Carregando grupos...</p>
              ) : myGroups.length === 0 ? (
                <Card className="p-12 text-center border-dashed border-2">
                  <p className="text-muted-foreground mb-4">Você ainda não tem grupos.</p>
                  <Button onClick={() => navigate("/dashboard")} variant="outline">Explorar Grupos</Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {myGroups.map((group) => (
                    <Card 
                      key={group.id} 
                      className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary/30"
                      onClick={() => navigate(`/group/${group.id}`)}
                    >
                      <CardHeader className="pb-3">
                        <div className="w-full h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg mb-3 flex items-center justify-center text-4xl">
                          📚
                        </div>
                        <CardTitle className="text-lg truncate">{group.name}</CardTitle>
                        <Badge variant="secondary">{group.disciplineName}</Badge>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
             <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2"><CalendarIcon className="h-5 w-5" /> Agenda</CardTitle>
                <Button size="sm" variant="ghost" onClick={() => setIsAddEventOpen(true)}><Plus className="h-4 w-4" /></Button>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  locale={ptBR}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;