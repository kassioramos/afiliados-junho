"use client";

import { useEffect, use } from "react";
import { supabase } from "@/lib/supabase";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductPage({ params }: PageProps) {
  const { slug } = use(params);

  // 1. Registrar a visualização assim que a página carrega
  useEffect(() => {
    const trackView = async () => {
      try {
        await supabase.from("analytics").insert([
          { 
            product_slug: slug, 
            event_type: "view", 
            user_agent: typeof window !== "undefined" ? navigator.userAgent : "server" 
          },
        ]);
      } catch (error) {
        console.error("Erro ao computar visualização:", error);
      }
    };
    
    trackView();
  }, [slug]);

  // 2. Função para registrar o clique antes de ir para a Kiwify
  const handleCheckout = async () => {
    try {
      await supabase.from("analytics").insert([
        { 
          product_slug: slug, 
          event_type: "click", 
          user_agent: typeof window !== "undefined" ? navigator.userAgent : "server" 
        },
      ]);
    } catch (error) {
      console.error("Erro ao computar clique:", error);
    }
    
    // Mapeamento dos links de afiliado reais por slug
    const links: Record<string, string> = {
      "protocolo-cristao": "https://pay.kiwify.com.br/P9j2gSg?afid=fpkEcVui",
      "super-presell": "https://superpresell.top/site-oficial/?utm_source=seu_afid_aqui", 
    };

    // Redireciona ou usa fallback seguro
    window.location.href = links[slug] || "https://google.com";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 antialiased selection:bg-emerald-500/30">
      {/* Background decorativo sutil */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08),transparent_50%)] pointer-events-none" />

      <div className="max-w-md w-full bg-slate-900/60 backdrop-blur-md p-8 rounded-2xl border border-slate-800/80 shadow-2xl relative z-10 text-center">
        
        {/* Ícone de Escudo / Segurança */}
        <div className="mx-auto w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 border border-emerald-500/20">
          <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>

        <span className="text-xs font-semibold text-emerald-400 tracking-widest uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          Conexão Segura Ativa
        </span>

        <h1 className="text-xl font-bold text-white mt-4 mb-3 uppercase tracking-wide">
          Verificando {slug.replace(/-/g, " ")}
        </h1>
        
        <p className="text-slate-400 mb-8 text-sm leading-relaxed">
          Sua requisição foi criptografada. Clique no botão abaixo para ativar seu cupom exclusivo e ser direcionado com segurança para a página oficial.
        </p>
        
        <button
          onClick={handleCheckout}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-all transform active:scale-98 shadow-lg shadow-emerald-900/40 hover:shadow-emerald-500/20 uppercase tracking-wider text-sm animate-pulse hover:animate-none"
        >
          Ir Para o Site Oficial Now
        </button>
        
        <div className="mt-6 pt-6 border-t border-slate-800/60 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <svg className="w-3.5 h-3.5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          Checkout verificado e processado com segurança.
        </div>
      </div>
    </div>
  );
}