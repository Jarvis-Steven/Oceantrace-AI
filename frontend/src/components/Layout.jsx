import { useState, useEffect } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { Anchor, Moon, Sun, Settings, Clock, Activity, Menu, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import SettingsModal from "./SettingsModal";

function Layout() {
  const { theme, toggleTheme } = useTheme();
  const [utcTime, setUtcTime] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isSimulated, setIsSimulated] = useState(true);
  const location = useLocation();

  // Update live UTC clock every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, "0");
      const minutes = String(now.getUTCMinutes()).padStart(2, "0");
      const seconds = String(now.getUTCSeconds()).padStart(2, "0");
      const day = now.getUTCDate();
      const month = now.toLocaleString("default", { month: "short", timeZone: "UTC" }).toUpperCase();
      const year = now.getUTCFullYear();
      setUtcTime(`${hours}:${minutes}:${seconds} UTC • ${day} ${month} ${year}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  return (
    <div className="h-screen w-screen bg-[var(--bg-main)] text-[var(--text-primary)] font-sans flex flex-col overflow-hidden select-none transition-colors duration-150">
      {/* Top Application Header */}
      <header className="h-14 bg-[var(--bg-card)] border-b border-[var(--border-color)] px-4 sm:px-6 flex items-center justify-between z-40 shrink-0">
        {/* Brand Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-1.5 rounded bg-[var(--bg-card-elevated)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            aria-label="Toggle navigation"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded border border-[var(--border-color)] bg-[var(--bg-card-elevated)] flex items-center justify-center text-[var(--text-primary)]">
              <Anchor className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-wider text-[var(--text-primary)] uppercase">
                  OCEANTRACE<span className="text-[var(--text-muted)] font-normal"> AI</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-[var(--border-color)] bg-[var(--bg-card-elevated)] text-[var(--text-secondary)]">
                  PC DESKTOP
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-colors rounded ${
                isActive
                  ? "bg-[var(--bg-card-elevated)] text-[var(--text-primary)] border border-[var(--border-color)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-elevated)]"
              }`
            }
          >
            DASHBOARD
          </NavLink>
          <NavLink
            to="/map"
            className={({ isActive }) =>
              `px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-colors rounded ${
                isActive
                  ? "bg-[var(--bg-card-elevated)] text-[var(--text-primary)] border border-[var(--border-color)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-elevated)]"
              }`
            }
          >
            INVESTIGATION MAP
          </NavLink>
          <NavLink
            to="/evidence"
            className={({ isActive }) =>
              `px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-colors rounded ${
                isActive
                  ? "bg-[var(--bg-card-elevated)] text-[var(--text-primary)] border border-[var(--border-color)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-elevated)]"
              }`
            }
          >
            INCIDENT DOSSIER
          </NavLink>
        </nav>

        {/* Right Controls & Telemetry */}
        <div className="flex items-center gap-3 text-xs font-mono">
          {/* UTC Clock */}
          <div className="hidden xl:flex items-center gap-2 text-[var(--text-secondary)] bg-[var(--bg-card-elevated)] px-2.5 py-1 rounded border border-[var(--border-color)]">
            <Clock className="w-3.5 h-3.5" />
            <span>{utcTime || "UTC"}</span>
          </div>

          {/* Mode Pill */}
          <button
            onClick={() => setSettingsOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-[var(--border-color)] bg-[var(--bg-card-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-[11px]"
          >
            <span className={`h-2 w-2 rounded-full ${isSimulated ? "bg-emerald-500" : "bg-blue-500"}`} />
            <span className="hidden sm:inline">{isSimulated ? "DEMO MODE" : "LIVE API"}</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded border border-[var(--border-color)] bg-[var(--bg-card-elevated)] text-[var(--text-primary)] hover:bg-[var(--border-color)] transition-colors"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          >
            {theme === "dark" ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
          </button>

          {/* Settings Button */}
          <button
            onClick={() => setSettingsOpen(true)}
            className="p-1.5 rounded border border-[var(--border-color)] bg-[var(--bg-card-elevated)] text-[var(--text-primary)] hover:bg-[var(--border-color)] transition-colors"
            title="System Settings & Status"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Body Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Command Strip */}
        <aside
          className={`fixed md:relative z-30 h-full w-14 bg-[var(--bg-card)] border-r border-[var(--border-color)] flex flex-col items-center py-3 justify-between transition-transform duration-200 shrink-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <div className="flex flex-col items-center gap-3 w-full px-2">
            <NavLink
              to="/"
              end
              title="Dashboard Overview"
              className={({ isActive }) =>
                `w-10 h-10 rounded flex items-center justify-center transition-colors ${
                  isActive
                    ? "bg-[var(--bg-card-elevated)] text-[var(--text-primary)] border border-[var(--border-color)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-elevated)]"
                }`
              }
            >
              <Activity className="w-4 h-4" />
            </NavLink>

            <NavLink
              to="/map"
              title="Spatial Map Investigation"
              className={({ isActive }) =>
                `w-10 h-10 rounded flex items-center justify-center transition-colors ${
                  isActive
                    ? "bg-[var(--bg-card-elevated)] text-[var(--text-primary)] border border-[var(--border-color)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-elevated)]"
                }`
              }
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </NavLink>

            <NavLink
              to="/evidence"
              title="Incident Dossier & Evidence Reports"
              className={({ isActive }) =>
                `w-10 h-10 rounded flex items-center justify-center transition-colors ${
                  isActive
                    ? "bg-[var(--bg-card-elevated)] text-[var(--text-primary)] border border-[var(--border-color)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-elevated)]"
                }`
              }
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </NavLink>
          </div>

          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => setSettingsOpen(true)}
              className="w-10 h-10 rounded flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-elevated)] transition-colors"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </aside>

        {/* Mobile Backdrop */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
          />
        )}

        {/* Main Route Viewport */}
        <main className="flex-1 h-full w-full overflow-hidden relative bg-[var(--bg-main)]">
          <Outlet context={{ isSimulated, setIsSimulated }} />
        </main>
      </div>

      {/* Footer Status Bar */}
      <footer className="h-6 bg-[var(--bg-card)] border-t border-[var(--border-color)] px-4 flex items-center justify-between text-[10px] font-mono text-[var(--text-secondary)] shrink-0 z-40">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> ONLINE
          </span>
          <span className="hidden sm:inline">SAR SENSORS: SENTINEL-1 IW VV</span>
          <span className="hidden lg:inline font-medium text-[var(--text-primary)]">ARABIAN SEA CORRIDOR</span>
        </div>
        <div className="flex items-center gap-3">
          <span>LAT: 09°30'00"N</span>
          <span>LON: 070°00'00"E</span>
          <span className="font-semibold text-[var(--text-primary)]">OCEANTRACE v1.0</span>
        </div>
      </footer>

      {/* Settings Preferences Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        isSimulated={isSimulated}
        setIsSimulated={setIsSimulated}
      />
    </div>
  );
}

export default Layout;