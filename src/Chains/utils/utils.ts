import { hexToNumber, bnToHex, hexToBigInt, u8aToHex } from "@polkadot/util";


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
  const balanceStr = balance.toString();
  // Remove commas and parse to integer.
  return parseInt(balanceStr, 10);
}

export function formatToFourDecimals(value: string) {
  // Convert to string and split by decimal
  const parts = value.toString().split(".");
  
  // If there are no decimals, return value as-is
  if (parts.length < 2) return value;
  
  // Otherwise, limit decimals to 4 and rejoin
  return parts[0] + "." + parts[1].slice(0, 4);
}



export function toUnit(balance: string | number, token_decimals: number): number {
  // console.log('[toUnit] balance', balance, token_decimals);
  if (balance === null || balance === undefined) {
    throw new Error('Received invalid balance: null or undefined');
  }

  // Initialize balanceStr based on balance type
  let balanceStr = typeof balance === "number" ? balance.toString() : balance;

  // remove commas
  // only apply replace if it's a string with a comma
  if (typeof balanceStr === "string" && balanceStr.includes(',')) {
    balanceStr = balanceStr.replace(/,/g, '');
  }
  const base = 10n;
  const exponent = BigInt(token_decimals);
  // console.log('[toUnit] exponent', exponent);
  const mod = base ** exponent;
  // console.log('[toUnit] mod', mod);
  let bi = BigInt(balanceStr);
  // console.log('toUnit bi', bi);
  var div = bi / mod;
  // console.log('toUnit div', div);
  return parseFloat(div.toString()) + parseFloat((bi - div * mod).toString()) / parseFloat(mod.toString());
}




