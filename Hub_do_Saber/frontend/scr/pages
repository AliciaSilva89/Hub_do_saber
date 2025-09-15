import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

const Cadastro = () => {
  const navigate = useNavigate(); // hook para redirecionamento

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCadastro = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Cadastro attempt:", formData);

    // Aqui poderia entrar a chamada para API de cadastro.
    // Após sucesso, redireciona para o dashboard:
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border-2 border-primary/20 rounded-lg p-8 shadow-lg">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/logohubdosaber.png"
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
            <Label htmlFor="nomeCompleto" className="sr-only">
              Nome Completo
            </Label>
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
            <Label htmlFor="email" className="sr-only">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
            />
          </div>

          {/* Curso */}
          <div>
            <Label htmlFor="curso" className="sr-only">
              Curso
            </Label>
            <Input
              id="curso"
              type="text"
              placeholder="Curso"
              value={formData.curso}
              onChange={(e) => handleInputChange("curso", e.target.value)}
              required
            />
          </div>

          {/* Matrícula */}
          <div>
            <Label htmlFor="matricula" className="sr-only">
              Matrícula
            </Label>
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
            <Label htmlFor="senha" className="sr-only">
              Senha
            </Label>
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
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirme a Senha */}
          <div className="relative">
            <Label htmlFor="confirmarSenha" className="sr-only">
              Confirme a Senha
            </Label>
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
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Botão Cadastrar */}
          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-full mt-6"
          >
            CADASTRAR
          </Button>

          {/* Link Login */}
          <p className="text-center text-sm text-muted-foreground mt-4">
            Já possui uma conta?{" "}
            <Link
              to="/login"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Faça login aqui.
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Cadastro;
