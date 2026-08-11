export function parseBoard(value: string): string[][] {
  const parsed = JSON.parse(value);
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("Board must be a non-empty 2D array.");
  }

  const width = parsed[0]?.length;
  if (!width) {
    throw new Error("Board rows cannot be empty.");
  }

  parsed.forEach((row) => {
    if (!Array.isArray(row) || row.length !== width) {
      throw new Error("Every board row must have the same length.");
    }
    row.forEach((cell) => {
      if (typeof cell !== "string" || cell.length !== 1) {
        throw new Error("Every board cell must be one character.");
      }
    });
  });

  return parsed;
}

export function parseWords(value: string): string[] {
  const parsed = JSON.parse(value);
  if (!Array.isArray(parsed) || parsed.some((word) => typeof word !== "string" || !word)) {
    throw new Error("Words must be a JSON array of non-empty strings.");
  }

  return parsed;
}
