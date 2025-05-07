import lightLogo from "../../assets/sanzak_logo_light.png";
import darkLogo from "../../assets/sanzak_logo_dark.png";

interface LogoProps {
  className?: string;
}

const Logo = ({ className = "w-32 h-auto" }) => (
  <>
    <img
      src={lightLogo.src}
      alt="Sanzak Logo Light"
      className={`block dark:hidden ${className}`}
    />
    <img
      src={darkLogo.src}
      alt="Sanzak Logo Dark"
      className={`hidden dark:block ${className}`}
    />
  </>
);

export default Logo;
