"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <div className="flex min-h-screen">
      {/* Marka paneli */}
      <div
        className="relative hidden w-1/2 flex-col items-center justify-center overflow-hidden px-10 md:flex"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, #2a251c 0%, #15130f 55%, #0d0c09 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, #c9a24c 0px, #c9a24c 1px, transparent 1px, transparent 48px)",
          }}
        />
        <div className="relative z-10 flex flex-col items-center text-center">
          <img
            src="/qr-menu/godz-logo.png"
            alt="GODZ Cafe & Restaurant"
            className="w-40 drop-shadow-[0_6px_18px_rgba(0,0,0,0.45)]"
          />
          <p className="mt-6 text-[0.7rem] font-light uppercase tracking-[0.3em] text-[#a79c87]">
            Lezzetle, buluştuğunuz yer
          </p>
          <div className="mt-10 h-px w-16 bg-[#3a3327]" />
          <p className="mt-10 max-w-xs text-sm leading-relaxed text-[#a79c87]">
            Menünüzdeki ürünleri, fiyatları ve kategorileri buradan
            yönetin — değişiklikler QR menünüze anında yansır.
          </p>
        </div>
      </div>

      {/* Giriş formu */}
      <div className="flex w-full flex-1 items-center justify-center bg-neutral-50 px-6 py-12 md:w-1/2">
        <div className="w-full max-w-sm">
          <img
            src="/qr-menu/godz-logo.png"
            alt="GODZ Cafe & Restaurant"
            className="mx-auto mb-8 w-24 md:hidden"
          />

          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-neutral-900">
              Tekrar hoş geldiniz
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Menü yönetim panelinize giriş yapın.
            </p>
          </div>

          <form action={formAction} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                E-posta
              </label>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="admin@restoran.com"
                className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none transition focus:border-[#c9a24c] focus:ring-2 focus:ring-[#c9a24c]/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                Şifre
              </label>
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none transition focus:border-[#c9a24c] focus:ring-2 focus:ring-[#c9a24c]/20"
              />
            </div>

            {state.error && (
              <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-600">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-xl bg-[#15130f] px-3.5 py-2.5 text-sm font-medium text-[#efe6d2] shadow-sm transition hover:bg-[#2a251c] disabled:opacity-50"
            >
              {pending ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
