    -- Insert data into users table
INSERT INTO users 
    (username, password, email, phoneNumber) 
VALUES 
    ('johnDoe', 'pass12', 'johnDoe@gmail.com', '123-456-7891'),
    ('AmandaB', '123pass', 'AmandaB@yahoo.com', '246-357-1309'),
    ('Bobjoe', 'notpassword', 'Bobjoe@outlook.com', '224-789-389');

-- Insert data into resume table
INSERT INTO resume 
    (resumeID, resumeStage) 
VALUES
    (1, 'Waiting'),
    (2, 'Submitted'),
    (3, 'Pending');

-- Insert data into company table
INSERT INTO company 
    (companyID, name, industry, location) 
VALUES
    (1, 'Google', 'Technology', 'Boulder'),
    (2, 'B&J', 'Analytics', 'Denver'),
    (3, 'J&J', 'Finance', 'Chicago');

-- Insert data into pointOfContact table
INSERT INTO point0fContact 
    (pocID, firstName, lastName, email, phoneNumber) 
VALUES
    (1, 'John', 'Doe', 'johnDoe@yahoo.com', '456-789-0123'),
    (2, 'Daria', 'Ruch', 'dariaRuch@gmail.com', '567-890-1234'),
    (3, 'Max', 'Brown', 'maxBrown@outlook.com', '678-901-2345');

-- Insert data into meetings table
INSERT INTO meetings 
    (meetingID, meetingDate, thankYouSent) 
VALUES
    (1, '2024-12-01', 1),
    (2, '2024-11-15', 0),
    (3, '2024-9-01', 1);

-- Insert data into contactAttempt table
INSERT INTO contactAttempt 
    (attemptID, contacted, contactDate, followUpDate, meetingID) 
VALUES
    (1, 1, '2023-09-25', '2023-10-02', 1),
    (2, 0, '2023-10-10', '2023-10-20', 2),
    (3, 1, '2023-10-20', '2023-11-05', 3);

-- Insert data into jobs table
INSERT INTO jobs 
    (jobID, jobTitle, jobApplicationLink, applicationStep, resumeID, pocID, attemptID) 
VALUES
    (1, 'Software Engineer', 'https://techcorp.com/jobs/1', 'Interview', 1, 1, 1),
    (2, 'Data Analyst', 'https://healthinc.com/jobs/2', 'Applied', 2, 2, 2),
    (3, 'Product Manager', 'https://edulabs.com/jobs/3', 'Offer', 3, 3, 3);

-- Insert data into userJobs table
INSERT INTO userJobs 
    (userID, jobID) 
VALUES
    (1, 1),
    (2, 2),
    (3, 3);

-- Insert data into trackingTable
INSERT INTO trackingTable 
    (userCount, jobCount, resumeCount, companyCount, point0fContactCount, contactAttemptCount, meetingCount)
VALUES
    (3, 3, 3, 3, 3, 3, 3);