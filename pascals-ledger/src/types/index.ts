// User types
export interface User {
  id: string;
  email: string;
  passwordHash: string;
  tier: 'standard' | 'premium';
  createdAt: Date;
  subscriptionEndDate: Date | null;
  pecEnabled: boolean;
}

export interface UserSession {
  userId: string;
  email: string;
  tier: 'standard' | 'premium';
}

// Hash types
export interface Hash {
  id: string;
  userId: string;
  blake3Hash: string;
  sha256Hash: string;
  sphincsSignature: string | null;
  timestamp: Date;
  entropyMetadata: EntropyMetadata;
  qrCodeUrl: string;
  publicVerificationUrl: string;
  createdAt: Date;
}

export interface EntropyMetadata {
  timestamp: string;
  timezone: string;
  weather?: WeatherData;
  sensors?: SensorData;
  location?: {
    city?: string;
    country?: string;
    coordinates?: {
      lat: number;
      lon: number;
    };
  };
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  pressure: number;
  conditions: string;
  windSpeed?: number;
  source: string;
}

export interface SensorData {
  accelerometer?: { x: number; y: number; z: number };
  gyroscope?: { alpha: number; beta: number; gamma: number };
  magnetometer?: { x: number; y: number; z: number };
  ambientLight?: number;
  deviceOrientation?: { alpha: number; beta: number; gamma: number };
}

// PEC Rolling Hash types
export interface PECRollingHash {
  id: string;
  userId: string;
  parentHashId: string;
  currentBlake3: string;
  currentSha256: string;
  currentSphincs: string;
  sensorData: SensorData;
  updatedAt: Date;
}

// API Request/Response types
export interface HashGenerationRequest {
  inputType: 'text' | 'image';
  content?: string;
  imageData?: string; // base64 encoded
  location?: {
    latitude?: number;
    longitude?: number;
  };
  sensorData?: SensorData;
}

export interface HashGenerationResponse {
  success: boolean;
  hash?: Hash;
  error?: string;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    email: string;
    tier: 'standard' | 'premium';
  };
  error?: string;
}

export interface PaymentRequest {
  tier: 'standard' | 'premium';
  paymentMethodId?: string;
}

export interface PaymentResponse {
  success: boolean;
  clientSecret?: string;
  subscriptionId?: string;
  error?: string;
}
