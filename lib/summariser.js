export function generateSummary(text) {
  // Split text into sentences
  const sentences = text.match(/[^\.!\?]+[\.!\?]+/g)?.map(s => s.trim()) || [];
  if (sentences.length === 0) return 'Summary could not be generated.';

  // Helper function to preprocess text (remove punctuation, lowercase, handle Urdu)
  const preprocess = (text) =>
    text
      .toLowerCase()
      .replace(/[^\w\sء-ي]/g, '') // Include Urdu characters (Unicode range U+0621 to U+06FF)
      .split(/\s+/)
      .filter(word => word.length > 0);

  // Calculate Term Frequency (TF) for a sentence or document
  const calculateTF = (text) => {
    const words = preprocess(text);
    const wordCount = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
    const totalWords = words.length || 1; // Avoid division by zero
    return Object.fromEntries(
      Object.entries(wordCount).map(([word, count]) => [word, count / totalWords])
    );
  };

  // Calculate Inverse Document Frequency (IDF) across all sentences
  const calculateIDF = (sentences) => {
    const wordDocCount = {};
    const totalSentences = sentences.length || 1; // Avoid division by zero
    sentences.forEach(sentence => {
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

  // Calculate TF-IDF vector for a sentence or document
  const getTFIDFVector = (tf, idf) => {
    const vector = {};
    Object.keys(tf).forEach(word => {
      if (idf[word]) {
        vector[word] = tf[word] * idf[word];
      }
    });
    return vector;
  };

  // Calculate cosine similarity between two TF-IDF vectors
  const cosineSimilarity = (vectorA, vectorB) => {
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

  // Calculate TF-IDF scores and vectors
  const tfScores = sentences.map(sentence => calculateTF(sentence));
  const idfScores = calculateIDF(sentences);
  const sentenceVectors = tfScores.map(tf => getTFIDFVector(tf, idfScores));

  // Calculate document-level TF-IDF vector
  const documentTF = calculateTF(text);
  const documentVector = getTFIDFVector(documentTF, idfScores);

  // Calculate cosine similarity and store original index for ordering
  const sentenceScores = sentences.map((sentence, index) => ({
    sentence,
    score: cosineSimilarity(sentenceVectors[index], documentVector),
    index, // Store original index for ordering
  }));

  // Filter out low-scoring sentences (e.g., score < 0.1)
  const filteredScores = sentenceScores.filter(item => item.score > 0.1);

  // Select top sentences with diversity penalty
  const numSentences = Math.min(10, Math.max(6, Math.floor(sentences.length * 0.25))); // 25% of sentences, min 6, max 10
  const selectedSentences = [];
  const usedVectors = [];

  filteredScores
    .sort((a, b) => b.score - a.score) // Sort by score
    .forEach(({ sentence, score, index }, i) => {
      if (selectedSentences.length < numSentences) {
        // Calculate similarity to already selected sentences
        const similarityToSelected = usedVectors.reduce(
          (maxSim, vec) => Math.max(maxSim, cosineSimilarity(sentenceVectors[index], vec)),
          0
        );
        // Add sentence if it's not too similar (threshold 0.7)
        if (similarityToSelected < 0.7) {
          selectedSentences.push({ sentence, index });
          usedVectors.push(sentenceVectors[index]);
        }
      }
    });

  // Sort selected sentences by original index for logical flow
  const summary = selectedSentences
    .sort((a, b) => a.index - b.index) // Order by appearance in original text
    .map(item => item.sentence) // Use full sentences
    .join(' ');

  // Normalize output (remove extra spaces, ensure proper punctuation)
  const normalizedSummary = summary
    .replace(/\s+/g, ' ')
    .replace(/\s+([.!?])/g, '$1') // Fix spacing before punctuation
    .trim();

  return normalizedSummary || 'Summary could not be generated.';
}