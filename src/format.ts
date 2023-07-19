import { ParsedOutput } from "./types.ts";

export function format(parsed: ParsedOutput, depth = 0): string {
  // At the top level of the data structure, an array is not a true array but actually multiple
  // returned values when commands are pipelined.
  if (depth === 0) {
    return parsed.reduce((acc: string[], token) => {
      if (typeof token === "string") return acc.concat(token);
      return acc.concat(format(token, depth + 1));
    }, []).join("\n\n");
  }

  const indent = "  ".repeat(depth - 1);
  return parsed.reduce((acc: string[], token, index) => {
    if (typeof token === "string") {
      return acc.concat([`${indent}${index + 1}) ${token}`]);
    }
    return acc.concat(
      `${indent}${index + 1})`,
      format(token, depth + 1),
    );
  }, []).join("\n");
}
