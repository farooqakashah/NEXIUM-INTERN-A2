export function generateSummary(text: string): string {
  if (typeof text !== 'string' || text.trim().length < 20) {
    return 'Summary could not be generated — invalid or too short text.';
  }

  const sentences = text.match(/[^\.!\?]+[\.!\?]+/g)?.map(s => s.trim()) || [];
  if (sentences.length === 0) return 'Summary could not be generated.';

  const preprocess = (input: string) =>
    input
      .toLowerCase()
      .replace(/[^\w\sء-ي]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 0);

  const calculateTF = (input: string) => {
    const words = preprocess(input);
    const wordCount: Record<string, number> = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
    const totalWords = words.length || 1;
    return Object.fromEntries(
      Object.entries(wordCount).map(([word, count]) => [word, count / totalWords])
    );
  };

  const calculateIDF = (allSentences: string[]) => {
    const wordDocCount: Record<string, number> = {};
    const totalSentences = allSentences.length || 1;
    allSentences.forEach(sentence => {
      const words = new Set(preprocess(sentence));
      words.forEach(word => {
        wordDocCount[word] = (wordDocCount[word] || 0) + 1;
      });
    });
    return Object.fromEntries(
      Object.entries(wordDocCount).map(([word, count]) => [
        word,
        Math.log(totalSentences / (1 + count)),
      ])
    );
  };

  const getTFIDFVector = (tf: Record<string, number>, idf: Record<string, number>) => {
    const vector: Record<string, number> = {};
    Object.keys(tf).forEach(word => {
      if (idf[word]) {
        vector[word] = tf[word] * idf[word];
      }
    });
    return vector;
  };

  const cosineSimilarity = (
    vectorA: Record<string, number>,
    vectorB: Record<string, number>
  ) => {
    const words = new Set([...Object.keys(vectorA), ...Object.keys(vectorB)]);
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    words.forEach(word => {
      const a = vectorA[word] || 0;
      const b = vectorB[word] || 0;
      dotProduct += a * b;
      normA += a * a;
      normB += b * b;
    });

    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);
    return normA * normB === 0 ? 0 : dotProduct / (normA * normB);
  };

  const tfScores = sentences.map(sentence => calculateTF(sentence));
  const idfScores = calculateIDF(sentences);
  const sentenceVectors = tfScores.map(tf => getTFIDFVector(tf, idfScores));

  const documentTF = calculateTF(text);
  const documentVector = getTFIDFVector(documentTF, idfScores);

  const sentenceScores = sentences.map((sentence, index) => ({
    sentence,
    score: cosineSimilarity(sentenceVectors[index], documentVector),
    index,
  }));

  const filteredScores = sentenceScores.filter(item => item.score > 0.1);

  const numSentences = Math.min(10, Math.max(6, Math.floor(sentences.length * 0.25)));
  const selectedSentences: { sentence: string; index: number }[] = [];
  const usedVectors: Record<string, number>[] = [];

  filteredScores
    .sort((a, b) => b.score - a.score)
    .forEach(({ sentence, index }) => {
      if (selectedSentences.length < numSentences) {
        const similarityToSelected = usedVectors.reduce(
          (maxSim, vec) => Math.max(maxSim, cosineSimilarity(sentenceVectors[index], vec)),
          0
        );
        if (similarityToSelected < 0.7) {
          selectedSentences.push({ sentence, index });
          usedVectors.push(sentenceVectors[index]);
        }
      }
    });

  const summary = selectedSentences
    .sort((a, b) => a.index - b.index)
    .map(item => item.sentence)
    .join(' ');

  const normalizedSummary = summary
    .replace(/\s+/g, ' ')
    .replace(/\s+([.!?])/g, '$1')
    .trim();

  return normalizedSummary || 'Summary could not be generated.';
}
