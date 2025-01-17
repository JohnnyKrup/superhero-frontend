import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { StackedLayout } from "../components/controls/stacked-layout";
import {
  Navbar,
  NavbarItem,
  NavbarSection,
  NavbarDivider,
  NavbarLabel,
} from "../components/controls/navbar";

import Logo from "../images/Hero_Red.svg";

// Navigation bar content using the same styling
const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const isCurrentPath = (path) => {
    return location.pathname === path;
  };

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate("/");
  };

  const handleNavigation = (e, path) => {
    e.preventDefault();
    navigate(path);
  };

  // console.log("user", user);

  return (
    <Navbar>
      <NavbarSection>
        <NavbarItem
          href="/"
          current={isCurrentPath("/")}
          onClick={(e) => handleNavigation(e, "/")}
          className="flex items-center gap-2"
        >
          <img src={Logo} alt="SuperheroDB Logo" className="h-8 w-auto" />
          <NavbarLabel>SuperheroDB</NavbarLabel>
        </NavbarItem>
      </NavbarSection>

      {isAuthenticated && user?.roles?.includes("ROLE_ADMIN") && (
        <>
          <NavbarDivider />
          <NavbarItem
            href="/admin"
            current={isCurrentPath("/admin")}
            onClick={(e) => handleNavigation(e, "/admin")}
          >
            <NavbarLabel>Admin</NavbarLabel>
          </NavbarItem>
        </>
      )}

      <NavbarDivider />

      <NavbarSection>
        <NavbarItem
          href="/superheroes"
          current={isCurrentPath("/superheroes")}
          onClick={(e) => handleNavigation(e, "/superheroes")}
        >
          <NavbarLabel>Superheroes</NavbarLabel>
        </NavbarItem>

        {isAuthenticated && (
          <>
            <NavbarItem
              href="/battle"
              current={isCurrentPath("/battle")}
              onClick={(e) => handleNavigation(e, "/battle")}
            >
              <NavbarLabel>Battle</NavbarLabel>
            </NavbarItem>

            <NavbarItem
              href={`/dashboard`}
              current={isCurrentPath(`/dashboard`)}
              onClick={(e) => handleNavigation(e, "/dashboard")}
            >
              <NavbarLabel>Dashboard</NavbarLabel>
            </NavbarItem>

            <NavbarItem
              href={`/profile`}
              current={isCurrentPath(`/profile`)}
              onClick={(e) => handleNavigation(e, "/profile")}
            >
              <NavbarLabel>Profile</NavbarLabel>
            </NavbarItem>
          </>
        )}
      </NavbarSection>

      <NavbarDivider />

      <NavbarSection>
        {!isAuthenticated ? (
          <NavbarItem
            href="/auth/login"
            current={isCurrentPath("/auth/login")}
            onClick={(e) => handleNavigation(e, "/auth/login")}
          >
            <NavbarLabel>Login</NavbarLabel>
          </NavbarItem>
        ) : (
          <NavbarItem href="/" onClick={handleLogout}>
            <NavbarLabel>Logout</NavbarLabel>
          </NavbarItem>
        )}
      </NavbarSection>
    </Navbar>
  );
};

// Sidebar navigation content using the same styling
const SidebarContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  const isCurrentPath = (path) => {
    return location.pathname === path;
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    logout();
    navigate("/");
  };

  const handleNavigation = (e, path) => {
    e.preventDefault();
    navigate(path);
  };
  return (
    <nav className="flex flex-col p-2">
      <NavbarSection className="flex-col items-stretch gap-1">
        {isAuthenticated && user?.roles?.includes("ROLE_ADMIN") && (
          <NavbarItem
            href="/admin"
            current={isCurrentPath("/admin")}
            onClick={(e) => handleNavigation(e, "/admin")}
          >
            <NavbarLabel>Admin</NavbarLabel>
          </NavbarItem>
        )}

        <NavbarItem
          href="/superheroes"
          current={location.pathname === "/superheroes"}
          onClick={(e) => handleNavigation(e, "/superheroes")}
        >
          <NavbarLabel>Superheroes</NavbarLabel>
        </NavbarItem>

        {isAuthenticated && (
          <>
            <NavbarItem
              href="/battle"
              current={isCurrentPath("/battle")}
              onClick={(e) => handleNavigation(e, "/battle")}
            >
              <NavbarLabel>Battle</NavbarLabel>
            </NavbarItem>

            <NavbarItem
              href={`/dashboard`}
              current={isCurrentPath(`/dashboard`)}
              onClick={(e) => handleNavigation(e, "/dashboard")}
            >
              <NavbarLabel>Dashboard</NavbarLabel>
            </NavbarItem>

            <NavbarItem
              href={`/profile`}
              current={isCurrentPath(`/profile`)}
              onClick={(e) => handleNavigation(e, "/profile")}
            >
              <NavbarLabel>Profile</NavbarLabel>
            </NavbarItem>
          </>
        )}
      </NavbarSection>

      <NavbarDivider />

      <NavbarSection>
        {!isAuthenticated ? (
          <NavbarItem
            href="/auth/login"
            current={isCurrentPath("/auth/login")}
            onClick={(e) => handleNavigation(e, "/auth/login")}
          >
            <NavbarLabel>Login</NavbarLabel>
          </NavbarItem>
        ) : (
          <NavbarItem href="/" onClick={handleLogout}>
            <NavbarLabel>Logout</NavbarLabel>
          </NavbarItem>
        )}
      </NavbarSection>
    </nav>
  );
};

/**
 * Main Layout component
 * @returns
 */
const MainLayout = () => {
  return (
    <StackedLayout navbar={<Navigation />} sidebar={<SidebarContent />}>
      <Outlet />
    </StackedLayout>
  );
};
export default MainLayout;
