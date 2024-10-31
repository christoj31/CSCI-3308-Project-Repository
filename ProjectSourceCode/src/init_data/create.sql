DROP TABLE IF EXISTS leeds CASCADE;
CREATE TABLE IF NOT EXISTS leeds (
  job_id SERIAL PRIMARY KEY NOT NULL,
  job_name VARCHAR(50) NOT NULL,
  company VARCHAR(50) NOT NULL,
  date_applied VARCHAR NOT NULL,
  status VARCHAR(60) NOT NULL
);

CREATE TABLE users (
userID INT PRIMARY KEY,
username VARCHAR (45),
password VARCHAR (45),
email VARCHAR (45),
phoneNumber VARCHAR (45)
);

CREATE TABLE resume (
resumeID INT PRIMARY KEY,
resumeStage VARCHAR(45)
);

CREATE TABLE company (
companyID INT PRIMARY KEY,
name VARCHAR (45),
industry VARCHAR (45),
location VARCHAR (45)
);

CREATE TABLE point0fContact (
pocID INT PRIMARY KEY,
firstName VARCHAR (45),
lastName VARCHAR (45),email VARCHAR (45),
phoneNumber VARCHAR (45)
);

CREATE TABLE jobs (
jobID INT PRIMARY KEY,
jobTitle VARCHAR (45),
jobApplicationLink LONGTEXT,
applicationStep VARCHAR (45),
resumeID INT
pOcID INT
attemptID INT,
FOREIGN KEY (resumeID) REFERENCES Resume (resumeID),
FOREIGN KEY (pocID) REFERENCES point0fContact (pocID),
FOREIGN KEY (attemptID) REIENCES contactAttempt (attemptID)
);

CREATE TABLE userJobs (
userID INT,
jobID INT.
PRIMARY KEY (userID, jobID),
FOREIGN KEY (userID) REFERENCES users (userID),
FOREIGN KEY (jobID) REFERENCES jobs (jobID)
); 

CREATE TABLE contactAttempt (
attemptID INT PRIMARY KEY,
contacted TINYINT,
contactDate DATETIME,
followUpDate DATETIME,
meetingID INT,
location VARCHAR (45),
FOREIGN KEY (meetingID) 
REFERENCES Meetings (meetingID)
);

CREATE TABLE Meetings (
meetingID INT PRIMARY KEY,
meet ingDate DATETIME,
thankYouSent TINYINT
);

CREATE TABLE TrackingTable (
userCount INT,
jobCount INT
resumeCount INT,
companyCount INT,
point0fContactCount INT,
contactAttemptCount INT,
Meet ingCount INT
);