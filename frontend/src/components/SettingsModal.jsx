import { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, RefreshCw, Server, Moon, Sun, ShieldCheck } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { checkHealth } from "../lib/api";

export default function SettingsModal({ isOpen, onClose, isSimulated, setIsSimulated }) {
  const { theme, toggleTheme } = useTheme();
  const [backendHealth, setBackendHealth] = useState(null);
  const [checking, setChecking] = useState(false);

  const verifyHealth = async () => {
    setChecking(true);
    try {
      const res = await checkHealth();
      setBackendHealth(res);
    } catch (err) {
      setBackendHealth({ status: "error", message: err.message });
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      verifyHealth();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] p-6 shadow-2xl text-[var(--text-primary)]">
        
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4 mb-5">
          <div className="flex items-center space-x-2.5">
            <Server className="w-5 h-5 text-[var(--text-primary)]" />
            <h2 className="text-lg font-semibold tracking-tight">System Preferences & Status</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-elevated)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 text-sm">
          
          <div className="flex items-center justify-between p-3.5 rounded-md border border-[var(--border-color)] bg-[var(--bg-card-elevated)]">
            <div>
              <div className="font-medium text-[var(--text-primary)]">Appearance Theme</div>
              <div className="text-xs text-[var(--text-secondary)]">Switch between Monochromatic Dark and Light mode</div>
            </div>
            <button
              onClick={toggleTheme}
              className="flex items-center space-x-2 px-3 py-1.5 rounded border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-elevated)] text-[var(--text-primary)] font-medium transition-colors"
            >
              {theme === "dark" ? (
                <>
                  <Moon className="w-4 h-4 text-amber-400" />
                  <span>Dark</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Light</span>
                </>
              )}
            </button>
          </div>

          <div className="p-3.5 rounded-md border border-[var(--border-color)] bg-[var(--bg-card-elevated)] space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-[var(--text-primary)]">Data Pipeline Mode</div>
                <div className="text-xs text-[var(--text-secondary)]">
                  {isSimulated
                    ? "Offline Deterministic Incident Demo (No API keys needed)"
                    : "Live API Integration (Sentinel Hub SAR & GFW AIS)"}
                </div>
              </div>
              <button
                onClick={() => setIsSimulated(!isSimulated)}
                className={`px-3 py-1.5 rounded font-medium border text-xs transition-colors ${
                  isSimulated
                    ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-400 hover:bg-emerald-900/50"
                    : "bg-blue-950/40 border-blue-800/60 text-blue-400 hover:bg-blue-900/50"
                }`}
              >
                {isSimulated ? "Demo Mode Active" : "Live API Mode"}
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-md border border-[var(--border-color)] bg-[var(--bg-card-elevated)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-[var(--text-primary)]">FastAPI Backend Status</span>
              <button
                onClick={verifyHealth}
                disabled={checking}
                className="flex items-center space-x-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${checking ? "animate-spin" : ""}`} />
                <span>Recheck</span>
              </button>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              {backendHealth?.status === "ok" ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-[var(--text-primary)] font-mono">
                    Operational — {backendHealth.service}
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-[var(--text-secondary)]">
                    {backendHealth?.message || "Checking backend connection..."}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="p-3.5 rounded-md border border-[var(--border-color)] bg-[var(--bg-card-elevated)] space-y-1.5 text-xs text-[var(--text-secondary)]">
            <div className="flex items-center justify-between">
              <span>Application Name</span>
              <span className="font-mono text-[var(--text-primary)]">Oceantrace-AI Desktop</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Environment</span>
              <span className="font-mono text-[var(--text-primary)]">Production PC Shell (Tauri)</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Target Bounding Box</span>
              <span className="font-mono text-[var(--text-primary)]">[68.5, 8.0, 71.5, 11.0]</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Disclaimer</span>
              <span className="font-mono text-emerald-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Decision Support Only
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-[var(--border-color)] bg-[var(--bg-card-elevated)] text-[var(--text-primary)] hover:bg-[var(--border-color)] font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
