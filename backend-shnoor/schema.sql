-- Enable UUID and PGCrypto extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- 1. USERS & PROFILES
-- ==========================================

CREATE TABLE IF NOT EXISTS users (
    user_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    firebase_uid VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'student', 'instructor', 'admin'
    status VARCHAR(50) DEFAULT 'pending', -- 'active', 'pending', 'blocked'
    bio TEXT,
    headline TEXT,
    linkedin TEXT,
    github TEXT,
    photo_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS instructor_profiles (
    profile_id SERIAL PRIMARY KEY,
    instructor_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    subject VARCHAR(255),
    phone VARCHAR(50),
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 2. COURSES & MODULES
-- ==========================================

CREATE TABLE IF NOT EXISTS courses (
    courses_id SERIAL PRIMARY KEY,
    instructor_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    thumbnail_url TEXT,
    difficulty VARCHAR(50), -- 'Beginner', 'Intermediate', 'Advanced'
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'pending', 'approved', 'rejected'
    validity_value INT,
    validity_unit VARCHAR(20), -- 'days', 'months', 'years'
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS modules (
    module_id SERIAL PRIMARY KEY,
    course_id INT REFERENCES courses(courses_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50), -- 'video', 'quiz', etc.
    duration_mins INT,
    module_order INT,
    content_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS module_progress (
    progress_id SERIAL PRIMARY KEY,
    student_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    course_id INT REFERENCES courses(courses_id) ON DELETE CASCADE,
    module_id INT REFERENCES modules(module_id) ON DELETE CASCADE,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, module_id)
);

-- ==========================================
-- 3. ENROLLMENTS & ASSIGNMENTS
-- ==========================================

-- Used for tracking enrollments
CREATE TABLE IF NOT EXISTS student_courses (
    id SERIAL PRIMARY KEY,
    student_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    course_id INT REFERENCES courses(courses_id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'enrolled',
    progress INT DEFAULT 0,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, course_id)
);

-- Also used for enrollments (redundancy in code requires this)
CREATE TABLE IF NOT EXISTS course_assignments (
    assignment_id SERIAL PRIMARY KEY,
    course_id INT REFERENCES courses(courses_id) ON DELETE CASCADE,
    student_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(course_id, student_id)
);

-- Specific Assignments/Tasks within a course
CREATE TABLE IF NOT EXISTS assignments (
    assignment_id SERIAL PRIMARY KEY,
    course_id INT REFERENCES courses(courses_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 4. EXAMS
-- ==========================================

CREATE TABLE IF NOT EXISTS exams (
    exam_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration INT, -- in minutes
    pass_percentage FLOAT,
    instructor_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    course_id INT REFERENCES courses(courses_id) ON DELETE CASCADE,
    validity_value INT,
    validity_unit VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exam_questions (
    question_id SERIAL PRIMARY KEY,
    exam_id INT REFERENCES exams(exam_id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    marks INT DEFAULT 1,
    question_order INT,
    question_type VARCHAR(50), -- 'mcq', 'coding', 'descriptive'
    options JSONB, -- For simple MCQs stored as JSON
    correct_option TEXT -- For simple MCQs
);

CREATE TABLE IF NOT EXISTS exam_mcq_options (
    option_id SERIAL PRIMARY KEY,
    question_id INT REFERENCES exam_questions(question_id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS exam_coding_questions (
    coding_id SERIAL PRIMARY KEY,
    question_id INT REFERENCES exam_questions(question_id) ON DELETE CASCADE,
    title VARCHAR(255),
    description TEXT,
    language VARCHAR(50),
    starter_code TEXT
);

CREATE TABLE IF NOT EXISTS exam_test_cases (
    test_case_id SERIAL PRIMARY KEY,
    coding_id INT REFERENCES exam_coding_questions(coding_id) ON DELETE CASCADE,
    input TEXT,
    expected_output TEXT,
    is_hidden BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS exam_submissions (
    submission_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    exam_id INT REFERENCES exams(exam_id) ON DELETE CASCADE,
    student_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    score FLOAT,
    status VARCHAR(50), -- 'passed', 'failed', 'submitted'
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 5. CHAT & MESSAGING (Handled by Chat Controller usually)
-- ==========================================

CREATE TABLE IF NOT EXISTS files (
    file_id SERIAL PRIMARY KEY,
    filename TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    data BYTEA NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chats (
    chat_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    instructor_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_instructor_student_chat UNIQUE (instructor_id, student_id)
);

CREATE TABLE IF NOT EXISTS messages (
    message_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    chat_id UUID NOT NULL REFERENCES chats(chat_id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    attachment_file_id INT REFERENCES files(file_id),
    attachment_type VARCHAR(50),
    attachment_name TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
