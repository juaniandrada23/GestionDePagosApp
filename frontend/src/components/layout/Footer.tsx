import React from 'react';
import { FiGithub } from 'react-icons/fi';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-primary-500 flex items-center justify-center">
              <span className="text-white font-bold text-[10px]">GP</span>
            </div>
            <span className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Gestión de Pagos
            </span>
          </div>

          <a
            href="https://github.com/juaniandrada23/GestionDePagosApp"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiGithub className="w-4 h-4" />
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
