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

CREATE TABLE IF NOT EXISTS "synopticProjectRegistration".reservoirs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  capacity DECIMAL NOT NULL, -- total capacity in litres
  current_level DECIMAL NOT NULL, -- current water available in litres
  status VARCHAR(20) NOT NULL DEFAULT 'active' -- 'active' or 'maintenance'
);

INSERT INTO "synopticProjectRegistration".reservoirs (name, capacity, current_level, status) VALUES
('North Valley Reservoir', 100000, 80000, 'active'),
('Youth Centre Reservoir', 50000, 40000, 'active'),
('Heritage Site Reservoir', 60000, 55000, 'active'),
('Westside Water Tank', 40000, 35000, 'active'),
('Sports Complex Tank', 30000, 25000, 'active'),
('Main Community Reservoir', 120000, 100000, 'active'),
('Central Market Reservoir', 70000, 60000, 'active'),
('Community Park Tank', 35000, 30000, 'active'),
('South Valley Tank', 45000, 40000, 'active'),
('East Valley Tank', 50000, 0, 'maintenance');