import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface MainLayoutProps {
    children: ReactNode;
    currentPage: string;
    onNavigate: (page: string) => void;
    isLoggedIn: boolean;
    showFooter?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({
    children,
    currentPage,
    onNavigate,
    isLoggedIn,
    showFooter = true
}) => {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header
                currentPage={currentPage}
                onNavigate={onNavigate}
                isLoggedIn={isLoggedIn}
            />
            <main className="flex-1">
                {children}
            </main>
            {showFooter && <Footer onNavigate={onNavigate} />}
        </div>
    );
};

export default MainLayout;
