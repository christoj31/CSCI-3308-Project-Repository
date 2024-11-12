--Create Look Up Tables to build our dropdown buttons
  --Create the application steps dropdown options
    CREATE TABLE application_steps (
      stepID SERIAL PRIMARY KEY,
      stepName VARCHAR(20) NOT NULL
    );

    INSERT INTO application_steps (stepID, stepName) VALUES 
    (1, 'Applied'), 
    (2, 'Interviews'), 
    (3, 'Offer'), 
    (4, 'Rejected');

  --Create the thank you letter send status
    CREATE TABLE thank_you_status (
      statusID SERIAL PRIMARY KEY,
      status VARCHAR(6) NOT NULL
    );

    INSERT INTO thank_you_status (statusID, status) VALUES 
    (1, 'unsent'), 
    (2, 'sent');

  --Create the resume stage dropdown options
    CREATE TABLE resume_stage (
      stageID SERIAL PRIMARY KEY,
      stageName VARCHAR(10) NOT NULL
    );

    INSERT INTO resume_stage (stageID, stageName) VALUES 
    (1, 'unwritten'),
    (2, 'written'),
    (3, 'tailored'),
    (4, 'AI checked');

  --Create the contacted dropdown options
    CREATE TABLE contacted_status (
      statusID SERIAL PRIMARY KEY,
      status VARCHAR(3) NOT NULL
    );

    INSERT INTO contacted_status (statusID, status) VALUES 
    (1, 'no'),
    (2, 'yes');

--Create the primary entity tables
  CREATE TABLE users (
    userID SERIAL PRIMARY KEY,
    username VARCHAR(45) UNIQUE NOT NULL,
    password VARCHAR(45) NOT NULL,
    email VARCHAR(45) UNIQUE NOT NULL,
    phoneNumber VARCHAR(45) UNIQUE
  );

  CREATE TABLE resume (
    resumeID SERIAL PRIMARY KEY,
    resumeStageID INT DEFAULT 1,
    FOREIGN KEY (resumeStageID) REFERENCES resume_stage (stageID) 
      ON DELETE SET NULL 
      ON UPDATE CASCADE
  );

  CREATE TABLE company (
    companyID SERIAL PRIMARY KEY,
    name VARCHAR(45) NOT NULL,
    industry VARCHAR(45) NOT NULL,
    location VARCHAR(45)
  );

  CREATE TABLE pointOfContact (
    pocID SERIAL PRIMARY KEY,
    firstName VARCHAR(45) NOT NULL,
    lastName VARCHAR(45) NOT NULL,
    email VARCHAR(45) UNIQUE,
    phoneNumber VARCHAR(45) UNIQUE,
    linkedIn VARCHAR(100)
  );

  CREATE TABLE meetings (
    meetingID SERIAL PRIMARY KEY,
    meetingDate DATE NOT NULL,
    thankYouStatusID INT DEFAULT 1,  -- Set default to 'unsent' (adjust if needed)
    FOREIGN KEY (thankYouStatusID) REFERENCES thank_you_status (statusID) 
      ON DELETE SET NULL 
      ON UPDATE CASCADE
  );

  CREATE TABLE contactAttempt (
    attemptID SERIAL PRIMARY KEY,
    contactedStatusID INT DEFAULT 1,
    contactDate DATE NOT NULL,
    followUpDate DATE GENERATED ALWAYS AS (contactDate + INTERVAL '4 days') STORED,
    meetingID INT,
    FOREIGN KEY (contactedStatusID) REFERENCES contacted_status (statusID) 
      ON DELETE SET NULL 
      ON UPDATE CASCADE,
    FOREIGN KEY (meetingID) REFERENCES meetings (meetingID) 
      ON DELETE SET NULL 
      ON UPDATE CASCADE
  );

  CREATE TABLE jobs (
    jobID SERIAL PRIMARY KEY,
    jobTitle VARCHAR(100) NOT NULL,
    jobApplicationLink VARCHAR(100) NOT NULL,
    applicationStepID INT,
    resumeID INT,
    pocID INT,
    attemptID INT,
    FOREIGN KEY (applicationStepID) REFERENCES application_steps (stepID) 
      ON DELETE SET NULL 
      ON UPDATE CASCADE,
    FOREIGN KEY (resumeID) REFERENCES resume (resumeID) 
      ON DELETE SET NULL 
      ON UPDATE CASCADE,
    FOREIGN KEY (pocID) REFERENCES pointOfContact (pocID) 
      ON DELETE SET NULL 
      ON UPDATE CASCADE,
    FOREIGN KEY (attemptID) REFERENCES contactAttempt (attemptID) 
      ON DELETE SET NULL 
      ON UPDATE CASCADE
  );

  CREATE TABLE userJobs (
    userID INT NOT NULL,
    jobID INT NOT NULL,
    PRIMARY KEY (userID, jobID),
    FOREIGN KEY (userID) REFERENCES users (userID) 
      ON DELETE CASCADE 
      ON UPDATE CASCADE,
    FOREIGN KEY (jobID) REFERENCES jobs (jobID) 
      ON DELETE CASCADE 
      ON UPDATE CASCADE
  );

  CREATE TABLE trackingTable (
    userCount INT DEFAULT 0,
    jobCount INT DEFAULT 0,
    resumeCount INT DEFAULT 0,
    companyCount INT DEFAULT 0,
    pointOfContactCount INT DEFAULT 0,
    contactAttemptCount INT DEFAULT 0,
    meetingCount INT DEFAULT 0
  );