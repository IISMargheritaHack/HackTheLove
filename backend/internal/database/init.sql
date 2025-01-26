-- Table SurveysResponse
CREATE TABLE IF NOT EXISTS surveys_response (
    id_surveys SERIAL PRIMARY KEY, -- Primary key
    response VARCHAR(11) NOT NULL, -- Response each letter i a response to a question
    date_created TIMESTAMP DEFAULT NOW() -- Date of creation
);

-- Table Users
CREATE TABLE IF NOT EXISTS users (
    email VARCHAR(100) PRIMARY KEY, -- Primary key
    id_surveys INTEGER REFERENCES surveys_response(id_surveys) ON DELETE SET NULL, -- Id of the survey
    name VARCHAR(255) NOT NULL, -- Name
    surname VARCHAR(255) NOT NULL, -- Surname
    phone VARCHAR(10), -- Phone
    sex BOOLEAN, -- Sex
    bio TEXT, -- Biography
    age INTEGER, -- Age
    section VARCHAR(1), -- Section
    date_created TIMESTAMP DEFAULT NOW() -- Date of creation
);

-- Table Images
CREATE TABLE IF NOT EXISTS images (
    id_image SERIAL PRIMARY KEY, -- Primary key
    email_user VARCHAR(100) REFERENCES users(email) ON DELETE CASCADE, -- User reference
    lo_oid OID NOT NULL, -- File reference
    uploaded_at TIMESTAMP DEFAULT NOW(), -- Date of upload
    metadata JSONB -- Extra information
);
