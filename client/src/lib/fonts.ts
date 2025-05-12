// Font loader for custom fonts
import localFont from "next/font/local";

// Define the Gelica font
export const gelica = localFont({
  src: [
    {
      path: "../../attached_assets/Gelica Medium.otf",
      weight: "500",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-gelica",
});

// Define the Figtree font
export const figtree = localFont({
  src: [
    {
      path: "../../attached_assets/Figtree-Regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-figtree",
});
