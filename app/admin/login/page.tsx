"use client";

import { FormEvent, useState } from "react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error ?? "Mot de passe incorrect.");
        return;
      }

      window.location.href = "/admin";
    } catch {
      setError("Une erreur est survenue. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3e9d0] px-6 text-[#3a2c20]">
      <div className="w-full max-w-md">
        <div className="rounded-[2rem] border border-[#cfa97c]/30 bg-[#fff9eb] p-8 shadow-xl sm:p-10">
          <div className="text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#b67c43]">
              Administration
            </p>

            <h1 className="mt-3 font-display text-4xl">
              Coupe de Woof
            </h1>

            <p className="mt-3 text-sm text-[#3a2c20]/60">
              Connectez-vous pour gérer le site.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b67c43]">
                Mot de passe
              </span>

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Votre mot de passe"
                autoComplete="current-password"
                required
                className="mt-2 w-full rounded-xl border border-[#3a2c20]/10 bg-white px-4 py-3 outline-none transition focus:border-[#b67c43]"
              />
            </label>

            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-full bg-[#3a2c20] px-6 py-3.5 text-sm font-semibold text-[#f3e9d0] shadow-lg transition hover:bg-[#4a3828] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <a
            href="/"
            className="mt-6 block text-center text-xs font-semibold text-[#b67c43] hover:underline"
          >
            ← Retour au site
          </a>
        </div>
      </div>
    </main>
  );
}