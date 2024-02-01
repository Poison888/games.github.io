const itemsPerPage = 20;
let currentPage = 1;
let allOnlineData = [];

// Fetch online data from the backend and update the table
function fetchOnlineData() {
    fetch('http://172.16.43.22:5002/package')
        .then(response => response.json())
        .then(data => {
            allOnlineData = data;
            updateOnlineTable(allOnlineData);
            updatePagination(allOnlineData.length);
        })
        .catch(error => {
            console.error('Error fetching online data:', error);
        });
}

// Update the table with online data for the current page
function updateOnlineTable(onlineData) {
    const onlineTableBody = document.querySelector('#onlineTable tbody');
    onlineTableBody.innerHTML = ''; // Clear existing rows

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const currentPageData = onlineData.slice(startIndex, endIndex);

    currentPageData.forEach(item => {
        const row = document.createElement('tr');
        // Adjust the property names based on your online data structure
        row.innerHTML = `
            <td>${item.game_id}</td>
            <td>${item.version}</td>
			<td>${item.type}</td>
			<td>${item.enable}</td>
			<td>${item.abtest_idc_nodes}</td>
			<td>${item.note}</td>
            <!-- Add more columns as needed -->
        `;
        onlineTableBody.appendChild(row);
    });
}

// Update the pagination buttons
function updatePagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const createPageLink = (i) => {
        const pageLink = document.createElement('button');
        pageLink.className = `page-link ${currentPage === i ? 'active' : ''}`;
        pageLink.textContent = i;
        pageLink.onclick = () => {
            currentPage = i;
            updateOnlineTable(allOnlineData);
            updatePagination(allOnlineData.length);
        };
        return pageLink;
    };

    const addEllipsis = () => {
        const ellipsis = document.createElement('span');
        ellipsis.textContent = '...';
        pagination.appendChild(ellipsis);
    };

    const addPageLink = (i) => {
        pagination.appendChild(createPageLink(i));
    };

    // Display up to 5 pages
    if (totalPages <= 8) {
        for (let i = 1; i <= totalPages; i++) {
            addPageLink(i);
        }
    } else {
        // Display left arrow if not on the first page
        if (currentPage > 1) {
            const leftArrow = document.createElement('button');
            leftArrow.className = 'page-link';
            leftArrow.innerHTML = '&#8249; 上一页'; // Left arrow HTML entity
            leftArrow.onclick = () => {
                currentPage -= 1;
                updateOnlineTable(allOnlineData);
                updatePagination(allOnlineData.length);
            };
            pagination.appendChild(leftArrow);
        }

        // Display ellipsis before and after
        if (currentPage > 2) {
            addPageLink(1);
            if (currentPage !== 3) {
                addEllipsis();
            }
        }

        // Display current, previous, and next page
        for (let i = Math.max(1, currentPage - 1); i <= Math.min(currentPage + 1, totalPages); i++) {
            addPageLink(i);
        }

        // Display ellipsis after
        if (currentPage < totalPages - 1) {
            if (currentPage !== totalPages - 2) {
                addEllipsis();
            }
            addPageLink(totalPages);
        }

        // Display right arrow if not on the last page
        if (currentPage < totalPages) {
            const rightArrow = document.createElement('button');
            rightArrow.className = 'page-link';
            rightArrow.innerHTML = '下一页 &#8250;'; // Right arrow HTML entity
            rightArrow.onclick = () => {
                currentPage += 1;
                updateOnlineTable(allOnlineData);
                updatePagination(allOnlineData.length);
            };
            pagination.appendChild(rightArrow);
        }
    }
}

// Search functionality
function searchOnlineData() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toUpperCase();

    // Filter the data based on the search input
    const filteredData = allOnlineData.filter(item =>
        Object.values(item).some(value =>
            String(value).toUpperCase().includes(filter)
        )
    );

    // Update the table and pagination with the filtered data
    currentPage = 1; // Reset current page to 1 when searching
    updateOnlineTable(filteredData);
    updatePagination(filteredData.length);
}

// Return to home functionality
function returnToHome() {
    document.getElementById('searchInput').value = ''; // Clear search input
    currentPage = 1; // Reset current page to 1
    fetchOnlineData(); // Fetch all online data to return to the initial state
}

// Handle Enter key press for search
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        searchOnlineData();
    }
}

// Fetch online data initially
fetchOnlineData();


