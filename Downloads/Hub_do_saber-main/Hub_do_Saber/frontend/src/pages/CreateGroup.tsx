import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Search } from "lucide-react";
import axiosInstance from "@/services/axiosConfig";
import { getUserProfile } from "@/services/userService";
import LogoLink from "@/components/LogoLink";

interface Discipline {
  id: string;
  name: string;
  code?: string;
  semester?: number;
}

const CreateGroup = () => {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [disciplineId, setDisciplineId] = useState("");
  const [maxMembers, setMaxMembers] = useState(10);
  const [hasMonitoring, setHasMonitoring] = useState(true);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [loadingDisciplines, setLoadingDisciplines] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userCourseName, setUserCourseName] = useState("");

  // ✅ Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSemester, setSelectedSemester] = useState<string>("all");

  useEffect(() => {
    const fetchDisciplines = async () => {
      try {
        const profile = await getUserProfile();
        const courseId = profile.course?.id;
        const courseName = profile.course?.name || "";
        setUserCourseName(courseName);

        if (!courseId) {
          alert("Seu perfil não possui um curso vinculado. Contate o suporte.");
          setLoadingDisciplines(false);
          return;
        }

        const response = await axiosInstance.get(
          `/discipline/course/${courseId}`,
        );
        setDisciplines(response.data);
      } catch (error) {
        console.error("❌ Erro ao carregar disciplinas:", error);
        try {
          const fallback = await axiosInstance.get("/discipline/all");
          setDisciplines(fallback.data);
        } catch {
          alert("Erro ao carregar disciplinas. Tente recarregar a página.");
        }
      } finally {
        setLoadingDisciplines(false);
      }
    };

    fetchDisciplines();
  }, []);

  // ✅ Extrai períodos disponíveis nas disciplinas
  const availableSemesters = Array.from(
    new Set(
      disciplines
        .map((d) => d.semester)
        .filter((s): s is number => s !== undefined && s !== null),
    ),
  ).sort((a, b) => a - b);

  // ✅ Filtra disciplinas por busca e período
  const filteredDisciplines = disciplines.filter((d) => {
    const matchesSearch = d.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSemester =
      selectedSemester === "all" || String(d.semester) === selectedSemester;
    return matchesSearch && matchesSemester;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!disciplineId) {
      alert("Por favor, selecione uma matéria.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        name: groupName,
        description,
        disciplineId,
        maxMembers,
        monitoring: hasMonitoring,
      };

      const response = await axiosInstance.post("/group", payload);
      const newGroupId = response.data;
      alert("Grupo criado com sucesso!");
      navigate(`/group/${newGroupId}`);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        "Erro ao criar o grupo.";
      alert(`Erro: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleParticipantsChange = (value: string) => {
    const [, max] = value.split("-").map(Number);
    setMaxMembers(max);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <LogoLink size="lg" />
          <nav className="flex items-center gap-6">
            <Link
              to="/dashboard"
              className="text-muted-foreground hover:text-primary"
            >
              Grupos
            </Link>
            <Link
              to="/chats"
              className="text-muted-foreground hover:text-primary"
            >
              Chats
            </Link>
            <Link
              to="/profile"
              className="text-muted-foreground hover:text-primary"
            >
              Perfil
            </Link>
            <Button onClick={() => navigate("/dashboard")} variant="outline">
              Cancelar
            </Button>
          </nav>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Crie seu grupo de estudos...
          </h1>
          {userCourseName && (
            <p className="text-sm text-muted-foreground">
              Disciplinas do curso:{" "}
              <span className="font-medium text-primary">{userCourseName}</span>
            </p>
          )}
        </div>

        <Card className="bg-card/50 border-2">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Coluna Esquerda */}
                <div className="space-y-6">
                  <div>
                    <Label
                      htmlFor="groupName"
                      className="text-sm font-medium text-blue-600"
                    >
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
                    <Label
                      htmlFor="description"
                      className="text-sm font-medium text-blue-600"
                    >
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

                  {/* ✅ Seletor de Matéria com filtros */}
                  <div>
                    <Label className="text-sm font-medium text-blue-600">
                      Matéria *
                    </Label>

                    {loadingDisciplines ? (
                      <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Carregando disciplinas...
                      </div>
                    ) : (
                      <div className="mt-2 space-y-2">
                        {/* ✅ Filtro por período */}
                        {availableSemesters.length > 0 && (
                          <Select
                            value={selectedSemester}
                            onValueChange={(v) => {
                              setSelectedSemester(v);
                              setDisciplineId(""); // limpa seleção ao mudar período
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Filtrar por período" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">
                                Todos os períodos
                              </SelectItem>
                              {availableSemesters.map((s) => (
                                <SelectItem key={s} value={String(s)}>
                                  {s}º período
                                </SelectItem>
                              ))}
                              <SelectItem value="optativa">
                                Optativas
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        )}

                        {/* ✅ Busca por nome */}
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Buscar disciplina..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                          />
                        </div>

                        {/* ✅ Select de disciplinas filtradas */}
                        <Select
                          value={disciplineId}
                          onValueChange={setDisciplineId}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a matéria" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {filteredDisciplines.length === 0 ? (
                              <SelectItem value="none" disabled>
                                Nenhuma disciplina encontrada
                              </SelectItem>
                            ) : (
                              filteredDisciplines.map((discipline) => (
                                <SelectItem
                                  key={discipline.id}
                                  value={discipline.id}
                                >
                                  {discipline.name}
                                  {discipline.semester
                                    ? ` — ${discipline.semester}º período`
                                    : ""}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>

                        {/* ✅ Contagem de resultados */}
                        <p className="text-xs text-muted-foreground">
                          {filteredDisciplines.length} disciplina(s)
                          encontrada(s)
                          {searchTerm && ` para "${searchTerm}"`}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Coluna Direita */}
                <div className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium">
                      Número Máximo de Participantes *
                    </Label>
                    <RadioGroup
                      defaultValue="5-10"
                      onValueChange={handleParticipantsChange}
                      className="mt-3 space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="5-10" id="5-10" />
                        <Label htmlFor="5-10" className="text-sm">
                          5-10
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="10-15" id="10-15" />
                        <Label htmlFor="10-15" className="text-sm">
                          10-15
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="15-20" id="15-20" />
                        <Label htmlFor="15-20" className="text-sm">
                          15-20
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Monitoria</Label>
                    <RadioGroup
                      defaultValue="yes"
                      onValueChange={(value) =>
                        setHasMonitoring(value === "yes")
                      }
                      className="mt-3 space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="yes" />
                        <Label htmlFor="yes" className="text-sm">
                          Sim
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="no" />
                        <Label htmlFor="no" className="text-sm">
                          Não
                        </Label>
                      </div>
                    </RadioGroup>
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
