import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Upload } from "lucide-react";
import axios from "axios";

const CreateGroup = () => {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState(""); // Este estado agora guardará o UUID da disciplina
  const [participants, setParticipants] = useState("5-10");
  const [hasMonitoring, setHasMonitoring] = useState("yes");
  const [coverImage, setCoverImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tokenLocal = localStorage.getItem("hubdosaber-token");
    if (!tokenLocal) return navigate("/login");

    try {
      const tokenFormatado = `Bearer ${tokenLocal}`;
      
      const payload = {
        groupName,
        description,
        participants,
        hasMonitoring,
        disciplineId: subject 
      };

      const response = await axios.post("http://localhost:3000/bff/group", payload, {
        headers: { Authorization: tokenFormatado }
      });

      // O Java retorna o UUID. Aqui garantimos que pegamos o valor correto.
      const newGroupId = typeof response.data === 'object' ? response.data.id : response.data;

      if (newGroupId) {
        alert("Grupo criado com sucesso!");
        // ✅ USANDO CRASES para a URL funcionar com a variável
        navigate(`/group/${newGroupId}`); 
      } else {
        throw new Error("ID não recebido");
      }
    } catch (error: any) {
      console.error("Erro ao criar:", error.response?.data || error.message);
      alert("Erro ao criar o grupo. Verifique se a matéria foi selecionada.");
    }
};
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
    }
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
            <Link to="/saiba" className="text-muted-foreground hover:text-primary">Saiba</Link>
            <Button className="bg-black hover:bg-black/90 text-white">Criar Grupo</Button>
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
                    <Label htmlFor="groupName" className="text-sm font-medium text-blue-600">Nome do Grupo</Label>
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
                    <Label htmlFor="description" className="text-sm font-medium text-blue-600">Descrição</Label>
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
                    <Label htmlFor="subject" className="text-sm font-medium text-blue-600">Matéria</Label>
                    <Select value={subject} onValueChange={setSubject} required>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Selecione a matéria" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* UUIDs REAIS do seu banco de dados */}
                        <SelectItem value="d1e2f3a4-b5c6-7890-1234-567890abcdef">Programação para Internet</SelectItem>
                        <SelectItem value="e2f3a4b5-c6d7-8901-2345-67890abcdef1">Estrutura de Dados 1</SelectItem>
                        <SelectItem value="a4b5c6d7-e8f9-0123-4567-890abcdef123">Cálculo 1</SelectItem>
                        <SelectItem value="e8f9a0b1-c2d3-4567-8901-bcdef1234567">Banco de Dados 1</SelectItem>
                        <SelectItem value="c6d7e8f9-a0b1-2345-6789-0abcdef12345">Projetos de Software 1</SelectItem>
                        <SelectItem value="d7e8f9a0-b1c2-3456-7890-abcdef123456">Projetos de Software 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium">Número de Participantes</Label>
                    <RadioGroup value={participants} onValueChange={setParticipants} className="mt-3 space-y-2">
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
                    <RadioGroup value={hasMonitoring} onValueChange={setHasMonitoring} className="mt-3 space-y-2">
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
                    <Label className="text-sm font-medium">Foto de Capa</Label>
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
                          {coverImage ? coverImage.name : "Selecione..."}
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
                >
                  Criar Grupo
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