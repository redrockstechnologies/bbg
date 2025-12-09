import { useLocation } from "wouter";
import { Link } from "wouter";
import Logo from "@/components/ui/logo";
import BubbleMenu from "@/components/ui/BubbleMenu";

const Navbar = () => {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  const menuItems = [
    {
      label: 'Home',
      href: '/',
      ariaLabel: 'Home',
      rotation: -8,
      hoverStyles: { bgColor: 'hsl(345, 100%, 78%)', textColor: '#ffffff' }
    },
    {
      label: 'Baby Gear',
      href: '/gear',
      ariaLabel: 'Baby Gear',
      rotation: 8,
      hoverStyles: { bgColor: 'hsl(345, 100%, 78%)', textColor: '#ffffff' }
    },
    {
      label: 'Baby Essentials',
      href: '/baby-essentials',
      ariaLabel: 'Baby Essentials',
      rotation: 8,
      hoverStyles: { bgColor: 'hsl(345, 100%, 78%)', textColor: '#ffffff' }
    },
    {
      label: 'Contact Us',
      href: '/contact',
      ariaLabel: 'Contact',
      rotation: -8,
      hoverStyles: { bgColor: 'hsl(345, 100%, 78%)', textColor: '#ffffff' }
    }
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/">
              <Logo className="h-16 cursor-pointer" variant="header" />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/">
              <span className={`text-primary hover:text-accent font-medium py-2 cursor-pointer ${isActive('/') ? 'active-tab' : ''}`}>
                Home
              </span>
            </Link>
            <Link href="/gear">
              <span className={`text-primary hover:text-accent font-medium py-2 cursor-pointer ${isActive('/gear') ? 'active-tab' : ''}`}>
                Baby Gear
              </span>
            </Link>
            <Link href="/baby-essentials">
              <span className={`text-primary hover:text-accent font-medium py-2 cursor-pointer ${isActive('/baby-essentials') ? 'active-tab' : ''}`}>
                Baby Essentials
              </span>
            </Link>
            <Link href="/contact">
              <span className={`text-primary hover:text-accent font-medium py-2 cursor-pointer ${isActive('/contact') ? 'active-tab' : ''}`}>
                Contact Us
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - BubbleMenu */}
      <div className="md:hidden">
        <BubbleMenu
          logo={<Logo className="h-10" variant="header" />}
          items={menuItems}
          menuAriaLabel="Toggle navigation"
          menuBg="hsl(345, 100%, 97%)"
          menuContentColor="hsl(340, 100%, 19%)"
          useFixedPosition={true}
          animationEase="back.out(1.5)"
          animationDuration={0.5}
          staggerDelay={0.12}
        />
      </div>
    </>
  );
};

export default Navbar;