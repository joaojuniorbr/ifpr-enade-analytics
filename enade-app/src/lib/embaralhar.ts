export function embaralhar<T>(itens: readonly T[]): T[] {
  const copia = [...itens];
  for (let i = copia.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const atual = copia[i] as T;
    copia[i] = copia[j] as T;
    copia[j] = atual;
  }
  return copia;
}

export function letraAlternativa(indice: number): string {
  return String.fromCharCode(65 + indice);
}
