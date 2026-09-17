import { BedrockRuntimeClient, ConverseCommand } from '@aws-sdk/client-bedrock-runtime';
import { env } from '../config/env.js';

function fallbackInterpretation(query = '') {
  const text = query.toLowerCase();
  const categories = [];
  if (/nature|lake|water|park|peaceful|quiet|green/.test(text)) categories.push('nature');
  if (/food|restaurant|cafe|coffee|eat/.test(text)) categories.push('food');
  if (/adventure|trek|hike|sport/.test(text)) categories.push('adventure');
  if (/museum|heritage|history|culture|art/.test(text)) categories.push('attractions');
  const budgetMatch = text.match(/(?:₹|rs\.?\s*)?(\d{2,5})\s*(?:per person|each|budget)?/);
  const durationMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:hour|hours|hr|hrs)/);
  const peopleMatch = text.match(/(\d+)\s*(?:friends|people|persons|of us)/);
  return {
    intent: query,
    categories: [...new Set(categories)],
    budget: budgetMatch ? Number(budgetMatch[1]) : null,
    durationHours: durationMatch ? Number(durationMatch[1]) : null,
    groupSize: peopleMatch ? Number(peopleMatch[1]) : null,
    keywords: text.split(/\s+/).filter((w) => w.length > 3).slice(0, 8)
  };
}

export async function interpretQuery(query) {
  if (!env.bedrockModelId) return { source: 'local-parser', ...fallbackInterpretation(query) };
  try {
    const client = new BedrockRuntimeClient({ region: env.awsRegion });
    const prompt = `Convert this travel/place search into strict JSON only. Fields: categories (array from nature, food, adventure, cafe, attractions, other), budget (number or null), durationHours (number or null), groupSize (number or null), keywords (array of strings), intent (short string). User query: ${query}`;
    const command = new ConverseCommand({
      modelId: env.bedrockModelId,
      messages: [{ role: 'user', content: [{ text: prompt }] }],
      inferenceConfig: { maxTokens: 300, temperature: 0.1 }
    });
    const response = await client.send(command);
    const raw = response.output?.message?.content?.[0]?.text || '';
    const parsed = JSON.parse(raw.replace(/^```json\s*/i, '').replace(/\s*```$/i, ''));
    return { source: 'amazon-bedrock', ...parsed };
  } catch (error) {
    console.warn('[ai] Bedrock unavailable; using local parser:', error.message);
    return { source: 'local-parser-fallback', ...fallbackInterpretation(query) };
  }
}
