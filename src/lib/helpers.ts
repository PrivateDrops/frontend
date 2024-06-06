export const valueFormatter = (amount: number, currency: string): string => {
  amount = amount / 100;
  if (currency == 'eur') return `${amount.toFixed(2)}€`;
  else if (currency == 'usd') {
    return `$${amount.toFixed(2)}`;
  } else {
    return `${amount.toFixed(2)} ${currency.toUpperCase()}`;
  }
};

export const errorFormatter = (response: any): string => {
  return (
    response?.error ||
    (Array.isArray(response?.message)
      ? response.message[0]
      : response?.message) ||
    'An unexpected error occurred'
  );
};
