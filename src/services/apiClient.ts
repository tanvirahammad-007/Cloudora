import axios, { AxiosError, AxiosInstance } from 'axios';
import { normalizeError } from '../lib/errorUtils';
import { AppErrorInput } from '../types/error';

const REQUEST_TIMEOUT = 12000;

const attachErrorInterceptor = (client: AxiosInstance, fallback: AppErrorInput) => {
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => Promise.reject(normalizeError(error, fallback))
  );

  return client;
};

export const weatherApiClient = attachErrorInterceptor(
  axios.create({
    baseURL: 'https://api.openweathermap.org/data/2.5',
    timeout: REQUEST_TIMEOUT,
  }),
  { source: 'openweather', kind: 'api' }
);

export const geoApiClient = attachErrorInterceptor(
  axios.create({
    baseURL: 'https://api.openweathermap.org/geo/1.0',
    timeout: REQUEST_TIMEOUT,
  }),
  { source: 'openweather-geo', kind: 'invalid-city' }
);

export const countryApiClient = attachErrorInterceptor(
  axios.create({
    baseURL: 'https://restcountries.com/v3.1',
    timeout: REQUEST_TIMEOUT,
  }),
  { source: 'country-data', kind: 'api', severity: 'info' }
);
