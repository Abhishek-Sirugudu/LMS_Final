-- 0. Enable UUID Extension (Required for gen_random_uuid())
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- #1. users table
CREATE TABLE IF NOT EXISTS users
(
    user_id uuid NOT NULL DEFAULT gen_random_uuid(),
    firebase_uid character varying(128) COLLATE pg_catalog."default" NOT NULL,
    full_name character varying(100) COLLATE pg_catalog."default",
    email character varying(150) COLLATE pg_catalog."default" NOT NULL,
    role character varying(20) COLLATE pg_catalog."default" DEFAULT 'student'::character varying,
    status character varying(20) COLLATE pg_catalog."default" DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    last_active_date date,
    streak integer DEFAULT 0,
    xp integer DEFAULT 0,
    bio text COLLATE pg_catalog."default",
    headline character varying(150) COLLATE pg_catalog."default",
    linkedin character varying(255) COLLATE pg_catalog."default",
    github character varying(255) COLLATE pg_catalog."default",
    photo_url text COLLATE pg_catalog."default",
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_pkey PRIMARY KEY (user_id),
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_firebase_uid_key UNIQUE (firebase_uid)
); -- <--- Added Semicolon

-- #2. instructor profiles table
CREATE TABLE IF NOT EXISTS instructor_profiles
(
    instructor_id uuid NOT NULL,
    subject character varying(100) COLLATE pg_catalog."default" NOT NULL,
    phone character varying(20) COLLATE pg_catalog."default",
    bio text COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT instructor_profiles_pkey PRIMARY KEY (instructor_id),
    CONSTRAINT instructor_profiles_fk FOREIGN KEY (instructor_id)
        REFERENCES public.users (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT instructor_profiles_instructor_id_fkey FOREIGN KEY (instructor_id)
        REFERENCES public.users (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
); -- <--- Added Semicolon

-- #3. courses table
CREATE TABLE IF NOT EXISTS courses
(
    courses_id uuid NOT NULL DEFAULT gen_random_uuid(),
    instructor_id uuid NOT NULL,
    title character varying(255) COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    category character varying(100) COLLATE pg_catalog."default",
    status character varying(20) COLLATE pg_catalog."default" DEFAULT 'pending'::character varying,
    difficulty character varying(20) COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    thumbnail_url text COLLATE pg_catalog."default",
    validity_value integer,
    validity_unit character varying(10) COLLATE pg_catalog."default",
    expires_at timestamp without time zone,
    is_paid boolean DEFAULT false,
    price numeric(10,2) DEFAULT 0.00,
    scheduled_at timestamp without time zone,
    CONSTRAINT courses_pkey PRIMARY KEY (courses_id),
    CONSTRAINT courses_instructor_id_fkey FOREIGN KEY (instructor_id)
        REFERENCES public.users (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT courses_difficulty_check CHECK (difficulty::text = ANY (ARRAY['Beginner'::character varying, 'Intermediate'::character varying, 'Advanced'::character varying]::text[])),
    CONSTRAINT courses_status_check CHECK (status::text = ANY (ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying]::text[])),
    CONSTRAINT courses_validity_unit_check CHECK (validity_unit::text = ANY (ARRAY['days'::character varying, 'months'::character varying, 'years'::character varying]::text[]))
); -- <--- Added Semicolon

-- #4. modules table
CREATE TABLE IF NOT EXISTS modules
(
    module_id uuid NOT NULL DEFAULT gen_random_uuid(),
    course_id uuid NOT NULL,
    title character varying(255) COLLATE pg_catalog."default" NOT NULL,
    type character varying(50) COLLATE pg_catalog."default" NOT NULL,
    content_url text COLLATE pg_catalog."default",
    duration_mins integer,
    module_order integer NOT NULL,
    notes text COLLATE pg_catalog."default",
    pdf_data bytea,
    pdf_filename character varying(255) COLLATE pg_catalog."default",
    pdf_mime character varying(100) COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT modules_pkey PRIMARY KEY (module_id),
    CONSTRAINT modules_course_id_fkey FOREIGN KEY (course_id)
        REFERENCES public.courses (courses_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT modules_duration_mins_check CHECK (duration_mins >= 0),
    CONSTRAINT modules_module_order_check CHECK (module_order > 0)
); -- <--- Added Semicolon

-- #5. module progress table
CREATE TABLE IF NOT EXISTS module_progress
(
    student_id uuid NOT NULL,
    course_id uuid NOT NULL,
    module_id uuid NOT NULL,
    completed_at timestamp without time zone,
    last_accessed_at timestamp without time zone,
    CONSTRAINT module_progress_pkey PRIMARY KEY (student_id, module_id),
    CONSTRAINT module_progress_course_id_fkey FOREIGN KEY (course_id)
        REFERENCES public.courses (courses_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT module_progress_module_id_fkey FOREIGN KEY (module_id)
        REFERENCES public.modules (module_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT module_progress_student_id_fkey FOREIGN KEY (student_id)
        REFERENCES public.users (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
); -- <--- Added Semicolon

-- #6. course_assignments table
CREATE TABLE IF NOT EXISTS course_assignments
(
    assignment_id uuid NOT NULL DEFAULT gen_random_uuid(),
    course_id uuid NOT NULL,
    student_id uuid NOT NULL,
    assigned_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT course_assignments_pkey PRIMARY KEY (assignment_id),
    CONSTRAINT unique_student_course UNIQUE (course_id, student_id),
    CONSTRAINT course_assignments_course_id_fkey FOREIGN KEY (course_id)
        REFERENCES public.courses (courses_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT course_assignments_student_id_fkey FOREIGN KEY (student_id)
        REFERENCES public.users (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
); -- <--- Added Semicolon

-- #7. exams table
CREATE TABLE IF NOT EXISTS exams
(
    exam_id uuid NOT NULL DEFAULT gen_random_uuid(),
    title character varying(255) COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    duration integer NOT NULL,
    pass_percentage integer NOT NULL,
    instructor_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    course_id uuid,
    validity_value integer,
    validity_unit character varying(10) COLLATE pg_catalog."default",
    CONSTRAINT exams_pkey PRIMARY KEY (exam_id),
    CONSTRAINT exams_course_id_fkey FOREIGN KEY (course_id)
        REFERENCES public.courses (courses_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL,
    CONSTRAINT exams_instructor_id_fkey FOREIGN KEY (instructor_id)
        REFERENCES public.users (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT exams_duration_check CHECK (duration > 0),
    CONSTRAINT exams_pass_percentage_check CHECK (pass_percentage >= 0 AND pass_percentage <= 100),
    CONSTRAINT exams_validity_logic_check CHECK (course_id IS NULL AND validity_value IS NOT NULL AND validity_unit IS NOT NULL OR course_id IS NOT NULL AND validity_value IS NULL AND validity_unit IS NULL)
); -- <--- Added Semicolon

-- #8. exam questions table
CREATE TABLE IF NOT EXISTS exam_questions
(
    question_id uuid NOT NULL DEFAULT gen_random_uuid(),
    exam_id uuid NOT NULL,
    question_text text COLLATE pg_catalog."default" NOT NULL,
    marks integer NOT NULL,
    question_order integer NOT NULL,
    question_type character varying(20) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT exam_questions_pkey PRIMARY KEY (question_id),
    CONSTRAINT exam_questions_exam_id_fkey FOREIGN KEY (exam_id)
        REFERENCES public.exams (exam_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT exam_questions_marks_check CHECK (marks > 0),
    CONSTRAINT exam_questions_question_order_check CHECK (question_order > 0),
    CONSTRAINT exam_questions_question_type_check CHECK (question_type::text = ANY (ARRAY['mcq'::character varying, 'descriptive'::character varying, 'coding'::character varying]::text[]))
); -- <--- Added Semicolon

-- #9. exam mcq options
CREATE TABLE IF NOT EXISTS exam_mcq_options
(
    option_id uuid NOT NULL DEFAULT gen_random_uuid(),
    question_id uuid NOT NULL,
    option_text text COLLATE pg_catalog."default" NOT NULL,
    is_correct boolean DEFAULT false,
    CONSTRAINT exam_mcq_options_pkey PRIMARY KEY (option_id),
    CONSTRAINT exam_mcq_options_question_id_fkey FOREIGN KEY (question_id)
        REFERENCES public.exam_questions (question_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
); -- <--- Added Semicolon

-- #10. exam coding questions
CREATE TABLE IF NOT EXISTS exam_coding_questions
(
    coding_id uuid NOT NULL DEFAULT gen_random_uuid(),
    question_id uuid NOT NULL,
    title character varying(255) COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default" NOT NULL,
    starter_code text COLLATE pg_catalog."default",
    language character varying(50) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT exam_coding_questions_pkey PRIMARY KEY (coding_id),
    CONSTRAINT unique_coding_question UNIQUE (question_id),
    CONSTRAINT exam_coding_questions_question_id_fkey FOREIGN KEY (question_id)
        REFERENCES public.exam_questions (question_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
); -- <--- Added Semicolon

-- #11. exam_submission table
CREATE TABLE IF NOT EXISTS exam_submissions
(
    submission_id uuid NOT NULL DEFAULT gen_random_uuid(),
    exam_id uuid NOT NULL,
    student_id uuid NOT NULL,
    answers jsonb NOT NULL,
    submitted_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT exam_submissions_pkey PRIMARY KEY (submission_id),
    CONSTRAINT exam_submissions_exam_id_student_id_key UNIQUE (exam_id, student_id)
); -- <--- Added Semicolon

-- #12. exam_answers table
CREATE TABLE IF NOT EXISTS exam_answers
(
    answer_id uuid NOT NULL DEFAULT gen_random_uuid(),
    exam_id uuid NOT NULL,
    question_id uuid NOT NULL,
    student_id uuid NOT NULL,
    answer_text text COLLATE pg_catalog."default",
    selected_option_id uuid,
    code_submission text COLLATE pg_catalog."default",
    marks_obtained integer DEFAULT 0,
    submitted_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT exam_answers_pkey PRIMARY KEY (answer_id),
    CONSTRAINT unique_answer_per_question UNIQUE (exam_id, question_id, student_id),
    CONSTRAINT exam_answers_exam_id_fkey FOREIGN KEY (exam_id)
        REFERENCES public.exams (exam_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT exam_answers_question_id_fkey FOREIGN KEY (question_id)
        REFERENCES public.exam_questions (question_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT exam_answers_selected_option_id_fkey FOREIGN KEY (selected_option_id)
        REFERENCES public.exam_mcq_options (option_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL,
    CONSTRAINT exam_answers_student_id_fkey FOREIGN KEY (student_id)
        REFERENCES public.users (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT exam_answers_marks_obtained_check CHECK (marks_obtained >= 0)
); -- <--- Added Semicolon

-- #13. exam_test_cases table
CREATE TABLE IF NOT EXISTS exam_test_cases
(
    testcase_id uuid NOT NULL DEFAULT gen_random_uuid(),
    coding_id uuid NOT NULL,
    input text COLLATE pg_catalog."default" NOT NULL,
    expected_output text COLLATE pg_catalog."default" NOT NULL,
    is_hidden boolean DEFAULT false,
    CONSTRAINT exam_test_cases_pkey PRIMARY KEY (testcase_id),
    CONSTRAINT exam_test_cases_coding_id_fkey FOREIGN KEY (coding_id)
        REFERENCES public.exam_coding_questions (coding_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
); -- <--- Added Semicolon

-- #14. exam_results table
CREATE TABLE IF NOT EXISTS exam_results
(
    result_id uuid NOT NULL DEFAULT gen_random_uuid(),
    exam_id uuid NOT NULL,
    student_id uuid NOT NULL,
    total_marks integer NOT NULL,
    obtained_marks integer NOT NULL,
    percentage numeric(5,2) NOT NULL,
    passed boolean NOT NULL,
    evaluated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT exam_results_pkey PRIMARY KEY (result_id),
    CONSTRAINT unique_exam_student UNIQUE (exam_id, student_id),
    CONSTRAINT exam_results_exam_id_fkey FOREIGN KEY (exam_id)
        REFERENCES public.exams (exam_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT exam_results_student_id_fkey FOREIGN KEY (student_id)
        REFERENCES public.users (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT exam_results_obtained_marks_check CHECK (obtained_marks >= 0),
    CONSTRAINT exam_results_percentage_check CHECK (percentage >= 0::numeric AND percentage <= 100::numeric),
    CONSTRAINT exam_results_total_marks_check CHECK (total_marks >= 0),
    CONSTRAINT marks_valid CHECK (obtained_marks <= total_marks)
); -- <--- Added Semicolon

-- #15. practice challenges table
CREATE TABLE IF NOT EXISTS practice_challenges
(
    challenge_id uuid NOT NULL DEFAULT gen_random_uuid(),
    title character varying(255) COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    difficulty character varying(20) NOT NULL, -- Simplified from enum for safety
    type character varying(20) NOT NULL, -- Simplified from enum for safety
    starter_code text COLLATE pg_catalog."default",
    test_cases jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT practice_challenges_pkey PRIMARY KEY (challenge_id)
); 

-- #16. practice submissions table
CREATE TABLE IF NOT EXISTS practice_submissions
(
    submission_id uuid NOT NULL DEFAULT gen_random_uuid(),
    student_id uuid NOT NULL,
    challenge_id uuid NOT NULL,
    code text COLLATE pg_catalog."default" NOT NULL,
    status character varying(20) COLLATE pg_catalog."default",
    submitted_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT practice_submissions_pkey PRIMARY KEY (submission_id),
    CONSTRAINT fk_challenge FOREIGN KEY (challenge_id)
        REFERENCES public.practice_challenges (challenge_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT fk_student FOREIGN KEY (student_id)
        REFERENCES public.users (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT practice_submissions_status_check CHECK (status::text = ANY (ARRAY['Solved'::character varying, 'Attempted'::character varying]::text[]))
); -- <--- Added Semicolon

-- #17. student-courses table
CREATE TABLE IF NOT EXISTS student_courses
(
    student_id uuid NOT NULL,
    course_id uuid NOT NULL,
    enrolled_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT student_courses_pkey PRIMARY KEY (student_id, course_id),
    CONSTRAINT student_courses_course_id_fkey FOREIGN KEY (course_id)
        REFERENCES public.courses (courses_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT student_courses_student_id_fkey FOREIGN KEY (student_id)
        REFERENCES public.users (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
); -- <--- Added Semicolon

select * from users;

UPDATE users 
SET role = 'admin', status = 'active' 
WHERE email = 'admin@shnoor.com';


SELECT user_id, full_name, email, role, status, firebase_uid
FROM users
WHERE email = 'admin@shnoor.com';




-- #18. Assignments Table
CREATE TABLE IF NOT EXISTS assignments (
    assignment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date TIMESTAMP WITHOUT TIME ZONE,
    max_marks INTEGER DEFAULT 100,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT assignments_course_id_fkey FOREIGN KEY (course_id)
        REFERENCES public.courses (courses_id)
        ON DELETE CASCADE,
    CONSTRAINT assignments_max_marks_check CHECK (max_marks > 0)
);

-- #19. Assignment Submissions Table
CREATE TABLE IF NOT EXISTS assignment_submissions (
    submission_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL,
    student_id UUID NOT NULL,
    file_url TEXT,
    text_answer TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    grade INTEGER,
    feedback TEXT,
    submitted_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    graded_at TIMESTAMP WITHOUT TIME ZONE,
    
    CONSTRAINT assignment_submissions_assignment_id_fkey FOREIGN KEY (assignment_id)
        REFERENCES public.assignments (assignment_id)
        ON DELETE CASCADE,
    CONSTRAINT assignment_submissions_student_id_fkey FOREIGN KEY (student_id)
        REFERENCES public.users (user_id)
        ON DELETE CASCADE,
    CONSTRAINT unique_submission_per_assignment UNIQUE (assignment_id, student_id),
    CONSTRAINT assignment_submissions_status_check CHECK (status IN ('pending', 'submitted', 'graded')),
    CONSTRAINT assignment_submissions_grade_check CHECK (grade IS NULL OR grade >= 0)
);

-- #20. Chats Table (Links to users)
CREATE TABLE IF NOT EXISTS chats (
    chat_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instructor_id UUID NOT NULL,
    student_id UUID NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Key Constraints referencing 'user_id' instead of 'id'
    CONSTRAINT chats_instructor_fkey FOREIGN KEY (instructor_id)
        REFERENCES public.users (user_id) MATCH SIMPLE
        ON DELETE CASCADE,
    CONSTRAINT chats_student_fkey FOREIGN KEY (student_id)
        REFERENCES public.users (user_id) MATCH SIMPLE
        ON DELETE CASCADE
);

-- #21. Messages Table (Links to chats, users, and files)
CREATE TABLE IF NOT EXISTS messages (
    message_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID NOT NULL,
    sender_id UUID NOT NULL,
    receiver_id UUID NOT NULL,
    text TEXT,
    attachment_file_id INT, 
    attachment_type VARCHAR(50),
    attachment_name VARCHAR(255),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Foreign Key Constraints
    CONSTRAINT messages_chat_id_fkey FOREIGN KEY (chat_id) 
        REFERENCES public.chats (chat_id) 
        ON DELETE CASCADE,
    CONSTRAINT messages_sender_fkey FOREIGN KEY (sender_id) 
        REFERENCES public.users (user_id) -- Fixed: references user_id
        ON DELETE CASCADE,
    CONSTRAINT messages_receiver_fkey FOREIGN KEY (receiver_id) 
        REFERENCES public.users (user_id) -- Fixed: references user_id
        ON DELETE CASCADE,
    CONSTRAINT messages_file_fkey FOREIGN KEY (attachment_file_id) 
        REFERENCES public.files (file_id) 
        ON DELETE SET NULL
);

select * from chats;


select * from messages;