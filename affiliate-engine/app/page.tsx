"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redireciona automaticamente da raiz (/) para o seu slug do produto
    router.replace("/p/protocolo-cristao");
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      {/* Um loading sutil simulando a conexão segura antes de redirecionar */}
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mb-4" />
      <p className="text-slate-400 text-sm tracking-wide animate-pulse">
        Conectando ao servidor seguro...
      </p>
    </div>
  );
}