export function extractJsonObjectOrArray(input: string) {
  const start = input.search(/[\[{]/);

  if (start === -1) {
    return null;
  }

  const trimmed = input.slice(start).trim();
  const first = trimmed[0];
  const last = first === "[" ? "]" : "}";
  const end = trimmed.lastIndexOf(last);

  if (end === -1) {
    return null;
  }

  return trimmed.slice(0, end + 1);
}

export function safeParseJson<T>(input: string): T | null {
  const candidate = extractJsonObjectOrArray(input) ?? input.trim();

  try {
    return JSON.parse(candidate) as T;
  } catch {
    return null;
  }
}
