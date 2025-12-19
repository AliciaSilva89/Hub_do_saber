import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Saiba = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Logo da plataforma Hub do Saber"
              className="w-20 h-20 rounded-lg object-cover"
            />
            <span className="font-semibold text-lg">Hub do Saber</span>
          </div>
          
          <nav className="flex items-center gap-6">
            <Link to="/login" className="text-muted-foreground hover:text-primary">
              Login
            </Link>
            <Link to="/dashboard" className="text-muted-foreground hover:text-primary">
              Página
            </Link>
            <Link to="/saiba" className="text-foreground hover:text-primary font-medium">
              Saiba
            </Link>
            <Button asChild className="bg-black hover:bg-black/90 text-white">
              <Link to="/cadastro">Cadastre-se</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center space-y-8">
          <h1 className="text-4xl font-bold">Saiba Mais</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            O Hub do Saber é uma plataforma revolucionária de aprendizado colaborativo que conecta estudantes, 
            monitores e professores em um ambiente digital intuitivo e acolhedor.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 text-left">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Nossa Missão</h2>
              <p className="text-muted-foreground">
                Facilitar o acesso ao conhecimento através de grupos de estudo interativos, 
                onde a dúvida é vista como o primeiro passo para a sabedoria.
              </p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Como Funciona</h2>
              <p className="text-muted-foreground">
                Conectamos você com grupos de estudo que se adequam ao seu ritmo e necessidades, 
                proporcionando um ambiente de maior suporte e abertura para o aprendizado.
              </p>
            </div>
          </div>
          
          <div className="mt-12">
            <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
              <Link to="/cadastro">Comece Agora</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Saiba;