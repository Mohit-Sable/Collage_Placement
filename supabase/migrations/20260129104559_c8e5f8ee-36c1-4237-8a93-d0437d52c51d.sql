-- Create role enum
CREATE TYPE public.app_role AS ENUM ('student', 'placement_head', 'company');

-- User roles table (security best practice)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Get user role function
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id LIMIT 1
$$;

-- RLS for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own role" ON public.user_roles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Student profiles table
CREATE TABLE public.student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  branch TEXT,
  year_of_graduation INTEGER,
  cgpa NUMERIC(3,2) CHECK (cgpa >= 0 AND cgpa <= 10),
  skills TEXT[] DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',
  projects JSONB DEFAULT '[]',
  internships JSONB DEFAULT '[]',
  resume_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_placed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;

-- Student profile RLS
CREATE POLICY "Students can view their own profile" ON public.student_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Students can update their own profile" ON public.student_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Students can insert their own profile" ON public.student_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Placement heads can view all student profiles" ON public.student_profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'placement_head'));

CREATE POLICY "Placement heads can update student profiles" ON public.student_profiles
  FOR UPDATE USING (public.has_role(auth.uid(), 'placement_head'));

CREATE POLICY "Companies can view verified student profiles" ON public.student_profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'company') AND is_verified = true);

-- Company profiles table
CREATE TABLE public.company_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  industry TEXT,
  description TEXT,
  logo_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.company_profiles ENABLE ROW LEVEL SECURITY;

-- Company profile RLS
CREATE POLICY "Companies can view their own profile" ON public.company_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Companies can update their own profile" ON public.company_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Companies can insert their own profile" ON public.company_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Placement heads can view all company profiles" ON public.company_profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'placement_head'));

CREATE POLICY "Placement heads can update company profiles" ON public.company_profiles
  FOR UPDATE USING (public.has_role(auth.uid(), 'placement_head'));

CREATE POLICY "Students can view verified company profiles" ON public.company_profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'student') AND is_verified = true);

-- Placement head profiles
CREATE TABLE public.placement_head_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  department TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.placement_head_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Placement heads can manage their own profile" ON public.placement_head_profiles
  FOR ALL USING (auth.uid() = user_id);

-- Job postings table
CREATE TABLE public.job_postings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.company_profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  required_skills TEXT[] DEFAULT '{}',
  min_cgpa NUMERIC(3,2) DEFAULT 0,
  eligible_branches TEXT[] DEFAULT '{}',
  graduation_year INTEGER,
  salary_package TEXT,
  openings INTEGER DEFAULT 1,
  application_deadline TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;

-- Job postings RLS
CREATE POLICY "Companies can manage their own job postings" ON public.job_postings
  FOR ALL USING (company_id IN (SELECT id FROM public.company_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Students can view active job postings" ON public.job_postings
  FOR SELECT USING (public.has_role(auth.uid(), 'student') AND is_active = true);

CREATE POLICY "Placement heads can view all job postings" ON public.job_postings
  FOR SELECT USING (public.has_role(auth.uid(), 'placement_head'));

CREATE POLICY "Placement heads can update job postings" ON public.job_postings
  FOR UPDATE USING (public.has_role(auth.uid(), 'placement_head'));

-- Applications table
CREATE TYPE public.application_status AS ENUM ('pending', 'shortlisted', 'interview_scheduled', 'selected', 'rejected');

CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.student_profiles(id) ON DELETE CASCADE NOT NULL,
  job_id UUID REFERENCES public.job_postings(id) ON DELETE CASCADE NOT NULL,
  status application_status DEFAULT 'pending',
  interview_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (student_id, job_id)
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Applications RLS
CREATE POLICY "Students can view their own applications" ON public.applications
  FOR SELECT USING (student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Students can create applications" ON public.applications
  FOR INSERT WITH CHECK (student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Companies can view applications for their jobs" ON public.applications
  FOR SELECT USING (job_id IN (
    SELECT jp.id FROM public.job_postings jp
    JOIN public.company_profiles cp ON jp.company_id = cp.id
    WHERE cp.user_id = auth.uid()
  ));

CREATE POLICY "Companies can update applications for their jobs" ON public.applications
  FOR UPDATE USING (job_id IN (
    SELECT jp.id FROM public.job_postings jp
    JOIN public.company_profiles cp ON jp.company_id = cp.id
    WHERE cp.user_id = auth.uid()
  ));

CREATE POLICY "Placement heads can view all applications" ON public.applications
  FOR SELECT USING (public.has_role(auth.uid(), 'placement_head'));

CREATE POLICY "Placement heads can update applications" ON public.applications
  FOR UPDATE USING (public.has_role(auth.uid(), 'placement_head'));

-- Announcements table
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  target_audience app_role,
  created_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Placement heads can manage announcements" ON public.announcements
  FOR ALL USING (public.has_role(auth.uid(), 'placement_head'));

CREATE POLICY "Users can view announcements for their role" ON public.announcements
  FOR SELECT USING (
    is_active = true AND (
      target_audience IS NULL OR 
      target_audience = public.get_user_role(auth.uid())
    )
  );

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_student_profiles_updated_at
  BEFORE UPDATE ON public.student_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_company_profiles_updated_at
  BEFORE UPDATE ON public.company_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_postings_updated_at
  BEFORE UPDATE ON public.job_postings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();