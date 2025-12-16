import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Users, Clock, MapPin } from "lucide-react";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const subjects = [
    "Português", "Matemática", "História", "Geografia", 
    "Inglês", "Ciências", "Química", "Física", "Espanhol"
  ];

  const groups = [
    {
      id: 1,
      title: "Grupo de Estudos - Matemática",
      description: "Estudo aprofundado de cálculo, álgebra e geometria para o ensino médio e superior.",
      participants: 15,
      schedule: "3ª e 5ª - 19hrs",
      status: "Online",
      subject: "Matemática"
    },
    {
      id: 2,
      title: "Grupo de Estudos - Português",
      description: "Análise e interpretação de textos, gramática e redação para exames e aprimoramento.",
      participants: 15,
      schedule: "3ª e 5ª - 19hrs",
      status: "Online",
      subject: "Português"
    },
    {
      id: 3,
      title: "Grupo de Estudos - Filosofia",
      description: "Explorando os grandes pensadores da antiguidade e suas contribuições para o conhecimento humano.",
      participants: 15,
      schedule: "3ª e 5ª - 19hrs",
      status: "Online",
      subject: "Filosofia"
    },
    {
      id: 4,
      title: "Grupo de Estudos - História",
      description: "Viagem no tempo: da pré-história à contemporaneidade, desvendando os fatos que moldaram o mundo.",
      participants: 12,
      schedule: "2ª e 4ª - 20hrs",
      status: "Online",
      subject: "História"
    },
    {
      id: 5,
      title: "Grupo de Estudos - Física",
      description: "Desvendando as leis do universo: mecânica, termodinâmica, eletromagnetismo e muito mais.",
      participants: 18,
      schedule: "3ª e 6ª - 18hrs",
      status: "Online",
      subject: "Física"
    },
    {
      id: 6,
      title: "Grupo de Estudos - Química",
      description: "A estrutura da matéria e suas transformações: explorando reações, elementos e compostos.",
      participants: 10,
      schedule: "4ª e 5ª - 19hrs",
      status: "Online",
      subject: "Química"
    }
  ];

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = !selectedSubject || group.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

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
            <Link to="/dashboard" className="text-foreground hover:text-primary font-medium">
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
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Encontre seu grupo!</h1>
          <p className="text-lg text-muted-foreground mb-2">
            Conecte-se com pessoas que compartilham sua paixão pelo conhecimento.
          </p>
          <p className="text-lg text-muted-foreground mb-8">
            Descubra grupos interativos e tenha acesso a aulas presenciais e online.
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Subject Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <Badge
            variant={!selectedSubject ? "default" : "outline"}
            className="cursor-pointer hover:bg-primary/90"
            onClick={() => setSelectedSubject("")}
          >
            Todas
          </Badge>
          {subjects.map((subject) => (
            <Badge
              key={subject}
              variant={selectedSubject === subject ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/90"
              onClick={() => setSelectedSubject(subject === selectedSubject ? "" : subject)}
            >
              {subject}
            </Badge>
          ))}
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <Link key={group.id} to={`/group/${group.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  {/* Group Image Placeholder */}
                  <div className="w-full h-32 bg-gradient-to-r from-blue-100 via-purple-50 to-orange-50 rounded-lg mb-3 flex items-center justify-center">
                    <div className="text-4xl">📚</div>
                  </div>
                  <CardTitle className="text-lg">{group.title}</CardTitle>
                  <CardDescription className="text-sm line-clamp-2">
                    {group.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-2 pt-0">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{group.status}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{group.participants} participantes</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{group.schedule}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredGroups.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum grupo encontrado com os filtros aplicados.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;