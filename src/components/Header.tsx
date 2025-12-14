import { useState } from "react";
import { Search, LogIn, LogOut, Mail, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "@/assets/logo.png";

interface HeaderProps {
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onLogout: () => void;
}

const Header = ({ isLoggedIn, onLoginClick, onLogout }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2 px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs md:text-sm">
          <Mail className="w-3 h-3 md:w-4 md:h-4" />
          <a
            href="mailto:shrieshriaeacademy@gmail.com"
            className="truncate hover:underline"
          >
            shrieshriaeacademy@gmail.com
          </a>
        </div>
        <a href="https://s2academy.in/enquiry/">
          <Button
            variant="default"
            size="sm"
            className="bg-accent hover:bg-accent/90 text-accent-foreground text-xs md:text-sm"
          >
            ENQUIRY
          </Button>
        </a>
      </div>

      {/* Main Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <a href="https://erd.s2academy.in/">
                <img
                  src={logo}
                  alt="Shrie Shrie Academy"
                  className="h-12 md:h-16 w-auto"
                />
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              <a href="https://s2academy.in/" className="text-foreground hover:text-primary transition-colors">Home</a>
              <a href="https://s2academy.in/about-us/" className="text-foreground hover:text-primary transition-colors">About Us</a>
              <a href="https://s2academy.in/our-courses/" className="text-foreground hover:text-primary transition-colors">Our Courses</a>
              <a href="https://s2academy.vercel.app/" className="text-foreground hover:text-primary transition-colors font-medium">Result</a>
              <a href="https://s2academy.in/enquiry/" className="text-foreground hover:text-primary transition-colors">Enquiry</a>
              <a href="https://s2academy.in/contact/" className="text-foreground hover:text-primary transition-colors">Contact</a>
              <a href="https://s2academy.in/blog/" className="text-foreground hover:text-primary transition-colors">Blog</a>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Searching..."
                  className="pl-4 pr-10 w-64"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>

              {isLoggedIn ? (
                <Button onClick={onLogout} variant="outline" size="sm">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              ) : (
                <Button onClick={onLoginClick} variant="default">
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center gap-2">
              {isLoggedIn ? (
                <Button onClick={onLogout} variant="outline" size="sm">
                  <LogOut className="w-4 h-4" />
                </Button>
              ) : (
                <Button onClick={onLoginClick} variant="default" size="sm">
                  <LogIn className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <nav className="lg:hidden mt-4 pb-4 flex flex-col gap-3 border-t border-border pt-4">
              <a href="https://s2academy.in/" className="text-foreground hover:text-primary transition-colors py-2">Home</a>
              <a href="https://s2academy.in/about-us/" className="text-foreground hover:text-primary transition-colors py-2">About Us</a>
              <a href="https://s2academy.in/our-courses/" className="text-foreground hover:text-primary transition-colors py-2">Our Courses</a>
              <a href="https://s2academy.vercel.app/" className="text-foreground hover:text-primary transition-colors font-medium py-2">Result</a>
              <a href="https://s2academy.in/enquiry/" className="text-foreground hover:text-primary transition-colors py-2">Enquiry</a>
              <a href="https://s2academy.in/contact/" className="text-foreground hover:text-primary transition-colors py-2">Contact</a>
              <a href="https://s2academy.in/blog/" className="text-foreground hover:text-primary transition-colors py-2">Blog</a>

              <div className="relative mt-2">
                <Input
                  type="search"
                  placeholder="Searching..."
                  className="pl-4 pr-10 w-full"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </nav>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
