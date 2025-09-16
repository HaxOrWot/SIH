/*
  # Initial Database Schema Setup

  1. New Tables
    - `profiles` - User profile information with roles
    - `courses` - Course management
    - `activities` - Curriculum activities
    - `attendance` - Attendance tracking
    - `enrollments` - Course enrollments

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Create trigger for automatic profile creation

  3. Sample Data
    - Add sample courses and activities for testing
*/

-- Create user profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('student', 'admin')) DEFAULT 'student',
  student_id TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create courses table
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  instructor_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create curriculum activities table
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('lecture', 'lab', 'assignment', 'exam', 'project')),
  scheduled_date TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')) DEFAULT 'absent',
  check_in_time TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(activity_id, student_id)
);

-- Create course enrollments table
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(course_id, student_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for courses
CREATE POLICY "Everyone can view courses" ON public.courses
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage courses" ON public.courses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for activities
CREATE POLICY "Students can view activities for enrolled courses" ON public.activities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.enrollments e
      WHERE e.course_id = activities.course_id 
      AND e.student_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage activities" ON public.activities
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for attendance
CREATE POLICY "Students can view their own attendance" ON public.attendance
  FOR SELECT USING (
    student_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage attendance" ON public.attendance
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for enrollments
CREATE POLICY "Students can view their own enrollments" ON public.enrollments
  FOR SELECT USING (
    student_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage enrollments" ON public.enrollments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, student_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'student'),
    NEW.raw_user_meta_data ->> 'student_id'
  );
  
  RETURN NEW;
END;
$$;

-- Trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Insert sample data for testing
INSERT INTO public.courses (name, code, description) VALUES
  ('Introduction to Computer Science', 'CS101', 'Basic concepts of computer science and programming'),
  ('Data Structures and Algorithms', 'CS201', 'Fundamental data structures and algorithmic techniques'),
  ('Database Systems', 'CS301', 'Design and implementation of database systems'),
  ('Web Development', 'CS350', 'Modern web development technologies and frameworks')
ON CONFLICT (code) DO NOTHING;

-- Insert sample activities
DO $$
DECLARE
  cs101_id UUID;
  cs201_id UUID;
  cs301_id UUID;
  cs350_id UUID;
BEGIN
  SELECT id INTO cs101_id FROM public.courses WHERE code = 'CS101';
  SELECT id INTO cs201_id FROM public.courses WHERE code = 'CS201';
  SELECT id INTO cs301_id FROM public.courses WHERE code = 'CS301';
  SELECT id INTO cs350_id FROM public.courses WHERE code = 'CS350';

  INSERT INTO public.activities (course_id, title, description, activity_type, scheduled_date, duration_minutes) VALUES
    (cs101_id, 'Introduction to Programming', 'Basic programming concepts and syntax', 'lecture', NOW() + INTERVAL '1 day', 90),
    (cs101_id, 'Programming Lab 1', 'Hands-on programming exercises', 'lab', NOW() + INTERVAL '2 days', 120),
    (cs201_id, 'Arrays and Linked Lists', 'Understanding linear data structures', 'lecture', NOW() + INTERVAL '3 days', 90),
    (cs201_id, 'Algorithm Analysis Assignment', 'Analyze time complexity of algorithms', 'assignment', NOW() + INTERVAL '1 week', 0),
    (cs301_id, 'Database Design Principles', 'Entity-relationship modeling', 'lecture', NOW() + INTERVAL '4 days', 90),
    (cs350_id, 'HTML and CSS Basics', 'Introduction to web markup and styling', 'lecture', NOW() + INTERVAL '5 days', 90),
    (cs350_id, 'JavaScript Fundamentals', 'Client-side scripting basics', 'lecture', NOW() + INTERVAL '6 days', 90),
    (cs101_id, 'Midterm Exam', 'Comprehensive exam covering first half of course', 'exam', NOW() + INTERVAL '2 weeks', 120)
  ON CONFLICT DO NOTHING;
END $$;