import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { fetchMyGroups } from "@/services/groupService";
import { getUserProfile, uploadProfilePicture } from "@/services/userService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Edit3,
  Save,
  CalendarIcon,
  Plus,
  Trash2,
  Clock,
  Video,
  GraduationCap,
  BookOpen,
  Camera,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FeedbackTab from "@/components/FeedbackTab";

interface Group {
  id: string;
  name: string;
  disciplineName: string;
}

interface UserData {
  id?: string;
  name: string;
  email: string;
  matriculation: string;
  courseName: string;
  profilePicture?: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  type: "TRABALHO" | "AULA" | "REUNIAO";
  eventDate: string;
  eventTime: string;
  link?: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(true);

  // ✅ Estados para apagar conta
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    type: "TRABALHO" as CalendarEvent["type"],
    date: new Date(),
    time: "",
    link: "",
  });

  const [userData, setUserData] = useState<UserData>({
    name: "Carregando...",
    email: "carregando...",
    matriculation: "---",
    courseName: "---",
    profilePicture: undefined,
  });

  const handleLogout = () => {
    localStorage.removeItem("hubdosaber-token");
    navigate("/login");
  };

  // ✅ Função para apagar conta
  const handleDeleteAccount = async () => {
    const token = localStorage.getItem("hubdosaber-token");
    if (!token) {
      navigate("/login");
      return;
    }
    setDeletingAccount(true);
    try {
      await axios.delete("http://localhost:8080/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.clear();
      navigate("/login");
    } catch (err) {
      console.error("Erro ao apagar conta:", err);
      alert("Não foi possível apagar a conta. Tente novamente.");
    } finally {
      setDeletingAccount(false);
      setShowDeleteConfirm(false);
    }
  };

  const loadEvents = async () => {
    const token = localStorage.getItem("hubdosaber-token");
    if (!token) return;
    try {
      setLoadingEvents(true);
      const response = await axios.get("http://localhost:8080/api/events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(response.data);
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
    } finally {
      setLoadingEvents(false);
    }
  };

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.time) {
      alert("Preencha o título e horário do evento");
      return;
    }
    const token = localStorage.getItem("hubdosaber-token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8080/api/events",
        {
          title: newEvent.title,
          type: newEvent.type,
          eventDate: format(newEvent.date, "yyyy-MM-dd"),
          eventTime: newEvent.time,
          link: newEvent.link || null,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setEvents((prev) => [...prev, response.data]);
      setIsAddEventOpen(false);
      setNewEvent({
        title: "",
        type: "TRABALHO",
        date: new Date(),
        time: "",
        link: "",
      });
    } catch (error) {
      console.error("Erro ao criar evento:", error);
      alert("Erro ao criar evento.");
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    const token = localStorage.getItem("hubdosaber-token");
    if (!token) return;
    try {
      await axios.delete(`http://localhost:8080/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
    } catch (error) {
      console.error("Erro ao deletar evento:", error);
    }
  };

  const getEventsForDate = (date: Date) =>
    events.filter((e) => e.eventDate === format(date, "yyyy-MM-dd"));

  const hasEventsOnDate = (date: Date) =>
    events.some((e) => e.eventDate === format(date, "yyyy-MM-dd"));

  const handlePhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setUploadingPhoto(true);
      const newProfilePicture = await uploadProfilePicture(file);
      setUserData((prev) => ({ ...prev, profilePicture: newProfilePicture }));
    } catch (err: any) {
      alert(err.message || "Erro ao atualizar foto.");
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("hubdosaber-token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const profileData = await getUserProfile();
        setUserData({
          id: profileData.id,
          name: profileData.name || "Usuário",
          email: profileData.email || "sem email",
          matriculation: profileData.matriculation || "---",
          courseName: profileData.course?.name || "---",
          profilePicture: profileData.profilePicture,
        });
        const myGroupsData = await fetchMyGroups();
        setMyGroups(myGroupsData);
        await loadEvents();
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoadingGroups(false);
        setLoadingProfile(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleSaveProfile = async () => {
    const token = localStorage.getItem("hubdosaber-token");
    try {
      await axios.put(
        "http://localhost:8080/api/users/me",
        { name: userData.name },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setIsEditing(false);
    } catch (error: any) {
      console.error("Erro ao salvar perfil:", error.response?.data?.message);
    }
  };

  const handleInputChange = (field: keyof UserData, value: string) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

  const getEventIcon = (type: string) => {
    switch (type) {
      case "AULA":
        return <BookOpen className="h-4 w-4" />;
      case "TRABALHO":
        return <GraduationCap className="h-4 w-4" />;
      case "REUNIAO":
        return <Video className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Hub do Saber"
              className="w-20 h-20 rounded-lg"
            />
            <span className="font-semibold text-lg">Hub do Saber</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="text-muted-foreground hover:text-primary"
            >
              Grupos
            </Link>
            <Link
              to="/profile"
              className="text-muted-foreground hover:text-primary"
            >
              Perfil
            </Link>
            <Link
              to="/chats"
              className="text-muted-foreground hover:text-primary"
            >
              Chats
            </Link>
            <Button
              onClick={() => navigate("/create-group")}
              className="bg-black text-white"
            >
              Criar Grupo
            </Button>
            <Button
              variant="outline"
              className="border-red-500 text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              Sair
            </Button>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative">
            <Avatar className="w-20 h-20 border-4 border-primary/20">
              <AvatarImage
                src={userData.profilePicture || undefined}
                alt={userData.name}
              />
              <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                {getInitials(userData.name)}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={triggerFileInput}
              disabled={uploadingPhoto}
              className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-lg"
            >
              {uploadingPhoto ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{userData.name}</h1>
            <p className="text-muted-foreground">{userData.email}</p>
          </div>
        </div>

        <Tabs defaultValue="perfil" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="perfil">Perfil</TabsTrigger>
            <TabsTrigger value="grupos">Meus Grupos</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>

          {/* Aba: Perfil */}
          <TabsContent value="perfil">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold">
                        Informações do Perfil
                      </h2>
                      <div className="flex gap-2">
                        {isEditing ? (
                          <>
                            <Button
                              size="sm"
                              onClick={handleSaveProfile}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Save className="h-4 w-4 mr-1" /> Salvar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setIsEditing(false)}
                            >
                              Cancelar
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setIsEditing(true)}
                          >
                            <Edit3 className="h-4 w-4 mr-1" /> Editar
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label>Nome Completo</Label>
                          <Input
                            value={userData.name}
                            disabled={!isEditing}
                            onChange={(e) =>
                              handleInputChange("name", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <Label>Matrícula</Label>
                          <Input
                            value={userData.matriculation}
                            disabled
                            className="bg-muted/50 cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <Label>Curso</Label>
                          <Input
                            value={userData.courseName}
                            disabled
                            className="bg-muted/50 cursor-not-allowed"
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Label>Email</Label>
                          <Input
                            value={userData.email}
                            disabled
                            className="bg-muted/50 cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* ✅ Card: Zona de perigo */}
                <Card className="border-red-200">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      <h2 className="text-xl font-bold text-red-600">
                        Zona de Perigo
                      </h2>
                    </div>

                    {!showDeleteConfirm ? (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Apagar minha conta</p>
                          <p className="text-sm text-muted-foreground">
                            Sua conta será desativada permanentemente.
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          className="border-red-400 text-red-600 hover:bg-red-50"
                          onClick={() => setShowDeleteConfirm(true)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Apagar conta
                        </Button>
                      </div>
                    ) : (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
                        <p className="text-red-700 font-semibold flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Tem certeza? Esta ação não pode ser desfeita.
                        </p>
                        <p className="text-sm text-red-600">
                          Sua conta será desativada e você perderá acesso ao Hub
                          do Saber.
                        </p>
                        <div className="flex gap-3">
                          <Button
                            onClick={handleDeleteAccount}
                            disabled={deletingAccount}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            {deletingAccount ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Apagando...
                              </>
                            ) : (
                              <>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Sim, apagar minha conta
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setShowDeleteConfirm(false)}
                            disabled={deletingAccount}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Agenda */}
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5" /> Agenda
                    </CardTitle>
                    <Dialog
                      open={isAddEventOpen}
                      onOpenChange={setIsAddEventOpen}
                    >
                      <DialogTrigger asChild>
                        <Button size="sm" variant="ghost">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Novo Evento</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Título</Label>
                            <Input
                              value={newEvent.title}
                              onChange={(e) =>
                                setNewEvent({
                                  ...newEvent,
                                  title: e.target.value,
                                })
                              }
                              placeholder="Ex: Aula de React"
                            />
                          </div>
                          <div>
                            <Label>Tipo</Label>
                            <Select
                              value={newEvent.type}
                              onValueChange={(value) =>
                                setNewEvent({ ...newEvent, type: value as any })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="AULA">📚 Aula</SelectItem>
                                <SelectItem value="TRABALHO">
                                  💻 Trabalho
                                </SelectItem>
                                <SelectItem value="REUNIAO">
                                  📅 Reunião
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Data</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !newEvent.date && "text-muted-foreground",
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {newEvent.date
                                    ? format(newEvent.date, "PPP", {
                                        locale: ptBR,
                                      })
                                    : "Escolha uma data"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={newEvent.date}
                                  onSelect={(date) =>
                                    setNewEvent({
                                      ...newEvent,
                                      date: date || new Date(),
                                    })
                                  }
                                  locale={ptBR}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <div>
                            <Label>Horário</Label>
                            <Input
                              type="time"
                              value={newEvent.time}
                              onChange={(e) =>
                                setNewEvent({
                                  ...newEvent,
                                  time: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label>Link (opcional)</Label>
                            <Input
                              value={newEvent.link}
                              onChange={(e) =>
                                setNewEvent({
                                  ...newEvent,
                                  link: e.target.value,
                                })
                              }
                              placeholder="https://meet.google.com/..."
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                          <Button onClick={handleAddEvent}>
                            Adicionar Evento
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    {loadingEvents ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin" />
                      </div>
                    ) : (
                      <>
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          className="rounded-md border"
                          locale={ptBR}
                          modifiers={{
                            hasEvent: (date) => hasEventsOnDate(date),
                          }}
                          modifiersClassNames={{
                            hasEvent: "bg-primary/20 font-bold",
                          }}
                        />
                        {selectedDate &&
                          getEventsForDate(selectedDate).length > 0 && (
                            <div className="mt-4 space-y-2">
                              <h4 className="font-medium flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Eventos do dia (
                                {getEventsForDate(selectedDate).length})
                              </h4>
                              {getEventsForDate(selectedDate).map((event) => (
                                <div
                                  key={event.id}
                                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                                >
                                  <div className="flex items-center gap-2 flex-1 min-w-0">
                                    {getEventIcon(event.type)}
                                    <div className="flex flex-col min-w-0">
                                      {event.link ? (
                                        <a
                                          href={event.link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-sm font-medium text-primary hover:underline truncate flex items-center gap-1"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          {event.title}
                                          <Video className="h-3 w-3 flex-shrink-0" />
                                        </a>
                                      ) : (
                                        <span className="text-sm font-medium truncate">
                                          {event.title}
                                        </span>
                                      )}
                                      <span className="text-xs text-muted-foreground">
                                        {event.eventTime}
                                        {event.link && (
                                          <span className="ml-1 text-primary">
                                            · clique para acessar
                                          </span>
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDeleteEvent(event.id)}
                                    className="flex-shrink-0"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Aba: Meus Grupos */}
          <TabsContent value="grupos">
            {loadingGroups ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <p>Carregando grupos...</p>
              </div>
            ) : myGroups.length === 0 ? (
              <Card className="p-12 text-center border-dashed border-2">
                <p className="text-muted-foreground mb-4">
                  Você ainda não tem grupos.
                </p>
                <Button
                  onClick={() => navigate("/dashboard")}
                  variant="outline"
                >
                  Explorar Grupos
                </Button>
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
                      <CardTitle className="text-lg truncate">
                        {group.name}
                      </CardTitle>
                      <Badge variant="secondary">{group.disciplineName}</Badge>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Aba: Feedback */}
          <TabsContent value="feedback">
            <FeedbackTab
              userId={userData.id ?? ""}
              authorName={userData.name}
              courseName={userData.courseName}
              profilePicture={userData.profilePicture ?? ""}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Profile;
