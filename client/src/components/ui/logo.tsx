import React from "react";

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <img 
      src="/attached_assets/BBG new white logo.png"
      alt="Ballito Baby Gear Logo"
      className={className}
    />
  );
};

export default Logo;
