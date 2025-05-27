import React, { useState } from "react";
import headerLogo from "./attached_assets/BBG_Header.png";
import footerLogo from "./attached_assets/BBG_Footer.png";

interface LogoProps {
  className?: string;
  variant?: 'header' | 'footer';
}

const Logo: React.FC<LogoProps> = ({ className, variant = 'footer' }) => {
  const [imgError, setImgError] = useState(false);
  const src = variant === 'header' ? headerLogo : footerLogo;

  return imgError ? (
    <span style={{ color: 'red', fontWeight: 'bold' }}>Logo not found</span>
  ) : (
    <img
      src={src}
      alt={variant === 'header' ? 'Ballito Baby Gear Header Logo' : 'Ballito Baby Gear Footer Logo'}
      className={className}
      onError={() => setImgError(true)}
      loading="lazy"
      style={{
        display: 'block',
        maxWidth: '250px',
        maxHeight: '64px',
        height: 'auto',
        width: 'auto',
        ...((className ? {} : {}))
      }}
    />
  );
};

export default Logo;

