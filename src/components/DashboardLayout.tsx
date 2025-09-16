import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  History,
  User,
  CreditCard,
  LogOut,
} from "lucide-react";
import NavBar from "./NavBar";
import Footer from "./Footer";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const navItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/dashboard",
    },
    {
      label: "Transaction History",
      icon: <History className="h-5 w-5" />,
      href: "/transactions",
    },
    {
      label: "My Profile",
      icon: <User className="h-5 w-5" />,
      href: "/profile",
    },
    {
      label: "Pay Bills",
      icon: <CreditCard className="h-5 w-5" />,
      href: "/bills",
    },
  ];

  const handleSignOut = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar isLoggedIn={true} onSignOut={handleSignOut} />

      <div className="flex-1 flex flex-col md:flex-row">
        <nav
          className={`hidden md:block bg-wf-red text-white w-full md:w-64 p-0`}
        >
          <div className="flex flex-col">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 hover:bg-wf-red-dark
                  ${pathname === item.href ? "bg-wf-red-dark" : ""}
                `}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-3 hover:bg-wf-red-dark text-left"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign out</span>
            </button>
          </div>
        </nav>

        <main className="flex-1 flex flex-col">
          <div className="flex-1">{children}</div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
