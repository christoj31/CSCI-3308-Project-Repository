INSERT INTO application_steps (stepID, stepName) VALUES 
    (1, 'Applied'), 
    (2, 'Interviews'), 
    (3, 'Offer'), 
    (4, 'Rejected');

INSERT INTO thank_you_status (statusID, status) VALUES 
    (1, 'unsent'), 
    (2, 'sent');

INSERT INTO resume_stage (stageID, stageName) VALUES 
    (1, 'unwritten'),
    (2, 'written'),
    (3, 'tailored'),
    (4, 'AI checked');

INSERT INTO contacted_status (statusID, status) VALUES 
    (1, 'no'),
    (2, 'yes');



    -- Insert data into users table
INSERT INTO users 
    (username, password, email, phoneNumber) 
VALUES 
    ('johnDoe', 'pass12', 'johnDoe@gmail.com', '123-456-7891'),
    ('AmandaB', '123pass', 'AmandaB@yahoo.com', '246-357-1309'),
    ('Bobjoe', 'notpassword', 'Bobjoe@outlook.com', '224-789-389');

-- Insert data into resume table
INSERT INTO resume 
    (resumeID, resumeStageID) 
VALUES
    (1, '001'),
    (2, '002'),
    (3, '003');

-- Insert data into company table
INSERT INTO company 
    (companyID, name, industry, location) 
VALUES
    (1, 'Google', 'Technology', 'Boulder'),
    (2, 'B&J', 'Analytics', 'Denver'),
    (3, 'J&J', 'Finance', 'Chicago');

-- Insert data into pointOfContact table
INSERT INTO pointofcontact 
    (pocID, firstName, lastName, email, phoneNumber) 
VALUES
    (1, 'John', 'Doe', 'johnDoe@yahoo.com', '456-789-0123'),
    (2, 'Daria', 'Ruch', 'dariaRuch@gmail.com', '567-890-1234'),
    (3, 'Max', 'Brown', 'maxBrown@outlook.com', '678-901-2345');

-- Insert data into meetings table
INSERT INTO meetings 
    (meetingID, meetingDate, thankYouStatusID) 
VALUES
    (1, '2024-12-01', 1),
    (2, '2024-11-15', 1),
    (3, '2024-9-01', 1);

-- Insert data into contactAttempt table
INSERT INTO contactattempt 
    (attemptID, contactedStatusID, contactDate, meetingID) 
VALUES
    (1, 1, '2023-09-25', 1),
    (2, 1, '2023-10-10', 2),
    (3, 1, '2023-10-20', 3);

-- Insert data into jobs table
INSERT INTO jobs 
    (jobID, jobTitle, jobApplicationLink, due_date, due_date_string, countdown, applicationStepID, resumeID, pocID, attemptID) 
VALUES
    (1, 'Software Engineer', 'https://techcorp.com/jobs/1', '2024-11-30', '2024-11-14', 11, 2, 1, 1, 1),
    (2, 'Data Analyst', 'https://healthinc.com/jobs/2', '2024-11-24', '2024-11-24', 5, 1, 2, 2, 2),
    (3, 'Product Manager', 'https://edulabs.com/jobs/3', '2024-11-28', '2024-11-28', 9, 4, 3, 3, 3);

-- Insert data into userJobs table
INSERT INTO userjobs 
    (userID, jobID) 
VALUES
    (1, 1),
    (2, 2),
    (3, 3);

-- Insert data into trackingTable
INSERT INTO trackingtable 
    (userCount, jobCount, resumeCount, companyCount, pointOfContactCount, contactAttemptCount, meetingCount)
VALUES
    (3, 3, 3, 3, 3, 3, 3);

