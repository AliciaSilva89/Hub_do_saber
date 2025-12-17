import { useState } from "react";
import { Link } from "react-router-dom";
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
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    fullName: "Alexa Rawles",
    email: "alexarawles@gmail.com",
    registration: "Alexa Rawles",
    address: "Alexa Rawles",
    interests: "",
    bio: "Fale sobre você..."
  });

  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: "1",
      title: "Entrega do trabalho de Filosofia",
      type: "trabalho",
      date: new Date(2025, 11, 20),
      time: "23:59"
    },
    {
      id: "2",
      title: "Aula de Matemática",
      type: "aula",
      date: new Date(2025, 11, 18),
      time: "14:00"
    },
    {
      id: "3",
      title: "Reunião do Grupo de Filosofia",
      type: "reuniao",
      date: new Date(2025, 11, 19),
      time: "19:00",
      link: "https://meet.google.com/abc-defg-hij",
      groupName: "Grupo de Estudos - Filosofia"
    }
  ]);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    type: "trabalho" as "trabalho" | "aula" | "reuniao",
    date: new Date(),
    time: "",
    link: "",
    groupName: ""
  });

  const myGroups = [
    { id: 1, title: "Grupo de Estudos - Filosofia", image: "📚" },
    { id: 2, title: "Grupo de Estudos - Matemática", image: "📚" },
    { id: 3, title: "Grupo de Estudos - História", image: "📚" }
  ];

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.time) return;
    
    const event: CalendarEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      type: newEvent.type,
      date: newEvent.date,
      time: newEvent.time,
      link: newEvent.type === "reuniao" ? newEvent.link : undefined,
      groupName: newEvent.type === "reuniao" ? newEvent.groupName : undefined
    };

    setEvents(prev => [...prev, event]);
    setNewEvent({
      title: "",
      type: "trabalho",
      date: new Date(),
      time: "",
      link: "",
      groupName: ""
    });
    setIsAddEventOpen(false);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "trabalho":
        return <BookOpen className="h-4 w-4" />;
      case "aula":
        return <GraduationCap className="h-4 w-4" />;
      case "reuniao":
        return <Video className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "trabalho":
        return "bg-orange-500";
      case "aula":
        return "bg-blue-500";
      case "reuniao":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getEventTypeBadge = (type: string) => {
    switch (type) {
      case "trabalho":
        return "Trabalho";
      case "aula":
        return "Aula";
      case "reuniao":
        return "Reunião";
      default:
        return "";
    }
  };

  const datesWithEvents = events.map(e => e.date.toDateString());

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-orange-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">HS</span>
            </div>
            <span className="font-semibold text-lg">Hub do Saber</span>
          </div>
          
          <nav className="flex items-center gap-6">
            <Link to="/dashboard" className="text-muted-foreground hover:text-primary">
              Grupos
            </Link>
            <Link to="/profile" className="text-foreground hover:text-primary font-medium">
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
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-8">
          <Avatar className="w-20 h-20">
            <AvatarImage src="/placeholder-avatar.jpg" alt="Perfil" />
            <AvatarFallback className="text-xl font-semibold">AR</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{userData.fullName}</h1>
            <p className="text-muted-foreground">{userData.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Form */}
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-end mb-6">
                  {isEditing ? (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsEditing(false)}
                      >
                        Cancelar
                      </Button>
                      <Button 
                        onClick={handleSave}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Salvar
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => setIsEditing(true)}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Editar
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="fullName" className="text-sm font-medium">
                        Nome Completo
                      </Label>
                      <Input
                        id="fullName"
                        value={userData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="registration" className="text-sm font-medium">
                        Matrícula
                      </Label>
                      <Input
                        id="registration"
                        value={userData.registration}
                        onChange={(e) => handleInputChange('registration', e.target.value)}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={userData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="interests" className="text-sm font-medium">
                        Interesses
                      </Label>
                      <Select 
                        value={userData.interests} 
                        onValueChange={(value) => handleInputChange('interests', value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ciencias">Ciências</SelectItem>
                          <SelectItem value="matematica">Matemática</SelectItem>
                          <SelectItem value="historia">História</SelectItem>
                          <SelectItem value="filosofia">Filosofia</SelectItem>
                          <SelectItem value="literatura">Literatura</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address" className="text-sm font-medium">
                        Endereço
                      </Label>
                      <Input
                        id="address"
                        value={userData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="bio" className="text-sm font-medium">
                        Biografia
                      </Label>
                      <Textarea
                        id="bio"
                        value={userData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        disabled={!isEditing}
                        className="mt-1 min-h-[120px]"
                        placeholder="Fale sobre você..."
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* My Groups Section */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Meus grupos</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {myGroups.map((group) => (
                  <Card key={group.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="w-full h-32 bg-gradient-to-r from-blue-100 via-purple-50 to-orange-50 rounded-lg mb-3 flex items-center justify-center">
                        <div className="text-4xl">{group.image}</div>
                      </div>
                      <CardTitle className="text-lg">{group.title}</CardTitle>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Calendar */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Minha Agenda
                  </CardTitle>
                  <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-1" />
                        Adicionar
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adicionar Evento</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div>
                          <Label>Tipo de Evento</Label>
                          <Select 
                            value={newEvent.type} 
                            onValueChange={(value: "trabalho" | "aula" | "reuniao") => 
                              setNewEvent(prev => ({ ...prev, type: value }))
                            }
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="trabalho">
                                <div className="flex items-center gap-2">
                                  <BookOpen className="h-4 w-4 text-orange-500" />
                                  Trabalho
                                </div>
                              </SelectItem>
                              <SelectItem value="aula">
                                <div className="flex items-center gap-2">
                                  <GraduationCap className="h-4 w-4 text-blue-500" />
                                  Aula
                                </div>
                              </SelectItem>
                              <SelectItem value="reuniao">
                                <div className="flex items-center gap-2">
                                  <Video className="h-4 w-4 text-green-500" />
                                  Reunião
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Título</Label>
                          <Input
                            value={newEvent.title}
                            onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Ex: Entrega do trabalho de Filosofia"
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label>Data</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal mt-1",
                                  !newEvent.date && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {newEvent.date ? format(newEvent.date, "PPP", { locale: ptBR }) : "Selecione uma data"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={newEvent.date}
                                onSelect={(date) => date && setNewEvent(prev => ({ ...prev, date }))}
                                initialFocus
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div>
                          <Label>Horário</Label>
                          <Input
                            type="time"
                            value={newEvent.time}
                            onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                            className="mt-1"
                          />
                        </div>

                        {newEvent.type === "reuniao" && (
                          <>
                            <div>
                              <Label>Nome do Grupo</Label>
                              <Input
                                value={newEvent.groupName}
                                onChange={(e) => setNewEvent(prev => ({ ...prev, groupName: e.target.value }))}
                                placeholder="Ex: Grupo de Estudos - Filosofia"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label>Link da Reunião (Meet, Zoom, etc.)</Label>
                              <Input
                                value={newEvent.link}
                                onChange={(e) => setNewEvent(prev => ({ ...prev, link: e.target.value }))}
                                placeholder="https://meet.google.com/..."
                                className="mt-1"
                              />
                            </div>
                          </>
                        )}

                        <Button onClick={handleAddEvent} className="w-full">
                          Adicionar Evento
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border pointer-events-auto"
                  modifiers={{
                    hasEvent: (date) => datesWithEvents.includes(date.toDateString())
                  }}
                  modifiersStyles={{
                    hasEvent: {
                      fontWeight: "bold",
                      textDecoration: "underline",
                      textDecorationColor: "hsl(var(--primary))"
                    }
                  }}
                />

                {/* Legend */}
                <div className="flex flex-wrap gap-3 mt-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span>Trabalho</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span>Aula</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Reunião</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Events for Selected Date */}
            {selectedDate && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">
                    Eventos em {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {getEventsForDate(selectedDate).length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhum evento nesta data</p>
                  ) : (
                    <div className="space-y-3">
                      {getEventsForDate(selectedDate).map((event) => (
                        <div 
                          key={event.id} 
                          className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-2 flex-1">
                              <div className={cn("p-1.5 rounded-full text-white", getEventTypeColor(event.type))}>
                                {getEventTypeIcon(event.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{event.title}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="secondary" className="text-xs">
                                    {getEventTypeBadge(event.type)}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">{event.time}</span>
                                </div>
                                {event.groupName && (
                                  <p className="text-xs text-muted-foreground mt-1">{event.groupName}</p>
                                )}
                                {event.link && (
                                  <a 
                                    href={event.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-xs text-blue-600 hover:underline mt-1"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                    Entrar na reunião
                                  </a>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => handleDeleteEvent(event.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Upcoming Events */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Próximos Eventos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {events
                    .filter(e => e.date >= new Date())
                    .sort((a, b) => a.date.getTime() - b.date.getTime())
                    .slice(0, 5)
                    .map((event) => (
                      <div key={event.id} className="flex items-center gap-2 text-sm">
                        <div className={cn("w-2 h-2 rounded-full", getEventTypeColor(event.type))}></div>
                        <span className="flex-1 truncate">{event.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(event.date, "dd/MM")}
                        </span>
                      </div>
                    ))}
                  {events.filter(e => e.date >= new Date()).length === 0 && (
                    <p className="text-sm text-muted-foreground">Nenhum evento próximo</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;