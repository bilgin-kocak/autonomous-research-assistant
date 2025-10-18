import React from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#02060d] mt-auto">
      <div className="flex flex-col gap-10 pt-24 pb-14 px-0">
        {/* Top Border Line */}
        <div className="h-0 w-full border-t border-[#1E2738]" />

        {/* Footer Content */}
        <div className="flex gap-14 items-start w-full px-8">
          {/* Logo and Social - Left Column */}
          <div className="flex-1 flex flex-col justify-between min-h-[80px]">
            {/* Logo */}
            <div className="flex items-center gap-1 h-8 mb-auto">
              <div className="w-7 h-7">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="14" r="14" fill="url(#logo-gradient-footer)" />
                  <path d="M14 9L16.5 14L14 19L11.5 14L14 9Z" fill="white" />
                  <defs>
                    <linearGradient id="logo-gradient-footer" x1="0" y1="0" x2="28" y2="28">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span className="text-[28px] font-bold text-primary-500 leading-none tracking-tight font-display">
                ScienceDAO
              </span>
            </div>

            {/* Social Icons */}
            <div className="flex gap-4 items-start mt-auto">
              <a href="#" className="w-6 h-6 text-text-secondary hover:text-white transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="w-6 h-6 text-text-secondary hover:text-white transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="w-6 h-6 text-text-secondary hover:text-white transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Resources Column */}
          <div className="flex flex-col gap-3 w-[200px]">
            <p className="text-[15px] font-medium leading-5 text-[#d7dce4]">
              Resources
            </p>
            <p className="text-[15px] font-medium leading-5 text-[rgba(209,219,235,0.62)]">
              Documentation
            </p>
            <p className="text-[15px] font-medium leading-5 text-[rgba(209,219,235,0.62)]">
              API Reference
            </p>
          </div>

          {/* Community Column */}
          <div className="flex flex-col gap-3 w-[200px]">
            <p className="text-[15px] font-medium leading-5 text-[#d7dce4]">
              Community
            </p>
            <p className="text-[15px] font-medium leading-5 text-[rgba(209,219,235,0.62)]">
              Forum
            </p>
            <p className="text-[15px] font-medium leading-5 text-[rgba(209,219,235,0.62)]">
              GitHub
            </p>
          </div>

          {/* Company Column */}
          <div className="flex flex-col gap-3 w-[200px]">
            <p className="text-[15px] font-medium leading-5 text-[#d7dce4]">
              Company
            </p>
            <p className="text-[15px] font-medium leading-5 text-[rgba(209,219,235,0.62)]">
              About Us
            </p>
            <p className="text-[15px] font-medium leading-5 text-[rgba(209,219,235,0.62)]">
              Careers
            </p>
          </div>

          {/* Contact Column */}
          <div className="flex flex-col gap-3 w-[200px]">
            <p className="text-[15px] font-medium leading-5 text-[#d7dce4]">
              Contact
            </p>
            <p className="text-[15px] font-medium leading-5 text-[rgba(209,219,235,0.62)]">
              Support
            </p>
            <p className="text-[15px] font-medium leading-5 text-[rgba(209,219,235,0.62)]">
              Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
