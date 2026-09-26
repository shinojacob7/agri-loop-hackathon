-- Run this in the Supabase SQL Editor to set up the AgriLoop Database

-- 1. Create Profiles Table (Farmers and Providers)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('FARMER', 'PROVIDER')),
  full_name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Resources Table (Listed by Providers)
CREATE TABLE resources (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  provider_id UUID REFERENCES profiles(id) NOT NULL,
  resource_type TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  available_from DATE,
  available_until DATE,
  status TEXT DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'REQUESTED', 'RESERVED', 'COMPLETED', 'UNAVAILABLE')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Requests Table (Farmers requesting Resources)
CREATE TABLE requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  resource_id UUID REFERENCES resources(id) NOT NULL,
  farmer_id UUID REFERENCES profiles(id) NOT NULL,
  provider_id UUID REFERENCES profiles(id) NOT NULL,
  requested_quantity NUMERIC NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

-- 5. Create basic RLS policies (Allow read/write for all authenticated users for the hackathon MVP)
CREATE POLICY "Enable read access for all authenticated users" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable insert for authenticated users" ON profiles FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for users based on id" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Enable read access for all authenticated users" ON resources FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable insert for authenticated users" ON resources FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for users based on provider_id" ON resources FOR UPDATE TO authenticated USING (auth.uid() = provider_id);

CREATE POLICY "Enable read access for all authenticated users" ON requests FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable insert for authenticated users" ON requests FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON requests FOR UPDATE TO authenticated USING (true);
