// Here is all the static pills data, which does not include the pills which are produced from nodes. 

import { bool } from "@polkadot/types-codec";
import { text } from "stream/consumers";

interface Pill {
  name: string;
  group: string;
  type: PillType;
  class: PillClass;
}

enum PillType {
  Bool = "bool",
  Number = "number",
  String = "string",
}

export enum PillGroup {
  Logic = "logic",
  Math = "math",
  General = "general",
  TextBinary = "text-binary",
  CryptoHash = "cryptoc-hash",
  Array = "array",
  Collection = "collection",
  DateTime = "date-time",
}

export enum PillClass {
  Operand = "operand",
  Keyword = "keyword",
  Math = "math",  
  Variable = "variable",
  Function = "function",
}

interface PillDescription {
  description?: string;
  example?: string;
  expression?: string;
  function?: string;
  returnType?: string;
}

// Interface for the generic structure of a pill, including dynamic function start pills
interface PillBlockType {
  name: string;
  class: string;
  group: string;
  type: string;
}

// Extension for function start pills with a dynamic name composition method
interface FunctionStartPill extends PillBlockType {
  composeName: (baseName: string) => string;
}

interface FunctionBlockItem {
  type: "functionStart" | "functionClose" | "separator";
  baseName?: string; // Only for functionStart
  class: string;
  group: string;
}

type FunctionBlocks = Record<string, FunctionBlockItem[]>;

interface PillBlockTypes {
  separator: PillBlockType;
  functionClose: PillBlockType;
  functionStart: FunctionStartPill; 
}


export const pillBlockTypes: PillBlockTypes = {
  separator: { name: ";", class: "func separator", group: "general", type: "*" },
  functionClose: { name: ")", class: "func end", group: "general-logic", type: "*"  },
  functionStart: {
    name: "(", 
    class: "func begin",
    group: "general-logic",
    type: "*" ,
    // Implementation of dynamic name composition for function start pills
    composeName: composeFunctionStartName,
  },
};

function createPill(name: string, group: PillGroup, type: PillType, pillClass: PillClass): Pill {
  return { name, group, type, class: pillClass };
}

function composeFunctionStartName(baseName: string): string {
  return `${baseName}(`;
}

function createFunctionBlock(functionName: string, numArgs: number, pillBlockTypes: PillBlockTypes, overrides?: Partial<PillBlockType>): FunctionBlockItem[] {
  const functionMainName = functionName;
  const composedName = composeFunctionStartName(functionName);
 // console.log("composedName", composedName);

  // Apply overrides or use defaults for function start
    const functionStartOverrides = overrides ? { ...pillBlockTypes.functionStart, ...overrides, name: composedName } : { ...pillBlockTypes.functionStart, name: composedName };
  
  const block: FunctionBlockItem[] = [
    { ...functionStartOverrides, baseName: functionName, type: "functionStart" },
  ];

  // Add separators if there are more than one arguments, applying separator overrides if provided
  for (let i = 1; i < numArgs; i++) {
    const separatorOverrides = overrides ? { ...pillBlockTypes.separator, ...overrides } : pillBlockTypes.separator;
    block.push({ ...separatorOverrides, type: "separator" });
  }

  // Apply overrides or use defaults for function close
  const functionCloseOverrides = overrides ? { ...pillBlockTypes.functionClose, ...overrides } : pillBlockTypes.functionClose;
  block.push({ ...functionCloseOverrides, type: "functionClose" });

  return block;
}





export const logicFunctionBlocks: FunctionBlocks = {
  "if-else":  createFunctionBlock("if", 3, pillBlockTypes, { class: "function", group: "general", type: "*" }), // 2 separators indicate 3 parts in the "if" construct
  "switch":   createFunctionBlock("switch", 2, pillBlockTypes, { class: "function", group: "general", type: "*" }), // Adjusted for illustrative purposes
  "if-empty": createFunctionBlock("ifempty", 2, pillBlockTypes, { class: "function", group: "general", type: "*" }), // 1 separator for the "ifempty" construct
  "( )":      createFunctionBlock("( )", 1, pillBlockTypes, { class: "function", group: "general", type: "*" }),
  "omit":     createFunctionBlock("omit", 1, pillBlockTypes, { class: "function", group: "general", type: "*" }),
  "pick":     createFunctionBlock("pick", 1, pillBlockTypes, { class: "function", group: "general", type: "*" }),
};


export const mathFunctionBlocks: Record<string, FunctionBlockItem[]> = {
  abs:          createFunctionBlock("abs", 1,     pillBlockTypes, { class: "function", group: "math", type: "number" }),
  ceil:         createFunctionBlock("ceil", 1,    pillBlockTypes, { class: "function", group: "math", type: "number" }),
  floor:        createFunctionBlock("floor", 1,   pillBlockTypes, { class: "function", group: "math", type: "number" }),
  round:        createFunctionBlock("round", 1,   pillBlockTypes, { class: "function", group: "math", type: "number" }),
  max:          createFunctionBlock("max", 2,     pillBlockTypes, { class: "function", group: "math", type: "number" }),
  min:          createFunctionBlock("min", 2,          pillBlockTypes, { class: "function", group: "math", type: "number" }),
  parseNumber:  createFunctionBlock("parseNumber", 1,  pillBlockTypes, { class: "function", group: "math", type: "number" }),
  parseFloat:   createFunctionBlock("parseFloat", 1,   pillBlockTypes, { class: "function", group: "math", type: "number" }),
  formatNumber: createFunctionBlock("formatNumber", 2, pillBlockTypes, { class: "function", group: "math", type: "number" }),
  average:      createFunctionBlock("average", 2, pillBlockTypes, { class: "function", group: "math", type: "number" }),
  pow:          createFunctionBlock("pow", 2,     pillBlockTypes, { class: "function", group: "math", type: "number" }),
  sqrt:         createFunctionBlock("sqrt", 1,    pillBlockTypes, { class: "function", group: "math", type: "number" }),
  random:       createFunctionBlock("random", 0,  pillBlockTypes, { class: "function", group: "math", type: "number" }),
  sin:          createFunctionBlock("sin", 1,     pillBlockTypes, { class: "function", group: "math", type: "number" }),
  cos:          createFunctionBlock("cos", 1,     pillBlockTypes, { class: "function", group: "math", type: "number" }),
  tan:          createFunctionBlock("tan", 1,     pillBlockTypes, { class: "function", group: "math", type: "number" }),
  asin:         createFunctionBlock("asin", 1,    pillBlockTypes, { class: "function", group: "math", type: "number" }),
  acos:         createFunctionBlock("acos", 1,    pillBlockTypes, { class: "function", group: "math", type: "number" }),
  atan:         createFunctionBlock("atan", 1,    pillBlockTypes, { class: "function", group: "math", type: "number" }),
  atan2:        createFunctionBlock("atan2", 2,   pillBlockTypes, { class: "function", group: "math", type: "number" }),
  log:          createFunctionBlock("log", 1,     pillBlockTypes, { class: "function", group: "math", type: "number" }),
  exp:          createFunctionBlock("exp", 1,     pillBlockTypes, { class: "function", group: "math", type: "number" }),
};

