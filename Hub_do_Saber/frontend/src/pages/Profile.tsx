import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

  const myGroups = [
    { id: 1, title: "Grupo de Estudos - Filosofia", image: "📚" },
    { id: 2, title: "Grupo de Estudos - Matemática", image: "📚" },
    { id: 3, title: "Grupo de Estudos - História", image: "📚" }
  ];

  const handleSave = () => {
    // Here you would typically save the data to your backend
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
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
      <main className="max-w-4xl mx-auto px-6 py-8">
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

        {/* Profile Form */}
        <Card className="mb-8">
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
      </main>
    </div>
  );
};

export default Profile;