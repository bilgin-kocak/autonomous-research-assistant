import React, { useState } from 'react';
import { Facebook, Instagram, Twitter, Copy, Check, ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS || "0x1221aBCe7D8FB1ba4cF9293E94539cb45e7857fE";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

          {/* Smart Contract Column */}
          <div className="flex flex-col gap-3 w-[240px]">
            <p className="text-[15px] font-medium leading-5 text-[#d7dce4] mb-1">
              Smart Contract
            </p>
            <div className="p-3 bg-[rgba(184,199,224,0.08)] rounded-lg border border-[#1E2738]">
              <div className="flex items-center gap-2 mb-2">
                <code className="text-[11px] font-mono text-[#94a3b8] flex-1 truncate">
                  {contractAddress.substring(0, 10)}...{contractAddress.substring(contractAddress.length - 8)}
                </code>
                <button
                  onClick={copyToClipboard}
                  className="p-1 hover:bg-[rgba(184,199,224,0.12)] rounded transition-colors"
                  title="Copy address"
                >
                  {copied ? (
                    <Check className="w-3 h-3 text-green-400" />
                  ) : (
                    <Copy className="w-3 h-3 text-[#64748b]" />
                  )}
                </button>
              </div>
              <a
                href={`https://sepolia.basescan.org/address/${contractAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[12px] text-primary-400 hover:text-primary-300 transition-colors"
              >
                View on BaseScan
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="px-8 pt-6 border-t border-[#1E2738]">
          <p className="text-[13px] text-[#64748b] text-center">
            © 2025 ScienceDAO. All rights reserved. | Powered by Virtuals Protocol on Base Sepolia
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