export const textBinaryFunctionBlocks: Record<string, FunctionBlockItem[]> = {
  length:         createFunctionBlock("length", 1,      pillBlockTypes, { class: "function", group: "text-binary", type: "number" }),  
  lower:          createFunctionBlock("lower", 1,       pillBlockTypes, { class: "function", group: "text-binary", type: "text" }),
  upper:          createFunctionBlock("upper", 1,       pillBlockTypes, { class: "function", group: "text-binary", type: "text" }),
  ascii:          createFunctionBlock("ascii", 1,       pillBlockTypes, { class: "function", group: "text-binary", type: "text" }),
  substring:      createFunctionBlock("substring", 3,   pillBlockTypes, { class: "function", group: "text-binary", type: "text" }),
  indexOf:        createFunctionBlock("indexOf", 2,     pillBlockTypes, { class: "function", group: "text-binary", type: "number" }),
  char:           createFunctionBlock("char", 1,        pillBlockTypes, { class: "function", group: "text-binary", type: "text" }),
  toBinary:       createFunctionBlock("toBinary", 1,    pillBlockTypes, { class: "function", group: "text-binary", type: "text" }),
  toString:       createFunctionBlock("toString", 1,    pillBlockTypes, { class: "function", group: "text-binary", type: "text" }),
  encodeURL:      createFunctionBlock("encodeURL", 1,   pillBlockTypes, { class: "function", group: "text-binary", type: "text" }),
  decodeURL:      createFunctionBlock("decodeURL", 1,   pillBlockTypes, { class: "function", group: "text-binary", type: "text" }),
  escapeHTML:     createFunctionBlock("escapeHTML", 1,  pillBlockTypes, { class: "function", group: "text-binary", type: "text" }),
  escapeMarkdown: createFunctionBlock("escapeMarkdown", 1, pillBlockTypes, { class: "function", group: "text-binary", type: "text" }),
  concat:         createFunctionBlock("concat", 2,      pillBlockTypes, { class: "function", group: "text-binary", type: "text" }),
  stripHTML:      createFunctionBlock("stripHTML", 1,   pillBlockTypes, { class: "function", group: "text-binary", type: "text" }),
  contains:       createFunctionBlock("contains", 2,    pillBlockTypes, { class: "function", group: "text-binary", type: "bool" }),
  split:          createFunctionBlock("split", 2,       pillBlockTypes, { class: "function", group: "text-binary", type: "array" }),
  trim:           createFunctionBlock("trim", 1,        pillBlockTypes, { class: "function", group: "text-binary", type: "text" }),
  replace:        createFunctionBlock("replace", 3,     pillBlockTypes, { class: "function", group: "text-binary", type: "text" }),
  join:           createFunctionBlock("join", 2,        pillBlockTypes, { class: "function", group: "text-binary", type: "text" }),
  lastIndexOf:    createFunctionBlock("lastIndexOf", 2, pillBlockTypes, { class: "function", group: "text-binary", type: "number" }),
  startsWith:     createFunctionBlock("startsWith", 2,  pillBlockTypes, { class: "function", group: "text-binary", type: "bool" }),
  endsWith:       createFunctionBlock("endsWith", 2,    pillBlockTypes, { class: "function", group: "text-binary", type: "bool" }),

}

export const encodeFunctionBlocks: Record<string, FunctionBlockItem[]> = {
  encodeBase64: createFunctionBlock("encodeBase64", 1, pillBlockTypes, { class: "function", group: "text-binary", type: "text" }),
  encodeBytes:  createFunctionBlock("encodeBytes", 1, pillBlockTypes, { class: "function", group: "text-binary", type: "text" }),
  decodeBase64: createFunctionBlock("decodeBase64", 1, pillBlockTypes, { class: "function", group: "text-binary", type: "text" }),
  decodeBytes:  createFunctionBlock("decodeBytes", 1, pillBlockTypes, { class: "function", group: "text-binary", type: "text" }),
  encodeHex:    createFunctionBlock("encodeHex", 1, pillBlockTypes, { class: "function", group: "text-binary", type: "text" }),
  decodeHex:    createFunctionBlock("decodeHex", 1, pillBlockTypes, { class: "function", group: "text-binary", type: "text" }),
  encodeBase58: createFunctionBlock("encodeBase58", 1, pillBlockTypes, { class: "function", group: "text-binary", type: "text" }),
  decodeBase58: createFunctionBlock("decodeBase58", 1, pillBlockTypes, { class: "function", group: "text-binary", type: "text" }),
  toHex:        createFunctionBlock("toHex", 1, pillBlockTypes, { class: "function", group: "text-binary", type: "text" }),
}

export const formatConversionFunctionBlocks: Record<string, FunctionBlockItem[]> = {
  bytesToHex:    createFunctionBlock("bytesToHex", 1, pillBlockTypes, { class: "function", group: "crypto-hash", type: "text" }),
  hexToBytes:    createFunctionBlock("hexToBytes", 1, pillBlockTypes, { class: "function", group: "crypto-hash", type: "text" }),
  balanceToHex:   createFunctionBlock("balanceToHex", 1, pillBlockTypes, { class: "function", group: "crypto-hash", type: "text" }),
  hexToBalance:  createFunctionBlock("hexToBalance", 1, pillBlockTypes, { class: "function", group: "crypto-hash", type: "text" }),
  accountIdToHex: createFunctionBlock("accountIdToHex", 1, pillBlockTypes, { class: "function", group: "crypto-hash", type: "text" }),
  hexToAccountId: createFunctionBlock("hexToAccountId", 1, pillBlockTypes, { class: "function", group: "crypto-hash", type: "text" }),
  stringToHex:   createFunctionBlock("stringToHex", 1, pillBlockTypes, { class: "function", group: "crypto-hash", type: "text" }),
  hexToString:   createFunctionBlock("hexToString", 1, pillBlockTypes, { class: "function", group: "crypto-hash", type: "text" }),
  u8ArrayToHex: createFunctionBlock("u8ArrayToHex", 1, pillBlockTypes, { class: "function", group: "crypto-hash", type: "text" }),


}


