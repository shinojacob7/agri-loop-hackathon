-- Run this in the Supabase SQL Editor to add the missing columns needed for the Map and Matching Engine!

-- 1. Add coordinates to the users table (For the Farmer's default location)
ALTER TABLE public.users
ADD COLUMN latitude numeric,
ADD COLUMN longitude numeric;

-- 2. Add coordinates and dates to the resources table (Crucial for the Leaflet Map and Haversine Distance!)
ALTER TABLE public.resources
ADD COLUMN latitude numeric,
ADD COLUMN longitude numeric,
ADD COLUMN available_from date,
ADD COLUMN available_until date;

-- 3. Add requested quantity to the requests table
ALTER TABLE public.requests
ADD COLUMN requested_quantity numeric;
