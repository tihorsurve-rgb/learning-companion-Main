export const sanitizeInput = (input: string): string => {
  // Basic sanitization: remove HTML tags and trim
  return input.replace(/<[^>]*>?/gm, '').trim();
};

export const validatePromptLimit = (prompt: string, limit: number = 2000): boolean => {
  return prompt.length <= limit;
};
