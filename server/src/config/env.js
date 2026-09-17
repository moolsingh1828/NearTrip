import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT || 5000),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGODB_URI || '',
  overpassUrl: process.env.OVERPASS_URL || 'https://overpass-api.de/api/interpreter',
  osrmUrl: process.env.OSRM_URL || 'https://router.project-osrm.org',
  awsRegion: process.env.AWS_REGION || 'us-east-1',
  bedrockModelId: process.env.BEDROCK_MODEL_ID || ''
};