export const cryptographicHashFunctionBlocks: Record<string, FunctionBlockItem[]> = {
  sha256:        createFunctionBlock("sha256", 1, pillBlockTypes, { class: "function", group: "crypto-hash", type: "text" }),
  sha512:        createFunctionBlock("sha512", 1, pillBlockTypes, { class: "function", group: "crypto-hash", type: "text" }),
  ed25519:       createFunctionBlock("ed25519", 1, pillBlockTypes, { class: "function", group: "crypto-hash", type: "text" }),
  sr25519:       createFunctionBlock("sr25519", 1, pillBlockTypes, { class: "function", group: "crypto-hash", type: "text" }),
  blake2ToString: createFunctionBlock("blake2ToString", 2, pillBlockTypes, { class: "function", group: "crypto-hash", type: "text" }),
  blake2ConcatAString: createFunctionBlock("blake2ConcatAString", 3, pillBlockTypes, { class: "function", group: "crypto-hash", type: "text" }),
  xXhashAString: createFunctionBlock("xXhashAString", 2, pillBlockTypes, { class: "function", group: "crypto-hash", type: "text" }),
  xXhashConcatAString: createFunctionBlock("xXhashConcatAString", 3, pillBlockTypes, { class: "function", group: "crypto-hash", type: "text" }),
  seedToAddress: createFunctionBlock("seedToAddress", 1, pillBlockTypes, { class: "function", group: "crypto-hash", type: "text" }),
  pbkdf2:        createFunctionBlock("pbkdf2", 4, pillBlockTypes, { class: "function", group: "crypto-hash", type: "text" }),
  bcrypt:        createFunctionBlock("bcrypt", 2, pillBlockTypes, { class: "function", group: "crypto-hash", type: "text" }),
  scrypt:        createFunctionBlock("scrypt", 6, pillBlockTypes, { class: "function", group: "crypto-hash", type: "text" }),
  sign:          createFunctionBlock("sign", 2, pillBlockTypes, { class: "function", group: "crypto-hash", type: "text" }),
  verify:        createFunctionBlock("verify", 3, pillBlockTypes, { class: "function", group: "crypto-hash", type: "text" }),
  encrypt:       createFunctionBlock("encrypt", 2, pillBlockTypes, { class: "function", group: "crypto-hash", type: "text" }),
  decrypt:       createFunctionBlock("decrypt", 2, pillBlockTypes, { class: "function", group: "crypto-hash", type: "text" }),
  secp256k1:     createFunctionBlock("secp256k1", 1, pillBlockTypes, { class: "function", group: "crypto-hash", type: "text" }),
  blake2b:       createFunctionBlock("blake2b", 1, pillBlockTypes, { class: "function", group: "crypto-hash", type: "text" }),
  blake2s:       createFunctionBlock("blake2s", 1, pillBlockTypes, { class: "function", group: "crypto-hash", type: "text" }),
  keccak256:     createFunctionBlock("keccak256", 1, pillBlockTypes, { class: "function", group: "crypto-hash", type: "text" }),
  keccak512:     createFunctionBlock("keccak512", 1, pillBlockTypes, { class: "function", group: "crypto-hash", type: "text" }),
  sha3:          createFunctionBlock("sha3", 1, pillBlockTypes, { class: "function", group: "crypto-hash", type: "text" }),
  ripemd160:     createFunctionBlock("ripemd160", 1, pillBlockTypes, { class: "function", group: "crypto-hash", type: "text" }),
  whirlpool:     createFunctionBlock("whirlpool", 1, pillBlockTypes, { class: "function", group: "crypto-hash", type: "text" }),
  tiger:         createFunctionBlock("tiger", 1, pillBlockTypes, { class: "function", group: "crypto-hash", type: "text" }),
  gost:          createFunctionBlock("gost", 1, pillBlockTypes, { class: "function", group: "crypto-hash", type: "text" }),
  crc32:         createFunctionBlock("crc32", 1, pillBlockTypes, { class: "function", group: "crypto-hash", type: "text" }),
  crc64:         createFunctionBlock("crc64", 1, pillBlockTypes, { class: "function", group: "crypto-hash", type: "text" }),
  xxhash:        createFunctionBlock("xxhash", 1, pillBlockTypes, { class: "function", group: "crypto-hash", type: "text" }),
  decodeXxhash:  createFunctionBlock("decodeXxhash", 1, pillBlockTypes, { class: "function", group: "crypto-hash", type: "text" }),
  decodeBlake2b: createFunctionBlock("decodeBlake2b", 1, pillBlockTypes, { class: "function", group: "crypto-hash", type: "text" }),
  md5:           createFunctionBlock("md5", 1, pillBlockTypes, { class: "function", group: "crypto-hash", type: "text" }),
  sha1:          createFunctionBlock("sha1", 1, pillBlockTypes, { class: "function", group: "crypto-hash", type: "text" }),
  hmac:          createFunctionBlock("hmac", 2, pillBlockTypes, { class: "function", group: "crypto-hash", type: "text" }),

};




export const dateTimeFunctionBlocks: Record<string, FunctionBlockItem[]> = {
  addSeconds: createFunctionBlock("addSeconds", 2, pillBlockTypes, { class: "function", group: "date-time", type: "date" }),
  addMinutes: createFunctionBlock("addMinutes", 2, pillBlockTypes, { class: "function", group: "date-time", type: "date" }),
  addHours:   createFunctionBlock("addHours", 2, pillBlockTypes, { class: "function", group: "date-time", type: "date" }),
  addDays:    createFunctionBlock("addDays", 2, pillBlockTypes, { class: "function", group: "date-time", type: "date" }),
  addMonths:  createFunctionBlock("addMonths", 2, pillBlockTypes, { class: "function", group: "date-time", type: "date" }),
  addYears:   createFunctionBlock("addYears", 2, pillBlockTypes, { class: "function", group: "date-time", type: "date" }),
  setMinute:  createFunctionBlock("setMinute", 2, pillBlockTypes, { class: "function", group: "date-time", type: "date" }),
  setHour:    createFunctionBlock("setHour", 2, pillBlockTypes, { class: "function", group: "date-time", type: "date" }),
  setDay:     createFunctionBlock("setDay", 2, pillBlockTypes, { class: "function", group: "date-time", type: "date" }),
  setMonth:   createFunctionBlock("setMonth", 2, pillBlockTypes, { class: "function", group: "date-time", type: "date" }),
  setYear:    createFunctionBlock("setYear", 2, pillBlockTypes, { class: "function", group: "date-time", type: "date" }),
  formatDate: createFunctionBlock("formatDate", 2, pillBlockTypes, { class: "function", group: "date-time", type: "string" }),
  parseDate:  createFunctionBlock("parseDate", 1, pillBlockTypes, { class: "function", group: "date-time", type: "date" }),
};



