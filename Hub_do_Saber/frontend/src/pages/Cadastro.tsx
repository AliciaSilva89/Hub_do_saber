// Adicione a importação do axios
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

// Seu componente Cadastro
const Cadastro = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    email: "",
    curso: "",
    matricula: "",
    senha: "",
    confirmarSenha: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCadastro = async (e) => {
    e.preventDefault();

    // Validação básica de senhas no front-end
    if (formData.senha !== formData.confirmarSenha) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    setError(""); // Limpa erros anteriores

    try {
      // O endpoint do seu back-end, use a URL correta do seu servidor
      const apiUrl = "http://localhost:8080/api/users"; 

      // Crie o objeto com os dados que o back-end espera
      const requestData = {
        name: formData.nomeCompleto.trim(),
        email: formData.email.trim(),
        password: formData.senha,
        matriculation: formData.matricula.trim(),
        courseName: formData.curso.trim() // ← ADICIONADO .trim() AQUI
      };

      // Realize a requisição POST para o back-end
      const response = await axios.post(apiUrl, requestData);

      // Verifique o status da resposta
      if (response.status === 201) { // 201 Created é o código de sucesso para criação
        console.log("Usuário cadastrado com sucesso!", response.data);
        // Redireciona para o dashboard após o sucesso
        navigate("/dashboard");
      }
    } catch (err) {
      // Trate os erros de forma mais específica
      if (axios.isAxiosError(err) && err.response) {
        // Exemplo: se o email já estiver em uso
        if (err.response.status === 409) { // Conflito
          setError("Este e-mail já está cadastrado.");
        } else if (err.response.status === 400) {
          // Exibe a mensagem de erro do backend
          setError(err.response.data.message || "Erro ao cadastrar. Verifique os dados.");
        } else {
          setError("Erro ao cadastrar. Tente novamente.");
        }
      } else {
        setError("Erro de rede. Verifique sua conexão.");
      }
      console.error("Erro no cadastro:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border-2 border-primary/20 rounded-lg p-8 shadow-lg">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/logo.png"
            className="w-20 h-20 rounded-lg object-cover"
          />
        </div>
        {/* Título */}
        <h1 className="text-2xl font-bold text-center mb-8 text-foreground">
          Hub do Saber
        </h1>
        {/* Formulário */}
        <form onSubmit={handleCadastro} className="space-y-4">
          {/* Nome Completo */}
          <div>
            <Label htmlFor="nomeCompleto" className="sr-only">Nome Completo</Label>
            <Input 
              id="nomeCompleto" 
              type="text" 
              placeholder="Nome Completo" 
              value={formData.nomeCompleto} 
              onChange={(e) => handleInputChange("nomeCompleto", e.target.value)} 
              required 
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" className="sr-only">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="Email" 
              value={formData.email} 
              onChange={(e) => handleInputChange("email", e.target.value)} 
              required 
            />
          </div>

          {/* Curso - ALTERADO PARA SELECT */}
          <div>
            <Label htmlFor="curso" className="sr-only">Curso</Label>
            <select
              id="curso"
              value={formData.curso}
              onChange={(e) => handleInputChange("curso", e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            >
              <option value="">Selecione seu curso</option>
              <option value="Sistemas de Informacao">Sistemas de Informacao</option>
              <option value="Ciencia da Computacao">Ciencia da Computacao</option>
            </select>
          </div>

          {/* Matrícula */}
          <div>
            <Label htmlFor="matricula" className="sr-only">Matrícula</Label>
            <Input 
              id="matricula" 
              type="text" 
              placeholder="Matrícula" 
              value={formData.matricula} 
              onChange={(e) => handleInputChange("matricula", e.target.value)} 
              required 
            />
          </div>

          {/* Senha */}
          <div className="relative">
            <Label htmlFor="senha" className="sr-only">Senha</Label>
            <div className="relative">
              <Input 
                id="senha" 
                type={showPassword ? "text" : "password"} 
                placeholder="Senha" 
                value={formData.senha} 
                onChange={(e) => handleInputChange("senha", e.target.value)} 
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

          {/* Confirmar Senha */}
          <div className="relative">
            <Label htmlFor="confirmarSenha" className="sr-only">Confirme a Senha</Label>
            <div className="relative">
              <Input 
                id="confirmarSenha" 
                type={showConfirmPassword ? "text" : "password"} 
                placeholder="Confirme a Senha" 
                value={formData.confirmarSenha} 
                onChange={(e) => handleInputChange("confirmarSenha", e.target.value)} 
                className="pr-10" 
                required 
              />
              <button 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Exibe a mensagem de erro */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* Botão de cadastro com estado de loading */}
          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-full mt-6"
            disabled={loading}
          >
            {loading ? "CADASTRANDO..." : "CADASTRAR"}
          </Button>

          {/* Link para Login */}
          <p className="text-center text-sm text-muted-foreground mt-4">
            Já possui uma conta?{" "}
            <Link to="/login" className="text-purple-600 hover:text-purple-700 font-medium">
              Faça login aqui.
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Cadastro;