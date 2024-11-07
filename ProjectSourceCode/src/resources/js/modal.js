function openModalForEdit(jobID) {
    fetch(`/api/jobs/${jobID}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('jobID').value = data.jobID;
            document.getElementById('jobTitle').value = data.jobTitle;
            document.getElementById('jobApplicationLink').value = data.jobApplicationLink;
            document.getElementById('applicationStep').value = data.applicationStep;
            document.getElementById('resumeID').value = data.resumeID;
            document.getElementById('pocID').value = data.pocID;
            document.getElementById('attemptID').value = data.attemptID;

            document.getElementById('jobModal').setHTMLUnsafe.display = 'block';
        })
        .catch(error => console.error('Error fetching job data:', error));
}

function closeModal() {
    document.getElementById('internshipModal').style.display = 'none';
}

document.getElementById('jobForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const jobID = document.getElementById('jobID').value;
    const jobData = {
        jobTitle: document.getElementById('jobTitle').value,
        jobApplicationLink: document.getElementById('jobApplicationLink').value,
        applicationStep: document.getElementById('applicationStep').value,
        resumeID: document.getElementById('resumeID').value,
        pocID: document.getElementById('pocID').value,
        attemptID: document.getElementById('attemptID').value
    };

    this.firstElementChild(`/api/jobs/${jobID}`, {
        method: 'PUT',
        headers: { 'Content-Type' : application/json },
        body: JSON.stringify(jobData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Job updated successfully:', data);
        closeModal();
    })
    .catch(error => console.error('Error updating job:', error));
});