export const arrayFunctionBlocks: Record<string, FunctionBlockItem[]> = {
  includes:     createFunctionBlock("includes", 2,   pillBlockTypes, { class: "function", group: "array", type: "bool" }),
  slice:        createFunctionBlock("slice", 3,      pillBlockTypes, { class: "function", group: "array", type: "array" }),
  merge:        createFunctionBlock("merge", 2,      pillBlockTypes, { class: "function", group: "array", type: "array" }),
  reverse:      createFunctionBlock("reverse", 1,    pillBlockTypes, { class: "function", group: "array", type: "array" }),
  sort:         createFunctionBlock("sort", 1,       pillBlockTypes, { class: "function", group: "array", type: "array" }),
  unique:       createFunctionBlock("unique", 1,     pillBlockTypes, { class: "function", group: "array", type: "array" }),
  filter:       createFunctionBlock("filter", 2,     pillBlockTypes, { class: "function", group: "array", type: "array" }),
  map:          createFunctionBlock("map", 2,        pillBlockTypes, { class: "function", group: "array", type: "array" }),
  reduce:       createFunctionBlock("reduce", 2,     pillBlockTypes, { class: "function", group: "array", type: "*" }),
  forEach:      createFunctionBlock("forEach", 2,    pillBlockTypes, { class: "function", group: "array", type: "*" }),
  find:         createFunctionBlock("find", 2,       pillBlockTypes, { class: "function", group: "array", type: "*" }),
  findIndex:    createFunctionBlock("findIndex", 2,  pillBlockTypes, { class: "function", group: "array", type: "number" }),
  some:         createFunctionBlock("some", 2,       pillBlockTypes, { class: "function", group: "array", type: "bool" }),
  every:        createFunctionBlock("every", 2,      pillBlockTypes, { class: "function", group: "array", type: "bool" }),
  fill:         createFunctionBlock("fill", 2,       pillBlockTypes, { class: "function", group: "array", type: "array" }),
  first:        createFunctionBlock("first", 1,      pillBlockTypes, { class: "function", group: "array", type: "*" }),
  last:         createFunctionBlock("last", 1,       pillBlockTypes, { class: "function", group: "array", type: "*" }),
  flatten:      createFunctionBlock("flatten", 1,    pillBlockTypes, { class: "function", group: "array", type: "array" }),
  distinct:     createFunctionBlock("distinct", 1,     pillBlockTypes, { class: "function", group: "array", type: "array" }),
  deduplicate:  createFunctionBlock("deduplicate", 1,  pillBlockTypes, { class: "function", group: "array", type: "array" }),
  toCollection: createFunctionBlock("toCollection", 1, pillBlockTypes, { class: "function", group: "array", type: "collection" }),
  toArray:      createFunctionBlock("toArray", 1,      pillBlockTypes, { class: "function", group: "array", type: "array" }),
  emptyArray:   createFunctionBlock("emptyArray", 0,   pillBlockTypes, { class: "keyword", group: "array", type: "*" }),
};


export const collectionFunctionBlocks: Record<string, FunctionBlockItem[]> = {

}

export const functionBlocks: FunctionBlocks = {
  ...logicFunctionBlocks,
  ...mathFunctionBlocks,
  ...textBinaryFunctionBlocks,
  ...encodeFunctionBlocks,
  ...formatConversionFunctionBlocks,
  ...cryptographicHashFunctionBlocks,
  ...arrayFunctionBlocks,
  ...collectionFunctionBlocks,
  ...dateTimeFunctionBlocks,
};


export const operandPills: Record<string, Pill> = {
  "=":   createPill("=",     PillGroup.Logic, PillType.Bool,   PillClass.Operand),
  "!=":  createPill("!=",    PillGroup.Logic, PillType.Bool,   PillClass.Operand),
  "AND": createPill("AND",   PillGroup.Logic, PillType.Bool,   PillClass.Operand),
  "OR":  createPill("OR",    PillGroup.Logic, PillType.Bool,   PillClass.Operand),
  "XOR": createPill("XOR",   PillGroup.Logic, PillType.Bool,   PillClass.Operand),
  "!":   createPill("!",     PillGroup.Logic, PillType.Bool,   PillClass.Operand),
  ">":   createPill(">",     PillGroup.Math,  PillType.Bool,   PillClass.Operand),
  "<":   createPill("<",     PillGroup.Math,  PillType.Bool,   PillClass.Operand),
  ">=":  createPill(">=",    PillGroup.Math,  PillType.Bool,   PillClass.Operand),
  "<=":  createPill("<=",    PillGroup.Math,  PillType.Bool,   PillClass.Operand),
  "*":   createPill("*",     PillGroup.Math,  PillType.Number, PillClass.Operand),
  "/":   createPill("/",     PillGroup.Math,  PillType.Number, PillClass.Operand),
  "+":   createPill("+",     PillGroup.Math,  PillType.Number, PillClass.Operand),
  "-":   createPill("-",     PillGroup.Math,  PillType.Number, PillClass.Operand),
  "mod": createPill("mod",   PillGroup.Math,  PillType.Number, PillClass.Operand),
};

export const keywordPills: Record<string, Pill> = {
  true:      createPill("true",      PillGroup.Logic,   PillType.Bool, PillClass.Keyword),
  false:     createPill("false",     PillGroup.Logic,   PillType.Bool, PillClass.Keyword),
  empty:     createPill("empty",     PillGroup.General, PillType.Bool, PillClass.Keyword),
  erase:     createPill("erase",     PillGroup.General, PillType.Bool, PillClass.Keyword),
  null:      createPill("null",      PillGroup.General, PillType.Bool, PillClass.Keyword),
  undefined: createPill("undefined", PillGroup.General, PillType.Bool, PillClass.Keyword),
  NaN:       createPill("NaN",       PillGroup.General, PillType.Bool, PillClass.Keyword),
  timestamp: createPill("timestamp", PillGroup.DateTime, PillType.Number, PillClass.Keyword),
  now:       createPill("now",       PillGroup.DateTime, PillType.Number, PillClass.Keyword),
  space:     createPill("space",     PillGroup.General, PillType.String, PillClass.Keyword),
  nbsp:           createPill("nbsp", PillGroup.General, PillType.String, PillClass.Keyword),
  tab:            createPill("tab",  PillGroup.General, PillType.String, PillClass.Keyword),
  emptystring:    createPill("emptystring", PillGroup.General, PillType.String, PillClass.Keyword),
  newline:        createPill("newline", PillGroup.General, PillType.String, PillClass.Keyword),
  carriagereturn: createPill("carriagereturn", PillGroup.General, PillType.String, PillClass.Keyword),
};

export const variablePills: Record<string, Pill> = {
  uuid:           createPill("uuid", PillGroup.General, PillType.String, PillClass.Variable),
  executionId:    createPill("executionId", PillGroup.General, PillType.String, PillClass.Variable),
  scenarioId:     createPill("scenarioId", PillGroup.General, PillType.String, PillClass.Variable),
  
};





