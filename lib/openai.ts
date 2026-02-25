type ResponseOutputItem = {
  type?: string;
  content?: Array<{ type?: string; text?: string }>;
};

type ResponseLike = {
  output_text?: string;
  output?: ResponseOutputItem[];
};

export function extractResponseText(response: ResponseLike): string {
  if (response.output_text?.trim()) {
    return response.output_text.trim();
  }

  const contentText = response.output
    ?.flatMap((item) => item.content ?? [])
    .filter((content) => content.type === "output_text")
    .map((content) => content.text ?? "")
    .join("\n")
    .trim();

  if (contentText) {
    return contentText;
  }

  return "No pude generar una respuesta en este momento. Intenta de nuevo.";
}
