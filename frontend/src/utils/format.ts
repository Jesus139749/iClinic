export function formatCnpj(cnpj: string): string {
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
}

export function formatAddress(a: {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}): string {
  const join = (parts: string[], separator: string) => parts.filter(Boolean).join(separator);

  return join(
    [
      join([a.street, a.number], ", "),
      join([a.complement, a.neighborhood], " - "),
      join([a.city, a.state], " - "),
    ],
    ", ",
  );
}

/** Minúsculas e sem acentos, para comparar textos em buscas. */
export function normalize(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
