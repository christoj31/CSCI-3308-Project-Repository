DROP TABLE IF EXISTS leeds CASCADE;
CREATE TABLE IF NOT EXISTS leeds (
  job_id SERIAL PRIMARY KEY NOT NULL,
  job_name VARCHAR(50) NOT NULL,
  company VARCHAR(50) NOT NULL,
  date_applied VARCHAR NOT NULL,
  status VARCHAR(60) NOT NULL
);

CREATE TABLE users (
  userID INT PRIMARY KEY NOT NULL,
  username VARCHAR(45) NOT NULL,
  password VARCHAR(45) NOT NULL,
  email VARCHAR(45) NOT NULL,
  phoneNumber VARCHAR(45) NOT NULL
);

CREATE TABLE resume (
  resumeID INT PRIMARY KEY NOT NULL,
  resumeStage VARCHAR(45) NOT NULL
);

CREATE TABLE company (
  companyID INT PRIMARY KEY NOT NULL,
  name VARCHAR(45) NOT NULL,
  industry VARCHAR(45) NOT NULL,
  location VARCHAR(45) NOT NULL
);

CREATE TABLE point0fContact (
  pocID INT PRIMARY KEY NOT NULL,
  firstName VARCHAR(45) NOT NULL,
  lastName VARCHAR(45) NOT NULL,
  email VARCHAR(45) NOT NULL,
  phoneNumber VARCHAR(45) NOT NULL
);

CREATE TABLE jobs (
  jobID INT PRIMARY KEY NOT NULL,
  jobTitle VARCHAR(45) NOT NULL,
  jobApplicationLink LONGTEXT NOT NULL,
  applicationStep VARCHAR(45) NOT NULL,
  resumeID INT NOT NULL,
  pocID INT NOT NULL,
  attemptID INT NOT NULL,
  FOREIGN KEY (resumeID) REFERENCES resume (resumeID),
  FOREIGN KEY (pocID) REFERENCES point0fContact (pocID),
  FOREIGN KEY (attemptID) REFERENCES contactAttempt (attemptID)
);

CREATE TABLE userJobs (
  userID INT NOT NULL,
  jobID INT NOT NULL,
  PRIMARY KEY (userID, jobID),
  FOREIGN KEY (userID) REFERENCES users (userID),
  FOREIGN KEY (jobID) REFERENCES jobs (jobID)
);

CREATE TABLE contactAttempt (
  attemptID INT PRIMARY KEY NOT NULL,
  contacted TINYINT NOT NULL,
  contactDate DATETIME NOT NULL,
  followUpDate DATETIME NOT NULL,
  meetingID INT NOT NULL,
  FOREIGN KEY (meetingID) REFERENCES meetings (meetingID)
);

CREATE TABLE meetings (
  meetingID INT PRIMARY KEY NOT NULL,
  meetingDate DATETIME NOT NULL,
  thankYouSent TINYINT NOT NULL
);

CREATE TABLE trackingTable (
  userCount INT NOT NULL,
  jobCount INT NOT NULL,
  resumeCount INT NOT NULL,
  companyCount INT NOT NULL,
  point0fContactCount INT NOT NULL,
  contactAttemptCount INT NOT NULL,
  meetingCount INT NOT NULL
);