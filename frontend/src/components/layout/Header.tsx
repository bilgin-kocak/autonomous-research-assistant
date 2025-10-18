import React from "react";
import { Sparkles, ChevronDown, Wallet, LogOut } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";

interface HeaderProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { ready, authenticated, user, login, logout } = usePrivy();

  const navItems = [
    { id: "overview", label: "Dashboard" },
    { id: "hypotheses", label: "Hypotheses" },
    { id: "papers", label: "Papers" },
    { id: "agents", label: "Agents" },
  ];

  // Format wallet address to show first 6 and last 4 characters
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Get user's wallet address
  const walletAddress = user?.wallet?.address;

  return (
    <header className="bg-[#0D1117] border-b border-[#1E2738] sticky top-0 z-50">
      <div className="px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-12">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="url(#logo-gradient)" />
                  <path d="M12 8L14 12L12 16L10 12L12 8Z" fill="white" />
                  <defs>
                    <linearGradient
                      id="logo-gradient"
                      x1="0"
                      y1="0"
                      x2="24"
                      y2="24"
                    >
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span className="text-lg font-semibold text-white">
                ScienceDAO
              </span>
            </div>

            {/* Navigation Links */}
            <nav className="flex items-center space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab?.(item.id)}
                  className="px-3 py-2 text-sm text-text-secondary hover:text-white transition-colors flex items-center space-x-1"
                >
                  <span>{item.label}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
              ))}
            </nav>
          </div>

          {/* Right Side Actions - Wallet Connection */}
          <div className="flex items-center space-x-3">
            {!ready ? (
              <div className="px-4 py-2 text-sm text-text-secondary">
                Loading...
              </div>
            ) : authenticated && walletAddress ? (
              <>
                <div className="flex items-center space-x-2 px-4 py-2 bg-[rgba(184,199,224,0.12)] rounded-lg border border-primary-500/20">
                  <Wallet className="w-4 h-4 text-primary-500" />
                  <span className="text-sm font-medium text-white font-mono">
                    {formatAddress(walletAddress)}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-white transition-colors flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Disconnect</span>
                </button>
              </>
            ) : (
              <button
                onClick={login}
                className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center space-x-2"
              >
                <Wallet className="w-4 h-4" />
                <span>Connect Wallet</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