export const pillDescriptions: Record<string, PillDescription> = {
  // logicBlockDescriptions
  "if-else": {
    description: "if(logical expression; output 1; output 2) This function returns 'output 1', if the expression evaluates to true, else it returns 'output 2'.",
    example: "if(a > b; 'a is greater'; 'b is greater or equal')",
    function: "if(expression; output1; output2)",
    returnType: "*", // "*" indicates that the return type is dynamic
  },
  "switch": {
    description: "switch(expression; case1; case2) This function returns the value of the first case that is true. You can add more cases by adding more semicolons.",
    example: "switch(a; 'A'; 'B'; 'C'; 'D')",
    function: "switch(expression; case1; case2; ...; caseN)",
    returnType: "*",
  },
  "if-empty": {
    description: "ifempty(expression; output) This function returns 'output' if the expression is empty.",
    example: "ifempty(a; 'a is empty')",
    function: "ifempty(expression; output)",
    returnType: "*",
  },
  "( )": {
    description: "Parentheses are used to group expressions and control the order of evaluation.",
    example: "(a + b) * c",
    function: "(expression)",
    returnType: "*",
  },
  "omit": {
    description: "omit(object; key1; [key2; ...]) collection Omits the given keys of the object and returns the rest.",
    example: "omit({a: 1, b: 2, c: 3}; 'a'; 'b')",
    function: "omit(object; key1; [key2; ...])",
    returnType: "*",
  },
  "pick": {
    description: "pick(object; key1; [key2; ...]) collection Picks the given keys of the object and returns them. (opposite of 'pick')",
    example: "pick({a: 1, b: 2, c: 3}; 'a'; 'b')",
    function: "pick(object; key1; [key2; ...])",
    returnType: "*",
  },

  // operandDescriptions
  "=": {
    description: "Equal to",
    example: "a = b",
    function: "a = b",
    returnType: "bool",
  },
  "!=": {
    description: "Not equal to",
    example: "a != b",
    function: "a != b",
    returnType: "bool",

  },
  AND: {
    description: "Logical AND &&",
    example: "a AND b",
    function: "&",
    returnType: "bool",
  },
  OR: {
    description: "Logical OR ||",
    example: "a OR b",
    function: "|",
    returnType: "bool",
  },
  XOR: {
    description: "Logical XOR is true if exactly one of the operands is true.",
    example: "a XOR b",
    function: "^",
    returnType: "bool",
  },
  "!": {
    description: "Logical NOT",
    example: "!a",
    function: "!",
    returnType: "bool",
  },

  // Math descriptions
  "*": {
    description: "Multiplication",
    example: "a * b",
    function: "*",
    returnType: "number | integer",
  },
  "/": {
    description: "Division",
    example: "a / b",
    function: "/",
    returnType: "number | integer",
  },
  "+": {
    description: "Addition",
    example: "a + b",
    function: "+",
    returnType: "number | integer",
  },
  "-": {
    description: "Subtraction",
    example: "a - b",
    function: "-",
    returnType: "number | integer",
  },
  ">": {
    description: "Greater than",
    example: "a > b",
    function: ">",
    returnType: "bool",
  },
  "<": {
    description: "Less than",
    example: "a < b",
    function: "<",
    returnType: "bool",
  },
  ">=": {
    description: "Greater than or equal to",
    example: "a >= b",
    function: ">=",
    returnType: "bool",
  },
  "<=": {
    description: "Less than or equal to",
    example: "a <= b",
    function: "<=",
    returnType: "bool",
  },
  "mod": {
    description: "Modulus",
    example: "a mod b",
    function: "mod",
    returnType: "number | integer",
  },

  //  keywordDescriptions 
  true: {
    description: "Boolean true",
    example: "true",
    function: "true",
    returnType: "bool",
  },
  false: {
    description: "Boolean false",
    example: "false",
    function: "false",
    returnType: "bool",
  },
  empty: {
    description: "Empty value",
    example: "empty",
    function: "empty",
    returnType: "*",
  },
  erase: {
    description: "Erase value",
    example: "erase",
    function: "erase",
    returnType: "*",
  },
  null: {
    description: "Null value",
    example: "null",
    function: "null",
    returnType: "*",
  },
  undefined: {
    description: "Undefined value",
    example: "undefined",
    function: "undefined",
    returnType: "*",
  },
  NaN: {
    description: "Not a number",
    example: "NaN",
    function: "NaN",
    returnType: "*",
  },

  // Math functions
  abs: {
    description: "Returns the absolute value of a number.",
    example: "abs(-5)",
    function: "abs(number)",
    returnType: "number",

  },
  ceil: {
    description: "Returns the smallest integer greater than or equal to a number.",
    example: "ceil(5.1)",
    function: "ceil(number)",
    returnType: "number",
  },
  floor: {
    description: "Returns the largest integer less than or equal to a number.",
    example: "floor(5.9)",
  },
  round: {
    description: "Rounds a number to the nearest integer.",
    example: "round(5.5)",
  },
  max: {
    description: "Returns the largest of zero or more numbers.",
    example: "max(1, 2, 3)",
  },
  min: {
    description: "Returns the smallest of zero or more numbers.",
    example: "min(1, 2, 3)",
  },
  parseNumber: {
    description: "Parses a string argument and returns an integer of the specified radix.",
    example: "parseNumber('10', 16)",
  },
  parseFloat: {
    description: "Parses a string argument and returns a floating point number.",
    example: "parseFloat('10.5')",
  },
  formatNumber: {
    description: "Formats a number according to the specified format.",
    example: "formatNumber(1000, '0,0')",
  },
  average: {
    description: "Returns the average of zero or more numbers.",
    example: "average(1, 2, 3)",
  },
  pow: {
    description: "Returns the base to the exponent power.",
    example: "pow(2, 3)",
  },
  sqrt: {
    description: "Returns the square root of a number.",
    example: "sqrt(9)",
  },
  random: {
    description: "Returns a random number between 0 and 1.",
    example: "random()",
  },
  sin: {
    description: "Returns the sine of a number.",
    example: "sin(90)",
  },
  cos: {
    description: "Returns the cosine of a number.",
    example: "cos(0)",
  },
  tan: {
    description: "Returns the tangent of a number.",
    example: "tan(45)",
  },
  asin: {
    description: "Returns the arcsine of a number.",
    example: "asin(1)",
  },
  acos: {
    description: "Returns the arccosine of a number.",
    example: "acos(1)",
  },
  atan: {
    description: "Returns the arctangent of a number.",
    example: "atan(1)",
  },
  atan2: {
    description: "Returns the arctangent of the quotient of its arguments.",
    example: "atan2(1, 1)",
  },
  log: {
    description: "Returns the natural logarithm of a number.",
    example: "log(10)",
  },
  exp: {
    description: "Returns E raised to the power of a number.",
    example: "exp(1)",
  },

  // Text and Binary functions
  length: {
    description: "Returns the length of a string.",
    example: "length('Hello')",
  },
  lower: {
    description: "Converts a string to lowercase.",
    example: "lower('Hello')",
  },
  upper: {
    description: "Converts a string to uppercase.",
    example: "upper('Hello')",
  },
  ascii: {
    description: "Returns the ASCII value of the first character of a string.",
    example: "ascii('Hello')",
    function: "ascii(string)",
    returnType: "text",
  },
  substring: {
    description: "Returns a portion of a string.",
    example: "substring('Hello', 1, 3)",
  },
  indexOf: {
    description: "Returns the position of the first occurrence of a substring in a string.",
    example: "indexOf('Hello', 'l')",
  },
  char: {
    description: "Returns the character based on the ASCII value.",
    example: "char(65)",
  },
  toBinary: {
    description: "Converts a number to binary.",
    example: "toBinary(10)",
  },
  toString: {
    description: "Converts a number to a string.",
    example: "toString(10)",
  },
  encodeURL: {
    description: "Encodes a URL.",
    example: "encodeURL('https://example.com')",
  },
  decodeURL: {
    description: "Decodes a URL.",
    example: "decodeURL('https%3A%2F%2Fexample.com')",
  },
  escapeHTML: {
    description: "Escapes HTML characters.",
    example: "escapeHTML('<div>Hello</div>')",
  },
  escapeMarkdown: {
    description: "Escapes Markdown characters.",
    example: "escapeMarkdown('# Hello')",
  },
  concat: {
    description: "Concatenates two or more strings.",
    example: "concat('Hello', ' ', 'World')",
  },
  stripHTML: {
    description: "Strips HTML tags from a string.",
    example: "stripHTML('<div>Hello</div>')",
  },
  contains: {
    description: "Returns true if an array contains the value.",
    example: "contains([1, 2, 3], 2)",
  },
  split: {
    description: "Splits a string into an array of substrings.",
    example: "split('Hello World', ' ')",
  },
  trim: {
    description: "Removes leading and trailing spaces from a string.",
    example: "trim(' Hello ')",
  },
  replace: {
    description: "Replaces text in a string.",
    example: "replace('Hello World', 'World', 'Universe')",
    function: "replace(string; search; replace)",
    returnType: "text",
  },
  join: {
    description: "Joins an array of strings into a single string.",
    example: "join(['Hello', 'World'], ' ')",
    function: "join(array; separator)",
    returnType: "text",
  },
  lastIndexOf: {
    description: "Returns the position of the last occurrence of a substring in a string.",
    example: "lastIndexOf('Hello World', 'o')",
    function: "lastIndexOf(string; search)",
    returnType: "number",
  },
  startsWith: {
    description: "Returns true if a string starts with a specified substring.",
    example: "startsWith('Hello World', 'Hello')",
    function: "startsWith(string; search)",
    returnType: "bool",
  },
  endsWith: {
    description: "Returns true if a string ends with a specified substring.",
    example: "endsWith('Hello World', 'World')",
    function: "endsWith(string; search)",
    returnType: "bool",
  },

    // bytes
  encodeBase64: {
    description: "Encodes a string to Base64.",
    example: "encodeBase64('Hello')",
    function: "encodeBase64(string)",
    returnType: "text",

  },
  encodeBytes: {
    description: "Encodes a string to bytes.",
    example: "encodeBytes('Hello')",
    function: "encodeBytes(string)",
    returnType: "text",
  },
  decodeBase64: {
    description: "Decodes a Base64 string.",
    example: "decodeBase64('SGVsbG8=')",
    function: "decodeBase64(string)",
    returnType: "text",
  },
  decodeBytes: {
    description: "Decodes a bytes string.",
    example: "decodeBytes('SGVsbG8=')",
    function: "decodeBytes(string)",
    returnType: "text",
  },
  encodeHex: {
    description: "Encodes a string to hexadecimal.",
    example: "encodeHex('Hello')",
    function: "encodeHex(string)",
    returnType: "text",
  },
  decodeHex: {
    description: "Decodes a hexadecimal string.",
    example: "decodeHex('48656c6c6f')",
    function: "decodeHex(string)",
    returnType: "text",
  },
  encodeBase58: {
    description: "Encodes a string to Base58.",
    example: "encodeBase58('Hello')",
    function: "encodeBase58(string)",
    returnType: "text",
  },
  decodeBase58: {
    description: "Decodes a Base58 string.",
    example: "decodeBase58('StV1DL6CwTryKyV')",
    function: "decodeBase58(string)",
    returnType: "text",
  },
  toHex: {
    description: "Converts a string to hexadecimal.",
    example: "toHex('Hello')",
    function: "toHex(string)",
    returnType: "text",
  },

  // cryptographic hash functions
  md5: {
    description: "Returns the MD5 hash of a string.",
    example: "md5('Hello')",
    function: "md5(string)",
    returnType: "text",
  },
  sha1: {
    description: "Returns the SHA-1 hash of a string.",
    example: "sha1('Hello')",
    function: "sha1(string)",
    returnType: "text",
  },
  sha256: {
    description: "Returns the SHA-256 hash of a string.",
    example: "sha256('Hello')",
    function: "sha256(string)",
    returnType: "text",
  },
  sha512: {
    description: "Returns the SHA-512 hash of a string.",
    example: "sha512('Hello')",
    function: "sha512(string)",
    returnType: "text",
  },
  ed25519: {
    description: "Returns the Ed25519 hash of a string.",
    example: "ed25519('Hello')",
    function: "ed25519(string)",
    returnType: "text",

  },
  sr25519: {
    description: "Returns the Sr25519 hash of a string.",
    example: "sr25519('Hello')",
    function: "sr25519(string)",
    returnType: "text",
  },
  hmac: {
    description: "Returns the HMAC hash of a string.",
    example: "hmac('Hello World', 'key')",
    function: "hmac(string; key)",
    returnType: "text",
  },
  pbkdf2: {
    description: "Returns the PBKDF2 hash of a string.",
    example: "pbkdf2('Hello', 'salt', 1000, 64)",
    function: "pbkdf2(string; salt; iterations; keyLength)",
    returnType: "text",
  },
  bcrypt: {
    description: "Returns the bcrypt hash of a string.",
    example: "bcrypt('Hello', 10)",
    function: "bcrypt(string; rounds)",
    returnType: "text",
  },
  scrypt: {
    description: "Returns the scrypt hash of a string.",
    example: "scrypt('Hello', 'salt', 16384, 8, 1, 64)",
    function: "scrypt(string; salt; N; r; p; keyLength)",
    returnType: "text",
  },
  sign: {
    description: "Returns the signature of a string.",
    example: "sign('Hello World', 'key')",
    function: "sign(string; key)",
    returnType: "text",
  },
  verify: {
    description: "Verifies the signature of a string.",
    example: "verify('Hello World', 'signature', 'key')",
    function: "verify(string; signature; key)",
    returnType: "bool",
  },
  encrypt: {
    description: "Encrypts a string.",
    example: "encrypt('Hello', 'key')",
    function: "encrypt(string; key)",
    returnType: "text",
  },
  decrypt: {
    description: "Decrypts a string.",
    example: "decrypt('Hello', 'key')",
    function: "decrypt(string; key)",
    returnType: "text",
  },
  secp256k1: {
    description: "Returns the Secp256k1 hash of a string.",
    example: "secp256k1('Hello')",
    function: "secp256k1(string)",
    returnType: "text",
  },
  blake2b: {
    description: "Returns the Blake2b hash of a string.",
    example: "blake2b('Hello')",
    function: "blake2b(string)",
    returnType: "text",
  },
  blake2s: {
    description: "Returns the Blake2s hash of a string.",
    example: "blake2s('Hello')",
    function: "blake2s(string)",
    returnType: "text",
  },
  keccak256: {
    description: "Returns the Keccak256 hash of a string.",
    example: "keccak256('Hello')",
    function: "keccak256(string)",
    returnType: "text",
  },
  keccak512: {
    description: "Returns the Keccak512 hash of a string.",
    example: "keccak512('Hello')",
    function: "keccak512(string)",
    returnType: "text",
  },
  sha3: {
    description: "Returns the SHA-3 hash of a string.",
    example: "sha3('Hello')",
    function: "sha3(string)",
    returnType: "text",
  },
  ripemd160: {
    description: "Returns the RIPEMD-160 hash of a string.",
    example: "ripemd160('Hello')",
    function: "ripemd160(string)",
    returnType: "text",
  },
  whirlpool: {
    description: "Returns the Whirlpool hash of a string.",
    example: "whirlpool('Hello')",
    function: "whirlpool(string)",
    returnType: "text",
  },
  tiger: {
    description: "Returns the Tiger hash of a string.",
    example: "tiger('Hello')",
    function: "tiger(string)",
    returnType: "text",
  },
  gost: {
    description: "Returns the GOST hash of a string.",
    example: "gost('Hello')",
    function: "gost(string)",
    returnType: "text",
  },
  crc32: {
    description: "Returns the CRC-32 hash of a string.",
    example: "crc32('Hello')",
    function: "crc32(string)",
    returnType: "text",
  },
  crc64: {
    description: "Returns the CRC-64 hash of a string.",
    example: "crc64('Hello')",
    function: "crc64(string)",
    returnType: "text",
  },
  xxhash: {
    description: "Returns the XXHash hash of a string.",
    example: "xxhash('Hello')",
    function: "xxhash(string)",
    returnType: "text",
  },
  decodeXxhash: {
    description: "Decodes the XXHash hash of a string.",
    example: "decodeXxhash('Hello')",
    function: "decodeXxhash(string)",
    returnType: "text",
  },
  decodeBlake2b: {
    description: "Decodes the Blake2b hash of a string.",
    example: "decodeBlake2b('Hello')",
    function: "decodeBlake2b(string)",
    returnType: "text",
  },
  stringToHex: {
    description: "Converts a string to hexadecimal.",
    example: "stringToHex('Hello')",
    function: "stringToHex(string)",
    returnType: "text",
  },
  hexToString: {
    description: "Converts hexadecimal to a string.",
    example: "hexToString('48656c6c6f')",
    function: "hexToString(string)",
    returnType: "text",
  },
  balanceToHex: {
    description: "Converts a balance to hexadecimal.",
    example: "balanceToHex(1000000000000000)",
    function: "balanceToHex(balance)",
    returnType: "text",
  },
  hexToBalance: {
    description: "Converts hexadecimal to a balance.",
    example: "hexToBalance('0x1')",
    function: "hexToBalance(string)",
    returnType: "text",
  },
  accountIdToHex: {
    description: "Converts an account ID to hexadecimal.",
    example: "accountIdToHex('5GQq4YpXQ4FD2MMF394F2M394F49N6p2')",
    function: "accountIdToHex(string)",
    returnType: "text",
  },
  hexToAccountId: {
    description: "Converts hexadecimal to an account ID.",
    example: "hexToAccountId('0x5GQq4YpXQ4FD2MMF394F2M394F49N6p2')",
    function: "hexToAccountId(string)",
    returnType: "text",
  },
  blake2ToString: {
    description: "Converts a Blake2 hash to a string.",
    example: "blake2ToString('Hello', 256)",
    function: "blake2ToString(string; size)",
    returnType: "text",
  },
  blake2ConcatAString: {
    description: "Concatenates two strings and returns the Blake2 hash.",
    example: "blake2ConcatAString('Hello', 'World', 256)",
    function: "blake2ConcatAString(string1; string2; size)",
    returnType: "text",
  },
  xXhashAString: {
    description: "Returns the XXHash hash of a string.",
    example: "xXhashAString('Hello', 64)",
    function: "xXhashAString(string; size)",
    returnType: "text",
  },
  xXhashConcatAString: {
    description: "Concatenates two strings and returns the XXHash hash.",
    example: "xXhashConcatAString('Hello', 'World', 64)",
    function: "xXhashConcatAString(string1; string2; size)",
    returnType: "text",
  },
  seedToAddress: {
    description: "Converts a seed to an address.",
    example: "seedToAddress('Hello')",
    function: "seedToAddress(string)",
    returnType: "text",
  },
  u8ArrayToHex: {
    description: "Converts a Uint8Array to hexadecimal.",
    example: "u8ArrayToHex([1, 2, 3])",
    function: "u8ArrayToHex(array)",
    returnType: "text",
  },

  // Array functions and keywords
  includes: {
    description: "Returns true if a string contains a specified substring.",
    example: "includes('Hello', 'l')",
    function: "includes(string; substring)",
    returnType: "bool",
  },

  slice: {
    description: "Returns a portion of an array.",
    example: "slice([1, 2, 3], 1, 2)",
    function: "slice(array; start; end)",
    returnType: "array",
  },
  merge: {
    description: "Merges two or more arrays.",
    example: "merge([1, 2], [3, 4])",
    function: "merge(array1; array2; ...)",
    returnType: "array",
  },
  reverse: {
    description: "Reverses an array.",
    example: "reverse([1, 2, 3])",
    function: "reverse(array)",
    returnType: "array",
  },
  sort: {
    description: "Sorts an array.",
    example: "sort([3, 1, 2])",
    function: "sort(array)",
    returnType: "array",
  },
  unique: {
    description: "Returns unique values of an array.",
    example: "unique([1, 2, 2, 3])",
    function: "unique(array)",
    returnType: "array",
  },
  filter: {
    description: "Filters an array.",
    example: "filter([1, 2, 3], 'x > 1')",
    function: "filter(array; expression)",
    returnType: "array",
  },
  map: {
    description: "Maps an array.",
    example: "map([1, 2, 3], 'x + 1')",
    function: "map(array; expression)",
    returnType: "array",
  },
  reduce: {
    description: "Reduces an array.",
    example: "reduce([1, 2, 3], 'x + y')",
    function: "reduce(array; expression)",
    returnType: "*",
  },
  forEach: {
    description: "Executes a function for each array element.",
    example: "forEach([1, 2, 3], 'console.log(x)')",
    function: "forEach(array; expression)",
    returnType: "*",
  },
  find: {
    description: "Finds an element in an array.",
    example: "find([1, 2, 3], 'x > 1')",
    function: "find(array; expression)",
    returnType: "*",
  },
  findIndex: {
    description: "Finds the index of an element in an array.",
    example: "findIndex([1, 2, 3], 'x > 1')",
    function: "findIndex(array; expression)",
    returnType: "number",
  },
  some: {
    description: "Returns true if at least one element in an array satisfies the test.",
    example: "some([1, 2, 3], 'x > 1')",
    function: "some(array; expression)",
    returnType: "bool",
  },
  every: {
    description: "Returns true if all elements in an array satisfy the test.",
    example: "every([1, 2, 3], 'x > 1')",
    function: "every(array; expression)",
    returnType: "bool",
  },
  fill: {
    description: "Fills elements in an array with a static value.",
    example: "fill([1, 2, 3], 0)",
    function: "fill(array; value)",
    returnType: "array",
  },
  first: {
    description: "Returns the first element of an array.",
    example: "first([1, 2, 3])",
    function: "first(array)",
    returnType: "*",
  },
  last: {
    description: "Returns the last element of an array.",
    example: "last([1, 2, 3])",
    function: "last(array)",
    returnType: "*",
  },
  flatten: {
    description: "Flattens an array.",
    example: "flatten([[1, 2], [3, 4]])",
    function: "flatten(array)",
    returnType: "array",
  },
  distinct: { 
    description: "Returns distinct values of an array.",
    example: "distinct([1, 2, 2, 3])",
    function: "distinct(array)",
    returnType: "array",
  },
  deduplicate: {
    description: "Returns deduplicated values of an array.",
    example: "deduplicate([1, 2, 2, 3])",
    function: "deduplicate(array)",
    returnType: "array",
  },
  toCollection: {
    description: "Converts an array to a collection.",
    example: "toCollection([1, 2, 3])",
    function: "toCollection(array)",
    returnType: "collection",
  },
  toArray: {
    description: "Converts a collection to an array.",
    example: "toArray({a: 1, b: 2})",
    function: "toArray(collection)",
    returnType: "array",
  },
  emptyArray: {
    description: "keyword for an empty array",
    example: "emptyArray",
    function: "emptyArray",
    returnType: "*",
  },
  
  // Date and Time functions
  addSeconds: {
    description: "Adds seconds to a date.",
    example: "addSeconds('2021-01-01T00:00:00Z', 60)",
    function: "addSeconds(date; seconds)",
    returnType: "date",
  },
  addMinutes: {
    description: "Adds minutes to a date.",
    example: "addMinutes('2021-01-01T00:00:00Z', 60)",
    function: "addMinutes(date; minutes)",
    returnType: "date",
  },
  addHours: {
    description: "Adds hours to a date.",
    example: "addHours('2021-01-01T00:00:00Z', 24)",
    function: "addHours(date; hours)",
    returnType: "date",
  },
  addDays: {
    description: "Adds days to a date.",
    example: "addDays('2021-01-01T00:00:00Z', 1)",
    function: "addDays(date; days)",
    returnType: "date",
  },
  addMonths: {
    description: "Adds months to a date.",
    example: "addMonths('2021-01-01T00:00:00Z', 1)",
    function: "addMonths(date; months)",
    returnType: "date",
  },
  addYears: {
    description: "Adds years to a date.",
    example: "addYears('2021-01-01T00:00:00Z', 1)",
    function: "addYears(date; years)",
    returnType: "date",
  },
  setMinute: {
    description: "Sets the minute of a date.",
    example: "setMinute('2021-01-01T00:00:00Z', 30)",
    function: "setMinute(date; minute)",
    returnType: "date",
  },
  setHour: {
    description: "Sets the hour of a date.",
    example: "setHour('2021-01-01T00:00:00Z', 12)",
    function: "setHour(date; hour)",
    returnType: "date",
  },
  setDay: {
    description: "Sets the day of a date.",
    example: "setDay('2021-01-01T00:00:00Z', 15)",
    function: "setDay(date; day)",
    returnType: "date",
  },
  setMonth: {
    description: "Sets the month of a date.",
    example: "setMonth('2021-01-01T00:00:00Z', 6)",
    function: "setMonth(date; month)",
    returnType: "date",
  },
  setYear: {
    description: "Sets the year of a date.",
    example: "setYear('2021-01-01T00:00:00Z', 2022)",
    function: "setYear(date; year)",
    returnType: "date",
  },
  formatDate: {
    description: "Formats a date.",
    example: "formatDate('2021-01-01T00:00:00Z', 'YYYY-MM-DD')",
    function: "formatDate(date; format)",
    returnType: "string",
  },
  parseDate: {
    description: "Parses a date.",
    example: "parseDate('2021-01-01T00:00:00Z')",
    function: "parseDate(date)",
    returnType: "date",
  },
// Date And Time keywords
  timestamp: {
    description: "timestamp keyword",
    example: "timestamp",
    function: "timestamp",
    returnType: "uinteger",
  },
  now: {
    description: "now keyword",
    example: "now",
    function: "now",
    returnType: "date",
  },

  // text binary keywords
  space: {
    description: "space keyword",
    example: "space",
    function: "space",
    returnType: "string",
  },
  nbsp: {
    description: "nbsp keyword",
    example: "nbsp",
    function: "nbsp",
    returnType: "string",
  },
  tab: {
    description: "tab keyword",
    example: "tab",
    function: "tab",
    returnType: "string",
  },
  emptystring: {
    description: "emptystring keyword",
    example: "emptystring",
    function: "emptystring",
    returnType: "string",
  },
  newline: {
    description: "newline keyword",
    example: "newline",
    function: "newline",
    returnType: "string",
  },
  carriagereturn: {
    description: "carriagereturn keyword",
    example: "carriagereturn",
    function: "carriagereturn",
    returnType: "string",
  },
  // variable keywords
  uuid: {
    description: "uuid keyword",
    example: "uuid",
    function: "uuid",
    returnType: "string",
  },

};

   
   