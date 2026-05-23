/**
 * Gilded Dragon - Centralized Configuration System
 * 
 * Edit this file to change server parameters, API endpoints,
 * live game stats, or default configuration variables without having
 * to modify individual components across the codebase.
 */

export const GAME_CONFIG = {
  // Server Configuration
  SERVER_IP: 'mc.intrachai-mmo.net',
  SERVER_NAME: 'ABYSSAL REALM & MMO CONTROL PORTAL',
  SERVER_PORT: 25565,
  SEASON_NAME: 'Season 5: Gilded Dragon แดนพยัคฆ์มังกรทอง',
  
  // API Connection Configuration
  API_BASE_URL: 'https://api.intrachai-mmo.net/v1',
  AUTH_API_ENDPOINT: 'https://api.intrachai-mmo.net/v1/auth',
  MARKET_API_ENDPOINT: 'https://api.intrachai-mmo.net/v1/market',

  // Live Server Status Indicator Settings (Simulated)
  PLAYERS_ONLINE: 312,
  PLAYERS_MAX: 1000,
  SERVER_TPS: 19.98,
  SERVER_PING: 14,
  SERVER_UPTIME: '11 วัน 4 ชม.',

  // Default New Character Attributes
  DEFAULT_PLAYER_NAME: 'Intrachai_Knight',
  DEFAULT_PLAYER_EMAIL: 'natthapom.srihanok@intrachai.ac.th',
  STARTING_GOLD: 15420,
  STARTING_POINTS: 850,
  STARTING_LEVEL: 42,
  STARTING_CLASS: 'Warrior (นักรบ)',
};
