export const valueFormatter = (amount: number, currency: string) => {
  amount = amount / 100;
  if (currency == 'eur') return `${amount.toFixed(2)}€`;
  else if (currency == 'usd') {
    return `$${amount.toFixed(2)}`;
  } else {
    return `${amount.toFixed(2)} ${currency.toUpperCase()}`;
  }
};
