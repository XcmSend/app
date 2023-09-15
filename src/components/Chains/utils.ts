export function adjustBalance(balance: number, tokenDecimals: number): string {
  if (typeof balance === 'undefined' || balance === null) {
    return "0"; // or whatever default value you wish to return for undefined balances
}
  // Convert number to string without any commas or other formatting
  const rawBalanceStr = balance.toString().replace(/,/g, '');

  if (tokenDecimals === 0) return rawBalanceStr;

  if (rawBalanceStr.length <= tokenDecimals) {
    return '0.' + rawBalanceStr.padStart(tokenDecimals, '0');
  } else {
    const beforeDecimal = rawBalanceStr.slice(0, -tokenDecimals);
    const afterDecimal = rawBalanceStr.slice(-tokenDecimals);
    return beforeDecimal + '.' + afterDecimal;
  }
}

export function parseBalanceString(balance: number): number {
  // Remove commas and parse to integer.
  return parseInt(balance.replace(/,/g, ''), 10);
}

export function formatToFourDecimals(value) {
  // Convert to string and split by decimal
  const parts = value.toString().split(".");
  
  // If there are no decimals, return value as-is
  if (parts.length < 2) return value;
  
  // Otherwise, limit decimals to 4 and rejoin
  return parts[0] + "." + parts[1].slice(0, 4);
}




