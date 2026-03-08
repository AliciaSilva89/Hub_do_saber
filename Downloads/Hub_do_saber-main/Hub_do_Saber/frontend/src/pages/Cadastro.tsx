import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

// ✅ Força da senha
const getPasswordStrength = (password: string) => {
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const hasMinLength = password.length >= 8;

  const isIntermediate = hasUpper && hasLower && hasMinLength && hasSpecial;
  const isStrong = isIntermediate && hasNumber;
  const isVeryStrong = isStrong && password.length >= 12;

  if (isVeryStrong)
    return {
      label: "Muito forte",
      color: "bg-green-700",
      textColor: "text-green-700",
      level: 4,
      width: "w-full",
    };
  if (isStrong)
    return {
      label: "Forte",
      color: "bg-green-500",
      textColor: "text-green-500",
      level: 3,
      width: "w-3/4",
    };
  if (isIntermediate)
    return {
      label: "Intermediária",
      color: "bg-yellow-500",
      textColor: "text-yellow-500",
      level: 2,
      width: "w-2/4",
    };
  return {
    label: "Fraca",
    color: "bg-red-500",
    textColor: "text-red-500",
    level: 1,
    width: "w-1/4",
  };
};

// ✅ Valida matrícula conforme o curso selecionado
const validateMatricula = (matricula: string, curso: string): string | null => {
  if (!matricula || !curso) return null;

  if (curso === "Sistemas de Informação") {
    if (!/^BSI\d+$/.test(matricula)) {
      return "Matrícula deve seguir o padrão BSI + números (ex: BSI2023001)";
    }
  }

  if (curso === "Ciência da Computação") {
    if (!/^BCC\d+$/.test(matricula)) {
      return "Matrícula deve seguir o padrão BCC + números (ex: BCC2023001)";
    }
  }

  return null;
};

