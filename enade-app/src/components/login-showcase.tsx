"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const scenes = [
  {
    title: "Entre do seu jeito",
    text: "O acesso fica nesta tela. O menu só aparece depois que a conta entra.",
    image: "/undraw-welcome.svg",
    alt: "Pessoa sendo recebida, ilustração unDraw",
  },
  {
    title: "Simulado de múltipla escolha",
    text: "Cada tentativa embaralha as perguntas. Há sempre uma resposta correta.",
    image: "/undraw-online-test.svg",
    alt: "Pessoa fazendo uma prova online, ilustração unDraw",
  },
  {
    title: "Acerte e acompanhe",
    text: "Dá para refazer o mesmo simulado e ver a evolução dos acertos.",
    image: "/undraw-progress.svg",
    alt: "Acompanhamento de progresso, ilustração unDraw",
  },
  {
    title: "Treino, sem nota",
    text: "O simulado prepara para o ENADE. Ele não substitui a prova oficial.",
    image: "/undraw-studying.svg",
    alt: "Pessoa estudando com livros, ilustração unDraw",
  },
];

export function LoginShowcase() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const scene = scenes[index];

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % scenes.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <div className="flex h-full flex-col justify-between gap-8">
      <div>
        <p className="text-sm font-medium text-white/80">Preparação ENADE 2026</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">{scene.title}</h2>
        <p className="mt-3 max-w-md text-sm leading-6 text-white/80">{scene.text}</p>
      </div>
      <Image
        key={scene.image}
        src={scene.image}
        alt={scene.alt}
        width={720}
        height={540}
        unoptimized
        className="mx-auto h-auto w-full max-w-md rounded-md bg-white/95 p-4"
      />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {scenes.map((item, itemIndex) => {
          const active = itemIndex === index;
          return (
            <button
              key={item.image}
              type="button"
              onClick={() => {
                setIndex(itemIndex);
                setPaused(true);
              }}
              className={`rounded-md px-3 py-3 text-left text-xs font-medium ${
                active ? "bg-white text-[#5430e0]" : "bg-white/15 text-white hover:bg-white/25"
              }`}
            >
              {item.title}
            </button>
          );
        })}
      </div>
    </div>
  );
}
