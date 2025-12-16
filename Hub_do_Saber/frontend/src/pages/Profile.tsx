import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";

const Profile = () => {
    const navigate = useNavigate();

    const [userData, setUserData] = useState({
        fullName: "",
        email: "",
        registration: "",
    });
    const [userGroups, setUserGroups] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = "http://localhost:8080/api/users/me";

    // Mantenha a função de busca separada para ser reutilizada
    const fetchUserProfile = async () => {
        const token = localStorage.getItem("hubdosaber-token");
        if (!token) {
            navigate("/login");
            return;
        }
        
        try {
            const response = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = response.data;
            setUserData({
                fullName: data.name,
                email: data.email,
                registration: data.matriculation,
            });

            // Buscar os grupos do usuário
            try {
                const groupsRes = await axios.get("http://localhost:8080/api/group?mygroup=true", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserGroups(groupsRes.data.map((g) => ({ id: g.id, title: g.name, image: '📚' })));
            } catch (err) {
                console.error('Erro ao buscar grupos do usuário:', err);
                setUserGroups([]);
            }

            setLoading(false);
        } catch (err) {
            console.error("Erro ao buscar dados do usuário:", err);
            setError("Erro ao carregar o perfil. Tente novamente mais tarde.");
            setLoading(false);
        }
    };

    // Efeito para carregar os dados do perfil quando o componente monta
    useEffect(() => {
        fetchUserProfile();
    }, [navigate, API_URL]);

    const handleSave = async () => {
        const token = localStorage.getItem("hubdosaber-token");
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const updatedData = {
                name: userData.fullName,
                matriculation: userData.registration,
                // O email não pode ser editado pelo front-end, então não o inclua na requisição PUT.
                // Se o backend permitir, a lógica de validação deve estar lá.
                // email: userData.email 
            };

            const response = await axios.put(API_URL, updatedData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                console.log("Perfil atualizado com sucesso!");
                setIsEditing(false);
                // Recarrega os dados para que a UI reflita as alterações
                await fetchUserProfile();
            }
        } catch (err) {
            console.error("Erro ao salvar o perfil:", err);
            setError("Erro ao salvar. Verifique os dados e tente novamente.");
        }
    };

    const handleInputChange = (field, value) => {
        setUserData(prev => ({ ...prev, [field]: value }));
    };

    if (loading) {
        return <div className="text-center mt-10">Carregando perfil...</div>;
    }

    if (error) {
        return <div className="text-center mt-10 text-red-500">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-background">
            {/* ... o restante do seu código (Header e Main Content) é o mesmo ... */}
            <header className="border-b bg-card px-6 py-4">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <div className="flex items-center gap-3">
                        <img src="/logohubdosaber.png" alt="Logo da plataforma Hub do Saber" className="w-16 h-16 rounded-lg object-cover" />
                        <span className="font-semibold text-lg">Hub do Saber</span>
                    </div>
                    <nav className="flex items-center gap-6">
                        <Link to="/dashboard" className="text-muted-foreground hover:text-primary">Grupos</Link>
                        <Link to="/profile" className="text-foreground hover:text-primary font-medium">Perfil</Link>
                        <Link to="/saiba" className="text-muted-foreground hover:text-primary">Saiba</Link>
                        <Link to="/create-group">
                            <Button className="bg-black hover:bg-black/90 text-white">Criar Grupo</Button>
                        </Link>
                        <Button variant="outline" onClick={() => {
                            localStorage.removeItem("hubdosaber-token");
                            navigate("/login");
                        }}>Sair</Button>
                    </nav>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <Avatar className="w-20 h-20">
                        <AvatarImage src="/placeholder-avatar.jpg" alt="Perfil" />
                        <AvatarFallback className="text-xl font-semibold">
                            {userData.fullName.charAt(0)}{userData.fullName.split(" ")[1]?.charAt(0) || ""}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-2xl font-bold">{userData.fullName}</h1>
                        <p className="text-muted-foreground">{userData.email}</p>
                    </div>
                </div>

                <Card className="mb-8">
                    <CardContent className="p-6">
                        <div className="flex justify-end mb-6">
                            {isEditing ? (
                                <div className="flex gap-2">
                                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                                        Cancelar
                                    </Button>
                                    <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
                                        Salvar
                                    </Button>
                                </div>
                            ) : (
                                <Button onClick={() => setIsEditing(true)} className="bg-purple-600 hover:bg-purple-700 text-white">
                                    Editar
                                </Button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="fullName" className="text-sm font-medium">Nome Completo</Label>
                                    <Input id="fullName" value={userData.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)} disabled={!isEditing} className="mt-1" />
                                </div>
                                <div>
                                    <Label htmlFor="registration" className="text-sm font-medium">Matrícula</Label>
                                    <Input id="registration" value={userData.registration} onChange={(e) => handleInputChange('registration', e.target.value)} disabled={!isEditing} className="mt-1" />
                                </div>
                                <div>
                                    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                                    <Input id="email" type="email" value={userData.email} disabled className="mt-1 bg-muted" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900 rounded-lg text-sm text-yellow-800 dark:text-yellow-200">
                                    <p className="font-semibold mb-1">Informações Adicionais:</p>
                                    <p>Os campos "Endereço", "Interesses" e "Biografia" ainda não estão disponíveis para edição. Eles serão adicionados em futuras atualizações.</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="pb-8">
                    <h2 className="text-2xl font-bold mb-6">Meus grupos</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {userGroups.length > 0 ? (
                            userGroups.map((group) => (
                                <Card key={group.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                                    <CardHeader className="pb-3">
                                        <div className="w-full h-32 bg-gradient-to-r from-blue-100 via-purple-50 to-orange-50 rounded-lg mb-3 flex items-center justify-center">
                                            <div className="text-4xl">{group.image}</div>
                                        </div>
                                        <CardTitle className="text-lg">{group.title}</CardTitle>
                                    </CardHeader>
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-full text-center text-muted-foreground p-8 border rounded-lg">
                                <p className="mb-2">Você ainda não faz parte de nenhum grupo.</p>
                                <p>Comece explorando os grupos disponíveis ou crie um novo!</p>
                                <Link to="/dashboard" className="text-purple-600 hover:underline mt-2 inline-block">Ver Grupos</Link>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;