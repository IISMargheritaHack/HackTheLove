-- Table SurveysResponse
CREATE TABLE IF NOT EXISTS surveys_response (
    id_surveys SERIAL PRIMARY KEY, -- Primary key
    date_created TIMESTAMP DEFAULT NOW() -- Date of creation
);

-- Table Users
CREATE TABLE IF NOT EXISTS users (
    email SERIAL PRIMARY KEY, -- Primary key
    id_surveys INTEGER REFERENCES surveys_response(id_surveys) ON DELETE SET NULL, -- Id of the survey
    name VARCHAR(255) NOT NULL, -- Name
    date_created TIMESTAMP DEFAULT NOW() -- Date of creation
);

-- Table Images
CREATE TABLE IF NOT EXISTS images  (
    id_image SERIAL PRIMARY KEY, -- Primary key
    email_user INTEGER REFERENCES users(email) ON DELETE CASCADE, -- User reference
    lo_oid OID NOT NULL, -- File reference
    uploaded_at TIMESTAMP DEFAULT NOW(), -- Date of upload
    metadata JSONB -- Extra information
);
