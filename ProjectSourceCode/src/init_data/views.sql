CREATE OR REPLACE VIEW dashboard_view AS
SELECT 
    j.jobTitle AS Job,
    c.name AS Company,
    j.applicationStepID AS AppStage,
    ca.followUpDate AS DueDate,
    CONCAT(poc.firstName, ' ', poc.lastName) AS POC,
    CASE WHEN ca.contactedStatusID = 1 THEN 'Contacted' ELSE 'Not Contacted' END AS ContactLog,
    CASE WHEN m.thankYouStatusID = 1 THEN 'Thank You Sent' ELSE 'Not Sent' END AS MeetingLog,
    c.location AS TargetLocation,
    c.industry AS Department
FROM 
    jobs j
JOIN 
    company c ON j.jobID = c.companyID
JOIN 
    resume r ON j.resumeID = r.resumeID
JOIN 
    pointofcontact poc ON j.pocID = poc.pocID
JOIN 
    contactAttempt ca ON j.attemptID = ca.attemptID
JOIN 
    meetings m ON ca.meetingID = m.meetingID;
