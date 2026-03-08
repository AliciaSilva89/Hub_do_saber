import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Send,
  Search,
  Loader2,
  Smile,
  Image,
  Paperclip,
  Download,
  X,
} from "lucide-react";
import axios from "axios";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import LogoLink from "@/components/LogoLink";

interface GroupSummary {
  id: string;
  name: string;
  disciplineName: string;
  lastMessage?: string;
  lastMessageTime?: string;
}

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

interface UserData {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
}

const ChatsPage = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<GroupSummary[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedGroupName, setSelectedGroupName] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [search, setSearch] = useState("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".emoji-area")) setShowEmojiPicker(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!selectedGroupId) return;
    const interval = setInterval(() => loadMessages(selectedGroupId), 3000);
    return () => clearInterval(interval);
  }, [selectedGroupId]);

  useEffect(() => {
    loadUserAndGroups();
  }, []);

  const loadUserAndGroups = async () => {
    const token = localStorage.getItem("hubdosaber-token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoadingGroups(true);

      const userRes = await axios.get("http://localhost:8080/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(userRes.data);

      // ✅ endpoint correto
      const groupsRes = await axios.get(
        "http://localhost:8080/api/group?mygroup=true",
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setGroups(
        (groupsRes.data || []).map((g: any) => ({
          id: g.id,
          name: g.name,
          disciplineName: g.disciplineName || "",
          lastMessage: "",
          lastMessageTime: "",
        })),
      );
    } catch (error) {
      console.error("❌ Erro ao carregar grupos:", error);
    } finally {
      setLoadingGroups(false);
    }
  };

  const loadMessages = async (groupId: string) => {
    const token = localStorage.getItem("hubdosaber-token");
    if (!token) return;
    try {
      const res = await axios.get(
        `http://localhost:8080/api/groups/${groupId}/messages`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setMessages(res.data);

      if (res.data.length > 0) {
        const last = res.data[res.data.length - 1];
        setGroups((prev) =>
          prev.map((g) =>
            g.id === groupId
              ? {
                  ...g,
                  lastMessage: last.content || "📎 Arquivo",
                  lastMessageTime: new Date(last.createdAt).toLocaleTimeString(
                    "pt-BR",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  ),
                }
              : g,
          ),
        );
      }
    } catch (error) {
      console.error("❌ Erro ao carregar mensagens:", error);
    }
  };

  const handleSelectGroup = async (groupId: string, groupName: string) => {
    setSelectedGroupId(groupId);
    setSelectedGroupName(groupName);
    setMessages([]);
    setLoadingMessages(true);
    await loadMessages(groupId);
    setLoadingMessages(false);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedGroupId || sending) return;
    const token = localStorage.getItem("hubdosaber-token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setSending(true);
      const res = await axios.post(
        `http://localhost:8080/api/groups/${selectedGroupId}/messages`,
        { content: newMessage, imageUrl: null },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
    } catch (error) {
      console.error("❌ Erro ao enviar mensagem:", error);
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

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setNewMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedGroupId || sending) return;
    const token = localStorage.getItem("hubdosaber-token");
    if (!token) return;

    setSending(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const res = await axios.post(
          `http://localhost:8080/api/groups/${selectedGroupId}/messages`,
          { content: "", imageUrl: reader.result as string },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setMessages((prev) => [...prev, res.data]);
      } catch {
        alert("Erro ao enviar imagem.");
      } finally {
        setSending(false);
        if (imageInputRef.current) imageInputRef.current.value = "";
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedGroupId || sending) return;
    const token = localStorage.getItem("hubdosaber-token");
    if (!token) return;

    const fileName = file.name;
    setSending(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const res = await axios.post(
          `http://localhost:8080/api/groups/${selectedGroupId}/messages`,
          {
            content: "",
            imageUrl: `file:${fileName}:${reader.result as string}`,
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setMessages((prev) => [...prev, res.data]);
      } catch {
        alert("Erro ao enviar arquivo.");
      } finally {
        setSending(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = (base64Data: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = base64Data;
    link.download = fileName;
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

  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <LogoLink size="lg" />
          <nav className="flex items-center gap-6">
            <Link
              to="/dashboard"
              className="text-muted-foreground hover:text-primary"
            >
              Grupos
            </Link>
            <Link to="/chats" className="text-primary font-medium">
              Chats
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

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar de grupos */}
        <div className="w-80 border-r bg-card flex flex-col flex-shrink-0">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold mb-3">Conversas</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar grupo..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loadingGroups ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : filteredGroups.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                <p className="text-sm">Nenhum grupo encontrado.</p>
                <Link
                  to="/dashboard"
                  className="text-primary text-sm hover:underline mt-2 block"
                >
                  Entrar em um grupo →
                </Link>
              </div>
            ) : (
              filteredGroups.map((group) => (
                <button
                  key={group.id}
                  onClick={() => handleSelectGroup(group.id, group.name)}
                  className={`w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors text-left border-b border-border/50 ${
                    selectedGroupId === group.id ? "bg-muted" : ""
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {group.name[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm truncate">
                        {group.name}
                      </p>
                      {group.lastMessageTime && (
                        <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                          {group.lastMessageTime}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {group.lastMessage || group.disciplineName}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Área de chat */}
        <div className="flex-1 flex flex-col">
          {!selectedGroupId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-2">
                Selecione uma conversa
              </h3>
              <p className="text-sm max-w-xs">
                Escolha um grupo na lista ao lado para começar a conversar.
              </p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="border-b p-4 bg-card flex items-center justify-between flex-shrink-0">
                <LogoLink size="lg" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/group/${selectedGroupId}/chat`)}
                >
                  Abrir chat completo →
                </Button>
              </div>

              {/* Mensagens */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                    <p className="text-sm">
                      Nenhuma mensagem ainda. Seja o primeiro!
                    </p>
                  </div>
                ) : (
                  <>
                    {messages.map((message, index) => {
                      const isOwn = userData && message.userId === userData.id;
                      const showDate =
                        index === 0 ||
                        formatDate(messages[index - 1].createdAt) !==
                          formatDate(message.createdAt);
                      const isFileMessage =
                        message.imageUrl?.startsWith("file:");

                      return (
                        <div key={message.id}>
                          {showDate && (
                            <div className="text-center my-3">
                              <span className="text-xs text-muted-foreground px-3 py-1 bg-muted rounded-full">
                                {formatDate(message.createdAt)}
                              </span>
                            </div>
                          )}

                          <div
                            className={`flex gap-2 ${isOwn ? "justify-end" : "justify-start"}`}
                          >
                            {!isOwn && (
                              <Avatar className="h-8 w-8 flex-shrink-0">
                                <AvatarImage
                                  src={message.profilePicture || undefined}
                                />
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                                  {message.userAvatar}
                                </AvatarFallback>
                              </Avatar>
                            )}

                            <div
                              className={`flex flex-col max-w-[65%] ${isOwn ? "items-end" : "items-start"}`}
                            >
                              {!isOwn && (
                                <span className="text-xs text-muted-foreground mb-1 ml-1">
                                  {message.userName}
                                </span>
                              )}

                              {/* Texto */}
                              {message.content && (
                                <div
                                  className={`px-3 py-2 rounded-2xl text-sm break-words ${
                                    isOwn
                                      ? "bg-blue-600 text-white rounded-br-sm"
                                      : "bg-muted text-foreground rounded-bl-sm"
                                  }`}
                                >
                                  {message.content}
                                </div>
                              )}

                              {/* Arquivo */}
                              {message.imageUrl &&
                                isFileMessage &&
                                (() => {
                                  const parts = message.imageUrl!.split(":");
                                  const fileName = parts[1];
                                  const base64Data = parts.slice(2).join(":");
                                  const ext = fileName
                                    .split(".")
                                    .pop()
                                    ?.toLowerCase();
                                  const icon =
                                    ext === "pdf"
                                      ? "📄"
                                      : ext === "doc" || ext === "docx"
                                        ? "📝"
                                        : ext === "zip" || ext === "rar"
                                          ? "🗜️"
                                          : ext === "xls" || ext === "xlsx"
                                            ? "📊"
                                            : "📎";
                                  return (
                                    <div
                                      className={`flex items-center gap-2 p-2 rounded-xl border text-sm ${
                                        isOwn
                                          ? "bg-blue-700 border-blue-500 text-white"
                                          : "bg-muted border-border"
                                      }`}
                                    >
                                      <span>{icon}</span>
                                      <span className="truncate max-w-[140px]">
                                        {fileName}
                                      </span>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-6 w-6"
                                        onClick={() =>
                                          handleDownload(base64Data, fileName)
                                        }
                                      >
                                        <Download className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  );
                                })()}

                              {/* Imagem */}
                              {message.imageUrl && !isFileMessage && (
                                <img
                                  src={message.imageUrl}
                                  alt="imagem"
                                  className="max-w-[200px] rounded-xl cursor-pointer"
                                  onClick={() =>
                                    setSelectedImage(message.imageUrl!)
                                  }
                                />
                              )}

                              <span className="text-xs text-muted-foreground mt-1">
                                {formatTime(message.createdAt)}
                              </span>
                            </div>

                            {isOwn && (
                              <Avatar className="h-8 w-8 flex-shrink-0">
                                <AvatarImage
                                  src={userData?.profilePicture || undefined}
                                />
                                <AvatarFallback className="bg-blue-600 text-white text-xs">
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

              {/* Input */}
              <div className="border-t p-3 bg-card flex-shrink-0">
                <input
                  type="file"
                  ref={imageInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.rar,.txt,.ppt,.pptx"
                  className="hidden"
                />

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={sending}
                    title="Imagem"
                  >
                    <Image className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={sending}
                    title="Arquivo"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>

                  <div className="relative emoji-area">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowEmojiPicker((p) => !p)}
                      disabled={sending}
                    >
                      <Smile className="h-4 w-4" />
                    </Button>
                    {showEmojiPicker && (
                      <div className="absolute bottom-10 left-0 z-50">
                        <EmojiPicker
                          onEmojiClick={handleEmojiClick}
                          lazyLoadEmojis
                          searchPlaceholder="Buscar emoji..."
                        />
                      </div>
                    )}
                  </div>

                  <Input
                    placeholder="Digite uma mensagem..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={sending}
                    className="flex-1 rounded-full"
                  />
                  <Button
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || sending}
                    className="rounded-full bg-blue-600 hover:bg-blue-700"
                  >
                    {sending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal preview imagem */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative">
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

export default ChatsPage;
