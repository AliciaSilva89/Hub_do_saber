import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, User } from "lucide-react";
import axios from "axios"; 

const Login = () => {
    const navigate = useNavigate(); 
    const [showPassword, setShowPassword] = useState(false);
    // Mudamos o nome da variável para 'email'
    const [email, setEmail] = useState(""); 
    const [senha, setSenha] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); 
        
        // Verificação agora usa a variável 'email'
        if (!email || !senha) {
            setError("Por favor, preencha todos os campos.");
            return;
        }
        
        setLoading(true); 

        try {
            const apiUrl = "http://localhost:8080/auth/login"; 
            
            const response = await axios.post(apiUrl, {
                // O nome do campo agora é 'email', correspondendo ao back-end
                email: email,
                password: senha
            });

            if (response.status === 200) {
                const token = response.data.access_token; // Acessar o campo `access_token`
                localStorage.setItem("hubdosaber-token", token);
                console.log("Login bem-sucedido!");
                navigate("/dashboard");
            }
        } catch (err) {
            console.error("Erro no login:", err);
            if (axios.isAxiosError(err) && err.response && err.response.status === 401) {
                setError("Email ou senha inválidos.");
            } else {
                setError("Ocorreu um erro. Tente novamente.");
            }
        } finally {
            setLoading(false); 
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-card border-2 border-primary/20 rounded-lg p-8 shadow-lg">
                <div className="flex justify-center mb-6">
                    <img src="/logohubdosaber.png" className="w-20 h-20 rounded-lg object-cover" />
                </div>
                <h1 className="text-2xl font-bold text-center mb-8 text-foreground">
                    Hub do Saber
                </h1>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleLogin} className="space-y-6">
                    {/* O campo agora é de email */}
                    <div className="relative">
                        <Label htmlFor="email" className="sr-only">E-mail</Label>
                        <div className="relative">
                            <Input
                                id="email"
                                type="email" // Mudei o tipo para 'email' para validação nativa
                                placeholder="E-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pr-10"
                                required
                            />
                            {/* O ícone de usuário pode ser mantido ou trocado por um de e-mail */}
                            <User className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        </div>
                    </div>
                    <div className="relative">
                        <Label htmlFor="senha" className="sr-only">Senha</Label>
                        <div className="relative">
                            <Input
                                id="senha"
                                type={showPassword ? "text" : "password"}
                                placeholder="Senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                className="pr-10"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                    <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-full" disabled={loading}>
                        {loading ? "ENTRANDO..." : "LOGIN"}
                    </Button>
                    <p className="text-center text-sm text-muted-foreground">
                        Não possui cadastro?{" "}
                        <Link to="/cadastro" className="text-purple-600 hover:text-purple-700 font-medium">
                            Cadastre-se
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;