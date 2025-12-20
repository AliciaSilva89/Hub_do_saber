import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Upload, Loader2 } from "lucide-react";
import axiosInstance from "@/services/axiosConfig";

interface Discipline {
  id: string;
  name: string;
  code: string;
  semester: number;
}

const CreateGroup = () => {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [disciplineId, setDisciplineId] = useState("");
  const [maxMembers, setMaxMembers] = useState(10);
  const [hasMonitoring, setHasMonitoring] = useState(true);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [loadingDisciplines, setLoadingDisciplines] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Buscar disciplinas ao carregar o componente
  useEffect(() => {
    const fetchDisciplines = async () => {
      try {
        const response = await axiosInstance.get("/discipline/all");
        setDisciplines(response.data);
        console.log("✅ Disciplinas carregadas:", response.data.length);
      } catch (error) {
        console.error("❌ Erro ao carregar disciplinas:", error);
        alert("Erro ao carregar disciplinas. Tente recarregar a página.");
      } finally {
        setLoadingDisciplines(false);
      }
    };

    fetchDisciplines();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!disciplineId) {
      alert("Por favor, selecione uma matéria.");
      return;
    }

    setSubmitting(true);

    try {
      // Formato esperado pelo backend (CreateGroupRequest)
      const payload = {
        name: groupName,
        description: description,
        disciplineId: disciplineId,
        maxMembers: maxMembers,
        monitoring: hasMonitoring
      };

      console.log("📤 Enviando dados:", payload);

      const response = await axiosInstance.post("/group", payload);

      // Backend retorna apenas o UUID como string
      const newGroupId = response.data;

      console.log("✅ Grupo criado com ID:", newGroupId);
      alert("Grupo criado com sucesso!");
      navigate(`/group/${newGroupId}`);
    } catch (error: any) {
      console.error("❌ Erro ao criar grupo:", error);
      const errorMessage = error.response?.data?.message || error.response?.data || "Erro ao criar o grupo.";
      alert(`Erro: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
    }
  };

  const handleParticipantsChange = (value: string) => {
    const [min, max] = value.split("-").map(Number);
    setMaxMembers(max);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Logo da plataforma Hub do Saber"
              className="w-20 h-20 rounded-lg object-cover"
            />
            <span className="font-semibold text-lg">Hub do Saber</span>
          </div>
          
          <nav className="flex items-center gap-6">
            <Link to="/dashboard" className="text-muted-foreground hover:text-primary">Grupos</Link>
            <Link to="/profile" className="text-muted-foreground hover:text-primary">Perfil</Link>
            <Button 
              onClick={() => navigate("/dashboard")}
              variant="outline"
            >
              Cancelar
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Crie seu grupo de estudos...</h1>
        </div>

        <Card className="bg-card/50 border-2">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="groupName" className="text-sm font-medium text-blue-600">
                      Nome do Grupo *
                    </Label>
                    <Input
                      id="groupName"
                      placeholder="Ex: Grupo de Cálculo"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      className="mt-2"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-sm font-medium text-blue-600">
                      Descrição *
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Fale sobre o grupo..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="mt-2 min-h-[100px]"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject" className="text-sm font-medium text-blue-600">
                      Matéria *
                    </Label>
                    {loadingDisciplines ? (
                      <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Carregando disciplinas...
                      </div>
                    ) : (
                      <Select value={disciplineId} onValueChange={setDisciplineId} required>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Selecione a matéria" />
                        </SelectTrigger>
                        <SelectContent>
                          {disciplines.map((discipline) => (
                            <SelectItem key={discipline.id} value={discipline.id}>
                              {discipline.name} ({discipline.code}) - {discipline.semester}º período
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium">Número Máximo de Participantes *</Label>
                    <RadioGroup 
                      defaultValue="5-10" 
                      onValueChange={handleParticipantsChange} 
                      className="mt-3 space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="5-10" id="5-10" />
                        <Label htmlFor="5-10" className="text-sm">5-10</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="10-15" id="10-15" />
                        <Label htmlFor="10-15" className="text-sm">10-15</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="15-20" id="15-20" />
                        <Label htmlFor="15-20" className="text-sm">15-20</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Monitoria</Label>
                    <RadioGroup 
                      defaultValue="yes" 
                      onValueChange={(value) => setHasMonitoring(value === "yes")} 
                      className="mt-3 space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="yes" />
                        <Label htmlFor="yes" className="text-sm">Sim</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="no" />
                        <Label htmlFor="no" className="text-sm">Não</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Foto de Capa (opcional)</Label>
                    <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="cover-upload"
                      />
                      <Label htmlFor="cover-upload" className="cursor-pointer">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {coverImage ? coverImage.name : "Selecione uma imagem..."}
                        </span>
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white py-3 text-lg font-medium"
                  disabled={submitting || loadingDisciplines}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando grupo...
                    </>
                  ) : (
                    "Criar Grupo"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CreateGroup;