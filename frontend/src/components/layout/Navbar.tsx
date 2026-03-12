import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { CgHomeAlt } from 'react-icons/cg';
import {
  FiUser,
  FiMenu,
  FiX,
  FiLogOut,
  FiPackage,
  FiUsers,
  FiFileText,
  FiChevronDown,
  FiSettings,
} from 'react-icons/fi';
import {
  TruckIcon,
  CalculatorIcon,
  WalletIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import LoadingModal from '@/components/feedback/LoadingModal';

interface NavLink {
  label: string;
  path: string;
  icon: React.ElementType;
  show: boolean;
}

interface NavGroup {
  label: string;
  icon: React.ElementType;
  links: NavLink[];
}

const CLOSE_DELAY = 150;

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useParams<{ userId: string }>();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  const handleLogout = async () => {
    setMobileOpen(false);
    setIsLoading(true);
    await logout();
    navigate('/', { replace: true });
    setIsLoading(false);
  };

  const navTo = (path: string) => {
    navigate(path);
    setMobileOpen(false);
    setOpenDropdown(null);
  };

  const navGroups: NavGroup[] = [
    {
      label: 'Operaciones',
      icon: CurrencyDollarIcon,
      links: [
        { label: 'Compras', path: `/compras/${userId}`, icon: ShoppingCartIcon, show: true },
        { label: 'Ventas', path: `/ventas/${userId}`, icon: CurrencyDollarIcon, show: true },
        { label: 'Presupuestos', path: `/presupuestos/${userId}`, icon: FiFileText, show: true },
      ],
    },
    {
      label: 'Gestión',
      icon: FiPackage,
      links: [
        { label: 'Materiales', path: `/materiales/${userId}`, icon: FiPackage, show: true },
        { label: 'Clientes', path: `/clientes/${userId}`, icon: FiUsers, show: true },
        { label: 'Proveedores', path: `/proveedores/${userId}`, icon: TruckIcon, show: isAdmin },
      ],
    },
    {
      label: 'Administración',
      icon: FiSettings,
      links: [
        { label: 'Informes', path: `/informes/${userId}`, icon: CalculatorIcon, show: isAdmin },
        { label: 'Medios de Pago', path: `/medios/${userId}`, icon: WalletIcon, show: isAdmin },
      ],
    },
  ];

  // Filter out groups with no visible links
  const visibleGroups = navGroups
    .map((g) => ({ ...g, links: g.links.filter((l) => l.show) }))
    .filter((g) => g.links.length > 0);

  const isActive = (path: string) => location.pathname === path;

  const isGroupActive = (group: NavGroup) => group.links.some((l) => l.show && isActive(l.path));

  // Close dropdown on route change
  useEffect(() => {
    setOpenDropdown(null);
  }, [location.pathname]);

  const handleMouseEnter = useCallback((label: string) => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpenDropdown(label);
  }, []);

  const handleMouseLeave = useCallback(() => {
    closeTimer.current = setTimeout(() => {
      setOpenDropdown(null);
    }, CLOSE_DELAY);
  }, []);

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              type="button"
              onClick={() => userId && navTo(`/dashboard/${userId}`)}
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
            >
              <div className="w-9 h-9 rounded-lg bg-[#006989] flex items-center justify-center">
                <span className="text-white font-bold text-sm">GP</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-gray-800 font-semibold text-lg">Gestión de Pagos</span>
                {user?.empresaNombre && (
                  <span className="ml-2 text-xs font-medium text-gray-400">
                    {user.empresaNombre}
                  </span>
                )}
              </div>
            </button>

            {/* Desktop nav */}
            {isAuthenticated && (
              <nav className="hidden lg:flex items-center gap-1">
                {/* Inicio - direct link */}
                <button
                  type="button"
                  onClick={() => navTo(`/dashboard/${userId}`)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(`/dashboard/${userId}`)
                      ? 'bg-[#006989]/10 text-[#006989]'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                  }`}
                >
                  Inicio
                </button>

                {/* Grouped dropdowns */}
                {visibleGroups.map((group) => (
                  <div
                    key={group.label}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(group.label)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      type="button"
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isGroupActive(group) || openDropdown === group.label
                          ? 'bg-[#006989]/10 text-[#006989]'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                      }`}
                    >
                      {group.label}
                      <FiChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          openDropdown === group.label ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Dropdown */}
                    {openDropdown === group.label && (
                      <div className="absolute top-full left-0 pt-1 z-50">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 py-1.5 min-w-[200px]">
                          {group.links
                            .filter((l) => l.show)
                            .map((link) => (
                              <button
                                key={link.path}
                                type="button"
                                onClick={() => navTo(link.path)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                                  isActive(link.path)
                                    ? 'bg-[#006989]/8 text-[#006989]'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                                }`}
                              >
                                <link.icon className="w-4 h-4 flex-shrink-0" />
                                {link.label}
                              </button>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            )}

            {/* Desktop right actions */}
            {isAuthenticated && (
              <div className="hidden lg:flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => navTo(`/usuarios/${userId}`)}
                  className={`p-2 rounded-lg transition-colors ${
                    isActive(`/usuarios/${userId}`)
                      ? 'bg-[#006989]/10 text-[#006989]'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                  }`}
                  title="Perfil"
                >
                  <FiUser className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                  title="Cerrar sesión"
                >
                  <FiLogOut className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Mobile hamburger */}
            {isAuthenticated && (
              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              >
                {mobileOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isAuthenticated && mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-3 space-y-1">
              {/* Inicio */}
              <button
                type="button"
                onClick={() => navTo(`/dashboard/${userId}`)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(`/dashboard/${userId}`)
                    ? 'bg-[#006989]/10 text-[#006989]'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <CgHomeAlt className="w-5 h-5 flex-shrink-0" />
                Inicio
              </button>

              {/* Grouped sections */}
              {visibleGroups.map((group) => (
                <div key={group.label}>
                  <button
                    type="button"
                    onClick={() =>
                      setMobileExpanded(mobileExpanded === group.label ? null : group.label)
                    }
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isGroupActive(group) ? 'text-[#006989]' : 'text-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <group.icon className="w-5 h-5 flex-shrink-0" />
                      {group.label}
                    </div>
                    <FiChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        mobileExpanded === group.label ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {mobileExpanded === group.label && (
                    <div className="ml-4 pl-4 border-l-2 border-gray-100 space-y-0.5 mt-0.5 mb-1">
                      {group.links
                        .filter((l) => l.show)
                        .map((link) => (
                          <button
                            key={link.path}
                            type="button"
                            onClick={() => navTo(link.path)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                              isActive(link.path)
                                ? 'bg-[#006989]/10 text-[#006989] font-medium'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <link.icon className="w-4 h-4 flex-shrink-0" />
                            {link.label}
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile user section */}
            <div className="border-t border-gray-100 px-4 py-3">
              <div className="flex items-center gap-3 px-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#006989]/10 flex items-center justify-center">
                  <span className="text-sm font-semibold text-[#006989]">
                    {user?.name?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              </div>
              <button
                type="button"
                onClick={() => navTo(`/usuarios/${userId}`)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <FiUser className="w-5 h-5 flex-shrink-0" />
                Perfil
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <FiLogOut className="w-5 h-5 flex-shrink-0" />
                Cerrar sesión
              </button>
            </div>
          </div>
        )}
      </header>

      <LoadingModal open={isLoading} text="Cerrando sesión..." />
    </>
  );
};

export default Navbar;
