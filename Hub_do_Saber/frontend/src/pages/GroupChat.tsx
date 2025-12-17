import { useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Send, Settings, UserPlus, UserMinus, Lock, Image, Download, X } from "lucide-react";

interface Message {
  id: number;
  user: string;
  role?: string;
  message?: string;
  image?: string;
  time: string;
  avatar: string;
}

const GroupChat = () => {
  const { id } = useParams();
  const [newMessage, setNewMessage] = useState("");
  const [selectedMember, setSelectedMember] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      user: "Oi gente 😁",
      message: "Vamos começar?",
      time: "19:30",
      avatar: "👨"
    },
    {
      id: 2,
      user: "Jay",
      role: "Engineering",
      message: "Estava pensando: Vamos fazer pelo meet hoje?",
      time: "19:31",
      avatar: "👨‍💼"
    },
    {
      id: 3,
      user: "Audrey",
      role: "Product",
      message: "Alguém consegue me ajudar com essa questão?",
      time: "19:32",
      avatar: "👩"
    },
    {
      id: 4,
      user: "Audrey",
      role: "Product", 
      message: "Filosofia da Perdão na modernidade!",
      time: "19:33",
      avatar: "👩"
    },
    {
      id: 5,
      user: "Clara",
      message: "Vou fazer um resumo para o grupo! https://meet.google.com/abc-wxyz-tuv",
      time: "19:34",
      avatar: "👩‍🦰"
    },
    {
      id: 6,
      user: "Janet",
      role: "Engineering",
      message: "Mundo doação pergunta para a gente te ajudar",
      time: "19:35",
      avatar: "👩‍💻"
    },
    {
      id: 7,
      user: "Janet",
      role: "Product",
      message: "Obrigada gente!",
      time: "19:36",
      avatar: "👩‍💻"
    }
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const groupInfo = {
    name: "Grupo de Estudos - Filosofia",
    avatar: "📚",
    members: 4
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg: Message = {
        id: messages.length + 1,
        user: "Você",
        message: newMessage,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        avatar: "👤"
      };
      setMessages([...messages, newMsg]);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newMsg: Message = {
          id: messages.length + 1,
          user: "Você",
          image: reader.result as string,
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          avatar: "👤"
        };
        setMessages([...messages, newMsg]);
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownloadImage = (imageUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `imagem-${index}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Sidebar - Group Settings (Hidden by default) */}
        {showSettings && (
          <div className="w-80 border-r bg-card p-6 space-y-6 overflow-y-auto">
            {/* Group Info */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-100 via-purple-50 to-orange-50 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">{groupInfo.avatar}</span>
                </div>
                <div>
                  <h2 className="font-semibold">{groupInfo.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    filosofiaestudos@gmail.com
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowSettings(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configurações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Fechar</Label>
                  <p className="text-xs text-muted-foreground mt-1">Alexa Rawles</p>
                </div>

                <div>
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Adicionar Membro
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">Marcus Mendez</p>
                </div>

                <div>
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <UserMinus className="h-4 w-4" />
                    Remover Membro
                  </Label>
                  <Select value={selectedMember} onValueChange={setSelectedMember}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member1">Membro 1</SelectItem>
                      <SelectItem value="member2">Membro 2</SelectItem>
                      <SelectItem value="member3">Membro 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="private-group"
                    checked={isPrivate}
                    onCheckedChange={setIsPrivate}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="private-group" className="text-sm font-medium flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Privar Grupo
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Seu grupo não aparecerá para público, apenas para membros atuais
                    </p>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full">
                  Editar
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Right Side - Chat */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="border-b p-4 bg-blue-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <Avatar className="w-8 h-8 border-2 border-white">
                    <AvatarFallback className="text-xs">👨</AvatarFallback>
                  </Avatar>
                  <Avatar className="w-8 h-8 border-2 border-white">
                    <AvatarFallback className="text-xs">👩</AvatarFallback>
                  </Avatar>
                  <Avatar className="w-8 h-8 border-2 border-white">
                    <AvatarFallback className="text-xs">👨‍💼</AvatarFallback>
                  </Avatar>
                  <Avatar className="w-8 h-8 border-2 border-white">
                    <AvatarFallback className="text-xs">👩‍🦰</AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <h3 className="font-semibold">{groupInfo.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    4 membros • 3 semanas atrás
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowSettings(!showSettings)}
                className={showSettings ? "bg-accent" : ""}
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            <div className="text-center text-xs text-muted-foreground">
              03/09/2020
            </div>

            {messages.map((message) => {
              const isOwnMessage = message.user === "Você";
              return (
                <div key={message.id} className={`flex items-start gap-3 ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs">{message.avatar}</AvatarFallback>
                  </Avatar>
                  <div className={`flex-1 ${isOwnMessage ? 'text-right' : ''}`}>
                    <div className={`flex items-center gap-2 mb-1 ${isOwnMessage ? 'justify-end' : ''}`}>
                      <span className="font-medium text-sm">{message.user}</span>
                      {message.role && (
                        <span className="text-xs text-muted-foreground">{message.role}</span>
                      )}
                      <span className="text-xs text-muted-foreground">{message.time}</span>
                    </div>
                    {message.message && (
                      <p className={`text-sm inline-block px-3 py-2 rounded-lg ${isOwnMessage ? 'bg-blue-600 text-white' : 'bg-muted'}`}>
                        {message.message}
                      </p>
                    )}
                    {message.image && (
                      <div className={`relative group mt-2 max-w-xs ${isOwnMessage ? 'ml-auto' : ''}`}>
                        <img 
                          src={message.image} 
                          alt="Imagem enviada" 
                          className="rounded-lg max-w-full h-auto cursor-pointer"
                          onClick={() => setSelectedImage(message.image!)}
                        />
                        <Button
                          variant="secondary"
                          size="icon"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleDownloadImage(message.image!, message.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message Input */}
          <div className="border-t p-4">
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
              >
                <Image className="h-5 w-5" />
              </Button>
              <Input
                placeholder="Digite sua mensagem..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage}
                size="icon"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img 
              src={selectedImage} 
              alt="Preview" 
              className="max-w-full max-h-[90vh] object-contain"
            />
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-4 right-4"
              onClick={(e) => {
                e.stopPropagation();
                handleDownloadImage(selectedImage, Date.now());
              }}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-4 left-4"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupChat;