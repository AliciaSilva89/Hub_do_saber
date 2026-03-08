import { useState, useRef, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Send,
  Settings,
  Image,
  Download,
  X,
  Loader2,
  ArrowLeft,
  Smile,
} from "lucide-react";
import { fetchGroupDetail } from "@/services/groupService";
import axios from "axios";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

interface Message {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content?: string;
  imageUrl?: string;
  createdAt: string;
  profilePicture?: string;
}

interface GroupInfo {
  name: string;
  avatar: string;
  members: number;
  disciplineName: string;
  currentMembers: number;
  maxMembers: number;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
}

const GroupChat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [groupInfo, setGroupInfo] = useState<GroupInfo>({
    name: "Carregando...",
    avatar: "📚",
    members: 0,
    disciplineName: "",
    currentMembers: 0,
    maxMembers: 0,
  });
  const [userData, setUserData] = useState<UserData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    loadInitialData();
    const interval = setInterval(() => {
      if (id) loadMessages();
    }, 3000);
    return () => clearInterval(interval);
  }, [id]);

  // ✅ Fecha o picker ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".emoji-area")) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadInitialData = async () => {
    const token = localStorage.getItem("hubdosaber-token");
    if (!token) {
      navigate("/login");
      return;
    }
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const userResponse = await axios.get(
        "http://localhost:8080/api/users/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setUserData(userResponse.data);

      const groupData = await fetchGroupDetail(id);
      setGroupInfo({
        name: groupData.name,
        avatar: "📚",
        members: groupData.currentMembers || 0,
        disciplineName: groupData.disciplineName,
        currentMembers: groupData.currentMembers || 0,
        maxMembers: groupData.maxMembers || 10,
      });

      await loadMessages();
    } catch (error) {
      console.error("❌ Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    const token = localStorage.getItem("hubdosaber-token");
    if (!token || !id) return;
    try {
      const response = await axios.get(
        `http://localhost:8080/api/groups/${id}/messages`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setMessages(response.data);
    } catch (error) {
      console.error("❌ Erro ao carregar mensagens:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !id || sending) return;
    const token = localStorage.getItem("hubdosaber-token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setSending(true);
      const response = await axios.post(
        `http://localhost:8080/api/groups/${id}/messages`,
        { content: newMessage, imageUrl: null },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setMessages([...messages, response.data]);
      setNewMessage("");
    } catch (error) {
      console.error("❌ Erro ao enviar mensagem:", error);
      alert("Erro ao enviar mensagem. Tente novamente.");
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ✅ Insere emoji no input
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setNewMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !id || sending) return;
    const token = localStorage.getItem("hubdosaber-token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setSending(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const response = await axios.post(
            `http://localhost:8080/api/groups/${id}/messages`,
            { content: "", imageUrl: reader.result as string },
            { headers: { Authorization: `Bearer ${token}` } },
          );
          setMessages([...messages, response.data]);
        } catch (error) {
          console.error("❌ Erro ao enviar imagem:", error);
          alert("Erro ao enviar imagem. Tente novamente.");
        } finally {
          setSending(false);
        }
      };
      reader.readAsDataURL(file);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("❌ Erro ao processar imagem:", error);
      setSending(false);
    }
  };

  const handleDownloadImage = (imageUrl: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `${fileName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("pt-BR");

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-lg">Carregando chat...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
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
          <nav className="flex items-center gap-6">
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
          </nav>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden max-w-7xl mx-auto w-full">
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="border-b p-4 flex items-center justify-between bg-card">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/group/${id}`)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <Avatar className="h-8 w-8 border-2 border-background">
                    <AvatarFallback>👨‍💼</AvatarFallback>
                  </Avatar>
                  <Avatar className="h-8 w-8 border-2 border-background">
                    <AvatarFallback>👩‍🦰</AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <h2 className="font-semibold">{groupInfo.name}</h2>
                  <p className="text-xs text-muted-foreground">
                    {groupInfo.currentMembers}{" "}
                    {groupInfo.currentMembers === 1 ? "membro" : "membros"}
                  </p>
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/group/${id}`)}
              title="Ver detalhes do grupo"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-xl font-semibold mb-2">
                  Nenhuma mensagem ainda
                </h3>
                <p className="text-muted-foreground max-w-md">
                  Seja o primeiro a enviar uma mensagem para o grupo!
                </p>
              </div>
            ) : (
              <>
                {messages.map((message, index) => {
                  const isOwnMessage =
                    userData && message.userId === userData.id;
                  const showDate =
                    index === 0 ||
                    formatDate(messages[index - 1].createdAt) !==
                      formatDate(message.createdAt);

                  return (
                    <div key={message.id}>
                      {showDate && (
                        <div className="text-center my-4">
                          <span className="text-xs text-muted-foreground px-3 py-1 bg-muted rounded-full">
                            {formatDate(message.createdAt)}
                          </span>
                        </div>
                      )}

                      <div
                        className={`flex gap-3 ${isOwnMessage ? "justify-end" : "justify-start"}`}
                      >
                        {!isOwnMessage && (
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={message.profilePicture || undefined}
                              alt={message.userName}
                            />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                              {message.userAvatar}
                            </AvatarFallback>
                          </Avatar>
                        )}

                        <div
                          className={`flex flex-col max-w-[70%] ${isOwnMessage ? "items-end" : "items-start"}`}
                        >
                          <div
                            className={`flex items-center gap-2 mb-1 ${isOwnMessage ? "flex-row-reverse" : ""}`}
                          >
                            <span className="font-medium text-sm">
                              {message.userName}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatTime(message.createdAt)}
                            </span>
                          </div>

                          {message.content && (
                            <div
                              className={`inline-block p-3 rounded-lg break-words ${
                                isOwnMessage
                                  ? "bg-blue-600 text-white rounded-br-none"
                                  : "bg-muted text-foreground rounded-bl-none"
                              }`}
                            >
                              {message.content}
                            </div>
                          )}

                          {message.imageUrl && (
                            <div className="relative group">
                              <img
                                src={message.imageUrl}
                                alt="Uploaded content"
                                className="max-w-sm rounded-lg cursor-pointer"
                                onClick={() =>
                                  setSelectedImage(message.imageUrl!)
                                }
                              />
                              <Button
                                size="icon"
                                variant="secondary"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() =>
                                  handleDownloadImage(
                                    message.imageUrl!,
                                    `imagem-${message.id}`,
                                  )
                                }
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>

                        {isOwnMessage && (
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={userData?.profilePicture || undefined}
                              alt={userData?.name}
                            />
                            <AvatarFallback className="bg-blue-600 text-white">
                              {message.userAvatar}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Message Input */}
          <div className="border-t p-4 bg-card">
            <div className="flex gap-2 max-w-4xl mx-auto">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />

              {/* Botão de imagem */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={sending}
              >
                <Image className="h-5 w-5" />
              </Button>

              {/* ✅ Botão de emoji */}
              <div className="relative emoji-area">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowEmojiPicker((prev) => !prev)}
                  disabled={sending}
                >
                  <Smile className="h-5 w-5" />
                </Button>

                {showEmojiPicker && (
                  <div className="absolute bottom-12 left-0 z-50">
                    <EmojiPicker
                      onEmojiClick={handleEmojiClick}
                      searchPlaceholder="Buscar emoji..."
                      lazyLoadEmojis
                    />
                  </div>
                )}
              </div>

              <Input
                placeholder="Digite sua mensagem..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={sending}
                className="flex-1"
              />

              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || sending}
              >
                {sending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-2 right-2"
              onClick={(e) => {
                e.stopPropagation();
                handleDownloadImage(selectedImage, `imagem-${Date.now()}`);
              }}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-2 left-2"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-4 w-4" />
            </Button>
            <img
              src={selectedImage}
              alt="Preview"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupChat;
