import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Upload } from "lucide-react";

const CreateGroup = () => {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [participants, setParticipants] = useState("5-10");
  const [hasMonitoring, setHasMonitoring] = useState("yes");
  const [coverImage, setCoverImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log({
      groupName,
      description,
      subject,
      participants,
      hasMonitoring,
      coverImage
    });
    // Navigate back to dashboard after creation
    navigate('/dashboard');
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
            <Button className="bg-black hover:bg-black/90 text-white">
              Criar Grupo
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
                      Nome do Grupo
                    </Label>
                    <Input
                      id="groupName"
                      placeholder="Ex: Grupo de Português"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      className="mt-2"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-sm font-medium text-blue-600">
                      Descrição
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
                      Matéria
                    </Label>
                    <Select value={subject} onValueChange={setSubject} required>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Ex: Português" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="portugues">Português</SelectItem>
                        <SelectItem value="matematica">Matemática</SelectItem>
                        <SelectItem value="historia">História</SelectItem>
                        <SelectItem value="geografia">Geografia</SelectItem>
                        <SelectItem value="ingles">Inglês</SelectItem>
                        <SelectItem value="ciencias">Ciências</SelectItem>
                        <SelectItem value="quimica">Química</SelectItem>
                        <SelectItem value="fisica">Física</SelectItem>
                        <SelectItem value="filosofia">Filosofia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium">Número de Participantes</Label>
                    <RadioGroup 
                      value={participants} 
                      onValueChange={setParticipants}
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
                      value={hasMonitoring} 
                      onValueChange={setHasMonitoring}
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