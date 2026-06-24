function chunkText(text, chunkSize = 100, overlap = 20) {
  if (!text) return [];
  const words = text.split(/\s+/);
  const chunks = [];
  
  for (let i = 0; i < words.length; i += (chunkSize - overlap)) {
    const chunk = words.slice(i, i + chunkSize).join(" ");
    if (chunk.trim()) {
      chunks.push(chunk);
    }
  }
  
  return chunks;
}

module.exports = { chunkText };
