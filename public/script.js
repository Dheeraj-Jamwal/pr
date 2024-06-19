async function vote(candidate) {
    try {
        const response = await fetch('/vote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ photoId: candidate })  // Assuming 'photoId' matches your schema
        });
        if (!response.ok) {
            throw new Error('Failed to cast vote');
        }
        const result = await response.json();
        document.getElementById(`candidate_${candidate.split(' ')[1].toLowerCase()}_score`).innerText = result.votes;
    } catch (error) {
        console.error('Error casting vote:', error);
        // Handle error: show a message to the user or retry the operation
        // Example: show a toast or alert to inform the user about the error
        // You can also retry the operation or implement a retry mechanism here
    }
}

async function showChart() {
    try {
        const response = await fetch('/results');
        if (!response.ok) {
            throw new Error('Failed to fetch results');
        }
        const data = await response.json();
        const voteCounts = data.votes.map(vote => vote.count);
        updateChart(voteCounts);
    } catch (error) {
        console.error('Error fetching results:', error);
        // Handle error: show a message to the user or retry the operation
    }
}

function updateChart(voteCounts) {
    // Implement Chart.js logic here to update 'voteChart' canvas
    // Example:
    const ctx = document.getElementById('voteChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Candidate 1', 'Candidate 2', 'Candidate 3'],
            datasets: [{
                label: 'Votes',
                data: voteCounts,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
