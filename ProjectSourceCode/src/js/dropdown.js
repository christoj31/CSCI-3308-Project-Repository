// public/js/dropdown.js
async function populateDropdown() {
    try {
        const response = await fetch('/dropdown/application-steps');
        if (!response.ok) throw new Error("Failed to fetch application steps");

        const applicationSteps = await response.json();
        console.log("Fetched application steps:", applicationSteps);

        const dropdown = document.getElementById('applicationStepDropdown');
        dropdown.innerHTML = ''; // Clear existing options

        applicationSteps.forEach(step => {
            const option = document.createElement('option');
            option.value = step.stepID;
            option.textContent = step.stepName;
            dropdown.appendChild(option);
        });
        console.log("Dropdown populated with options");
    } catch (error) {
        console.error('Failed to populate dropdown:', error);
    }
}

// Call this function on page load
document.addEventListener('DOMContentLoaded', populateDropdown);


// Call this function to populate dropdown on page load
populateDropdown();

// Function to update job status
async function updateStatus(jobID, newStatus) {
    try {
        const response = await fetch(`/dropdown/${jobID}/select`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ selectedValue: newStatus }),
        });

        if (response.ok) {
            // Update dropdown display to new status
            const row = document.getElementById(`job-${jobID}`);
            const dropdownToggle = row.querySelector('.dropdown-toggle');
            dropdownToggle.innerText = newStatus;
            dropdownToggle.className = `btn btn-sm dropdown-toggle ${statusColor(newStatus)}`;
        } else {
            console.error("Failed to update status");
        }
    } catch (error) {
        console.error('Error updating status:', error);
    }
}

// Helper function to apply colors to status
function statusColor(status) {
    switch (status) {
        case 'applied':
            return 'text-yellow-500';
        case 'not-applied':
            return 'text-gray-500';
        case 'accepted':
            return 'text-green-500';
        case 'denied':
            return 'text-red-500';
        default:
            return 'text-black';
    }
}