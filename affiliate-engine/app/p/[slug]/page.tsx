"use client";

import { useEffect, use } from "react";
import { supabase } from "@/lib/supabase";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductPage({ params }: PageProps) {
  // Desembrulha a Promise do params usando o hook 'use' do React (Padrão Next.js recente)
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
    
    // Mapeamento dos links de afiliado por slug
    const links: Record<string, string> = {
      "protocolo-cristao": "https://pay.kiwify.com.br/https://cristaosdehonra.com/protocolo",
      "outro-produto": "https://pay.kiwify.com.br/OUTRO_LINK",
    };

    // Redireciona para o link correspondente ou uma página padrão caso digitem errado
    window.location.href = links[slug] || "https://google.com";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
          Análise do {slug.replace(/-/g, " ")}
        </h1>
        
        <p className="text-gray-600 mb-8 text-sm leading-relaxed">
          Você está sendo redirecionado de forma segura para a página oficial do produto. 
          Clique no botão abaixo para ativar seu cupom e garantir sua vaga com desconto.
        </p>
        
        <button
          onClick={handleCheckout}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-all transform active:scale-95 shadow-lg shadow-green-100"
        >
          ACESSAR SITE OFICIAL AGORA
        </button>
        
        <p className="mt-6 text-xs text-gray-400">
          Pagamento processado de forma 100% segura via Kiwify.
        </p>
      </div>
    </div>
  );
}