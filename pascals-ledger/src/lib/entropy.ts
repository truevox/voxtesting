import axios from 'axios';
import { EntropyMetadata, WeatherData, SensorData } from '@/types';

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || '';
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

/**
 * Fetch weather data from OpenWeatherMap API
 */
export async function fetchWeatherData(
  latitude?: number,
  longitude?: number,
  city?: string
): Promise<WeatherData | null> {
  if (!OPENWEATHER_API_KEY) {
    console.warn('OpenWeatherMap API key not configured');
    return null;
  }

  try {
    let url = OPENWEATHER_BASE_URL;
    const params: any = {
      appid: OPENWEATHER_API_KEY,
      units: 'metric',
    };

    if (latitude && longitude) {
      params.lat = latitude;
      params.lon = longitude;
    } else if (city) {
      params.q = city;
    } else {
      // Default to a generic location if none provided
      return null;
    }

    const response = await axios.get(url, { params, timeout: 5000 });
    const data = response.data;

    return {
      temperature: Math.round(data.main.temp * 10) / 10,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      conditions: data.weather[0].main,
      windSpeed: data.wind?.speed,
      source: 'OpenWeatherMap',
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}

/**
 * Get IP-based geolocation (basic fallback)
 */
export async function getIPLocation(): Promise<{
  city: string;
  country: string;
  lat: number;
  lon: number;
} | null> {
  try {
    // Using ipapi.co for free IP geolocation
    const response = await axios.get('https://ipapi.co/json/', { timeout: 3000 });
    return {
      city: response.data.city,
      country: response.data.country_name,
      lat: response.data.latitude,
      lon: response.data.longitude,
    };
  } catch (error) {
    console.error('Error fetching IP location:', error);
    return null;
  }
}

/**
 * Generate entropy metadata for hash generation
 */
export async function generateEntropyMetadata(
  options: {
    latitude?: number;
    longitude?: number;
    city?: string;
    sensorData?: SensorData;
  } = {}
): Promise<EntropyMetadata> {
  const timestamp = new Date();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Fetch weather data if location provided
  let weather: WeatherData | null = null;
  let location = undefined;

  if (options.latitude && options.longitude) {
    weather = await fetchWeatherData(options.latitude, options.longitude);
    location = {
      coordinates: {
        lat: options.latitude,
        lon: options.longitude,
      },
    };
  } else if (options.city) {
    weather = await fetchWeatherData(undefined, undefined, options.city);
    location = {
      city: options.city,
    };
  }

  const metadata: EntropyMetadata = {
    timestamp: timestamp.toISOString(),
    timezone,
  };

  if (weather) {
    metadata.weather = weather;
  }

  if (location) {
    metadata.location = location;
  }

  if (options.sensorData) {
    metadata.sensors = options.sensorData;
  }

  return metadata;
}

/**
 * Generate entropy for PEC rolling hash update
 */
export async function generatePECEntropy(
  sensorData: SensorData,
  previousHash: string
): Promise<string> {
  const timestamp = new Date().toISOString();
  const entropy = {
    timestamp,
    previousHash,
    sensorData,
  };

  return JSON.stringify(entropy);
}

/**
 * Validate sensor data structure
 */
export function validateSensorData(data: any): SensorData | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const validated: SensorData = {};

  if (data.accelerometer && typeof data.accelerometer === 'object') {
    validated.accelerometer = {
      x: Number(data.accelerometer.x) || 0,
      y: Number(data.accelerometer.y) || 0,
      z: Number(data.accelerometer.z) || 0,
    };
  }

  if (data.gyroscope && typeof data.gyroscope === 'object') {
    validated.gyroscope = {
      alpha: Number(data.gyroscope.alpha) || 0,
      beta: Number(data.gyroscope.beta) || 0,
      gamma: Number(data.gyroscope.gamma) || 0,
    };
  }

  if (data.magnetometer && typeof data.magnetometer === 'object') {
    validated.magnetometer = {
      x: Number(data.magnetometer.x) || 0,
      y: Number(data.magnetometer.y) || 0,
      z: Number(data.magnetometer.z) || 0,
    };
  }

  if (data.ambientLight !== undefined) {
    validated.ambientLight = Number(data.ambientLight) || 0;
  }

  if (data.deviceOrientation && typeof data.deviceOrientation === 'object') {
    validated.deviceOrientation = {
      alpha: Number(data.deviceOrientation.alpha) || 0,
      beta: Number(data.deviceOrientation.beta) || 0,
      gamma: Number(data.deviceOrientation.gamma) || 0,
    };
  }

  return Object.keys(validated).length > 0 ? validated : null;
}
