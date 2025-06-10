CREATE SCHEMA IF NOT EXISTS "synopticProjectRegistration";

CREATE TABLE IF NOT EXISTS "synopticProjectRegistration".users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS "synopticProjectRegistration".water_requests (
  id SERIAL PRIMARY KEY,
  litres DECIMAL NOT NULL,
  urgency VARCHAR(10) NOT NULL,
  contact_info VARCHAR(255) NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  request_completed BOOLEAN NOT NULL,
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);


CREATE TABLE IF NOT EXISTS "synopticProjectRegistration".water_energy_trades (
  id SERIAL PRIMARY KEY,
  trade_type VARCHAR(10) NOT NULL CHECK (trade_type IN ('water', 'energy')), -- this checks if the user is giving water or energy
  amount DECIMAL NOT NULL,  
  calculated_return DECIMAL NOT NULL, 
  user_id VARCHAR(255) NOT NULL,
  contact_info VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
