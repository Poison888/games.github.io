const itemsPerPage = 20;
let currentPage = 1;
let allUserData = [];

// Fetch user data from the backend and update the table
function fetchUserData() {
    fetch('http://172.16.43.22:5001/get_users')
        .then(response => response.json())
        .then(data => {
            allUserData = data;
            updateTable(allUserData);
            updatePagination(allUserData.length);
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });
}

// Update the table with user data for the current page
function updateTable(userData) {
    const tableBody = document.querySelector('#userTable tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const currentPageData = userData.slice(startIndex, endIndex);

    currentPageData.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.game_id}</td>
            <td>${user.game_name}</td>
            <td>${user.pkg_name}</td>
			<td>${user.config_dir}</td>
            <td>${user.pkg_version}</td>
            <td>${user.config_version}</td>
            <td>${user.install_dir}</td>
			<td>${user.steam_app_id}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Update the pagination buttons
function updatePagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    // Add a "Previous" button with a left arrow
    const prevButton = document.createElement('button');
    prevButton.innerHTML = '&#8249; 上一页';
    prevButton.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            updateTable(allUserData);
            updatePagination(totalItems);
        }
    };
    pagination.appendChild(prevButton);

    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement('button');
        pageLink.className = `page-link ${currentPage === i ? 'active' : ''}`;
        pageLink.textContent = i;
        pageLink.onclick = () => {
            currentPage = i;
            updateTable(allUserData);
            updatePagination(totalItems);
        };
        pagination.appendChild(pageLink);
    }

    // Add a "Next" button with a right arrow
    const nextButton = document.createElement('button');
    nextButton.innerHTML = '下一页 &#8250;';
    nextButton.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            updateTable(allUserData);
            updatePagination(totalItems);
        }
    };
    pagination.appendChild(nextButton);
}

// Search functionality
function searchTable() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toUpperCase();

    // Filter the data based on the search input
    const filteredData = allUserData.filter(user =>
        Object.values(user).some(value =>
            String(value).toUpperCase().includes(filter)
        )
    );

    // Update the table and pagination with the filtered data
    currentPage = 1; // Reset current page to 1 when searching
    updateTable(filteredData);
    updatePagination(filteredData.length);
}

// Return to home functionality
function returnToHome() {
    document.getElementById('searchInput').value = ''; // Clear search input
    currentPage = 1; // Reset current page to 1
    fetchUserData(); // Fetch all user data to return to the initial state
}

// Handle Enter key press for search
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        searchTable();
    }
}

// Fetch user data initially
fetchUserData();

