import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import EstadoServicio from '@/components/feedback/EstadoServicio';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, className = '', style }) => (
  <div className={`flex flex-col min-h-screen ${className}`} style={style}>
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
    <EstadoServicio />
  </div>
);

export default PageLayout;