// ✅ Valida email UFU
const validateEmail = (email: string): string | null => {
  if (!email) return null;
  if (!email.endsWith("@ufu.br")) {
    return "Apenas e-mails @ufu.br são aceitos (ex: nome@ufu.br)";
  }
  return null;
};


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
    confirmarSenha: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const passwordStrength = getPasswordStrength(formData.senha);

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.senha && passwordStrength.level < 2) {
      setError(
        "A senha deve ser pelo menos intermediária. Adicione letras maiúsculas, caracteres especiais e mínimo 8 caracteres.",
      );
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      setError("As senhas não coincidem.");
      return;
    }
    const matriculaError = validateMatricula(
      formData.matricula,
      formData.curso,
    );
    if (matriculaError) {
      setError(matriculaError);
      return;
    }

    // ✅ Valida email
    const emailError = validateEmail(formData.email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const requestData = {
        name: formData.nomeCompleto.trim(),
        email: formData.email.trim(),
        password: formData.senha,
        matriculation: formData.matricula.trim(),
        courseName: formData.curso.trim(),
      };

      const response = await axios.post(
        "http://localhost:8080/api/users",
        requestData,
      );

      if (response.status === 201) {
        navigate("/dashboard");
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 409) {
          setError("Este e-mail já está cadastrado.");
        } else if (err.response.status === 400) {
          setError(
            err.response.data.message ||
              "Erro ao cadastrar. Verifique os dados.",
          );
        } else {
          setError("Erro ao cadastrar. Tente novamente.");
        }
      } else {
        setError("Erro de rede. Verifique sua conexão.");
      }
    } finally {
      setLoading(false);
    }
  };;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border-2 border-primary/20 rounded-lg p-8 shadow-lg">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/logo.png" className="w-20 h-20 rounded-lg object-cover" />
        </div>

        <h1 className="text-2xl font-bold text-center mb-8 text-foreground">
          Hub do Saber
        </h1>

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
              onChange={(e) =>
                handleInputChange("nomeCompleto", e.target.value)
              }
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
              placeholder="Email institucional (ex: nome@ufu.br)"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={
                formData.email
                  ? validateEmail(formData.email)
                    ? "border-red-500 focus-visible:ring-red-500"
                    : "border-green-500 focus-visible:ring-green-500"
                  : ""
              }
              required
            />

            {/* ✅ Feedback em tempo real */}
            {formData.email && (
              <p
                className={`text-xs mt-1 ${
                  validateEmail(formData.email)
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {validateEmail(formData.email) ?? "✓ Email válido"}
              </p>
            )}
          </div>

          {/* Curso */}
          <div>
            <Label htmlFor="curso" className="sr-only">
              Curso
            </Label>
            <select
              id="curso"
              value={formData.curso}
              onChange={(e) => handleInputChange("curso", e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            >
              <option value="">Selecione seu curso</option>
              <option value="Sistemas de Informação">
                Sistemas de Informação
              </option>
              <option value="Ciência da Computação">
                Ciência da Computação
              </option>
            </select>
          </div>

          {/* Matrícula */}
          <div>
            <Label htmlFor="matricula" className="sr-only">
              Matrícula
            </Label>
            <Input
              id="matricula"
              type="text"
              placeholder={
                formData.curso === "Sistemas de Informação"
                  ? "Matrícula (ex: BSI2023001)"
                  : formData.curso === "Ciência da Computação"
                    ? "Matrícula (ex: BCC2023001)"
                    : "Matrícula"
              }
              value={formData.matricula}
              onChange={(e) =>
                handleInputChange("matricula", e.target.value.toUpperCase())
              }
              className={
                formData.matricula && formData.curso
                  ? validateMatricula(formData.matricula, formData.curso)
                    ? "border-red-500 focus-visible:ring-red-500"
                    : "border-green-500 focus-visible:ring-green-500"
                  : ""
              }
              required
            />

            {/* ✅ Feedback em tempo real */}
            {formData.matricula && formData.curso && (
              <p
                className={`text-xs mt-1 ${
                  validateMatricula(formData.matricula, formData.curso)
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {validateMatricula(formData.matricula, formData.curso) ??
                  "✓ Matrícula válida"}
              </p>
            )}

            {/* ✅ Dica do padrão esperado */}
            {!formData.matricula && formData.curso && (
              <p className="text-xs text-muted-foreground mt-1">
                {formData.curso === "Sistemas de Informação"
                  ? "Padrão: BSI + números (ex: BSI2023001)"
                  : "Padrão: BCC + números (ex: BCC2023001)"}
              </p>
            )}
          </div>

          {/* Senha */}
          <div>
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

            {/* ✅ Barra + Checklist */}
            {formData.senha.length > 0 && (
              <div className="mt-2 space-y-1">
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color} ${passwordStrength.width}`}
                  />
                </div>
                <p
                  className={`text-xs font-medium ${passwordStrength.textColor}`}
                >
                  {passwordStrength.label}
                </p>
                <ul className="text-xs space-y-0.5 mt-1">
                  <li
                    className={
                      /[A-Z]/.test(formData.senha)
                        ? "text-green-500"
                        : "text-muted-foreground"
                    }
                  >
                    {/[A-Z]/.test(formData.senha) ? "✓" : "○"} Uma letra
                    maiúscula
                  </li>
                  <li
                    className={
                      /[a-z]/.test(formData.senha)
                        ? "text-green-500"
                        : "text-muted-foreground"
                    }
                  >
                    {/[a-z]/.test(formData.senha) ? "✓" : "○"} Uma letra
                    minúscula
                  </li>
                  <li
                    className={
                      formData.senha.length >= 8
                        ? "text-green-500"
                        : "text-muted-foreground"
                    }
                  >
                    {formData.senha.length >= 8 ? "✓" : "○"} Mínimo 8 caracteres
                  </li>
                  <li
                    className={
                      /[^A-Za-z0-9]/.test(formData.senha)
                        ? "text-green-500"
                        : "text-muted-foreground"
                    }
                  >
                    {/[^A-Za-z0-9]/.test(formData.senha) ? "✓" : "○"} Um
                    caractere especial (!@#$...)
                  </li>
                  <li
                    className={
                      /[0-9]/.test(formData.senha)
                        ? "text-green-500"
                        : "text-muted-foreground"
                    }
                  >
                    {/[0-9]/.test(formData.senha) ? "✓" : "○"} Um número (para
                    senha Forte)
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Confirmar Senha */}
          <div>
            <Label htmlFor="confirmarSenha" className="sr-only">
              Confirme a Senha
            </Label>
            <div className="relative">
              <Input
                id="confirmarSenha"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirme a Senha"
                value={formData.confirmarSenha}
                onChange={(e) =>
                  handleInputChange("confirmarSenha", e.target.value)
                }
                className={`pr-10 ${
                  formData.confirmarSenha &&
                  formData.senha !== formData.confirmarSenha
                    ? "border-red-500 focus-visible:ring-red-500"
                    : formData.confirmarSenha &&
                        formData.senha === formData.confirmarSenha
                      ? "border-green-500 focus-visible:ring-green-500"
                      : ""
                }`}
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

            {/* ✅ Feedback de confirmação */}
            {formData.confirmarSenha && (
              <p
                className={`text-xs mt-1 ${
                  formData.senha === formData.confirmarSenha
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {formData.senha === formData.confirmarSenha
                  ? "✓ Senhas coincidem"
                  : "✗ Senhas não coincidem"}
              </p>
            )}
          </div>

          {/* Erro geral */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* Botão */}
          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-full mt-6"
            disabled={
              loading ||
              (formData.senha.length > 0 && passwordStrength.level < 2)
            }
          >
            {loading ? "CADASTRANDO..." : "CADASTRAR"}
          </Button>

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
