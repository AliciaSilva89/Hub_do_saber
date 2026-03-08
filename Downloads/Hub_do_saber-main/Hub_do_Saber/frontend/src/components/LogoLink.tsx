import { useLogoLink } from "@/hooks/useLogoLink";

const LogoLink = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const handleLogoClick = useLogoLink();

  const sizeClass = {
    sm: "w-10 h-10",
    md: "w-14 h-14",
    lg: "w-20 h-20",
  }[size];

  return (
    <button
      onClick={handleLogoClick}
      className="flex items-center gap-3 hover:opacity-80 transition-opacity"
    >
      <img
        src="/logo.png"
        alt="Hub do Saber"
        className={`${sizeClass} rounded-lg`}
      />
      <span className="font-semibold text-lg">Hub do Saber</span>
    </button>
  );
};

export default LogoLink;
