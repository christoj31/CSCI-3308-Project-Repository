router.put('/update-status', async (req, res) => {
    const { jobId, status } = req.body;

    try {
        // Map status text to IDs or values in your database
        const statusMapping = {
            "Applied": 1,
            "Not Applied": 2,
            "Accepted": 3,
            "Declined": 4,
        };

        const statusId = statusMapping[status];
        if (!statusId) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        await db.query('UPDATE jobs SET applicationstepid = $1 WHERE jobid = $2', [statusId, jobId]);
        res.status(200).json({ message: 'Status updated successfully' });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});