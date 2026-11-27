export interface PostalCodeAddress {
  state: string;
  city: string;
  neighborhood: string;
}

/** Consulta o ViaCEP. Devolve null se o CEP não existir; lança erro em falha de rede. */
export async function lookupPostalCode(postalCode: string): Promise<PostalCodeAddress | null> {
  const response = await fetch(`https://viacep.com.br/ws/${postalCode}/json/`);
  if (!response.ok) throw new Error("Falha ao consultar o CEP.");

  const result = await response.json();
  if (result.erro) return null;

  return { state: result.uf, city: result.localidade, neighborhood: result.bairro };
}
