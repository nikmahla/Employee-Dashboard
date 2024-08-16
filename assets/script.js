const UrlApi = 'https://66b9dfbbfa763ff550f9eff2.mockapi.io/Users';
const limit = 10;
let currentPage = 1;
let employeeTableBody = document.getElementById('employeeTableBody')
const paginationButton = document.getElementById('pagination')
const editModal=document.getElementById('editModal')
const addNewEmployee=document.getElementById('addNewEmployee')

function renderTable(page = 1) {
    currentPage = page;
    const url = new URL(UrlApi);
    url.searchParams.append('page', currentPage);
    url.searchParams.append('limit', limit);

    fetch(url, {
        method: 'GET',
        headers: { 'content-type': 'application/json' },
    }).then(res => {
        if (res.ok) {
            return res.json();
        }
        throw new Error('Failed to fetch data');
    }).then(data => {
        createEmployeeRows(data);
        const totalPages = Math.ceil(data.length / limit);
        pagination(currentPage, totalPages);
    }).catch(error => {
        console.log('Failed to fetch data:', error);
        alert('Failed to fetch data');
    });
}

function createEmployeeRows(data) {
    if (!Array.isArray(data)) {
        console.error('Data is not an array:', data);
        return;
    }

    let tableContent = data.map((employee, index) => `
        <tr class="border-b border-gray-200 hover:bg-gray-50 transition duration-300" data-index="${employee.id}">
            <td class="py-2 px-3 md:px-6 text-left">
                <img src="${employee.avatar || 'https://via.placeholder.com/40'}" alt="${employee.fullName || 'Employee'}" class="w-10 h-10 rounded-full object-cover">
            </td>
            <td class="py-2 px-3 md:px-6 text-left">
                <span class="font-medium">${employee.fullName || 'N/A'}</span>
            </td>
            <td class="py-2 px-3 md:px-6 text-left">
                <span class="font-medium">${employee.jobTitle || 'N/A'}</span>
            </td>
            <td class=" hidden py-2 px-3 md:flex md:px-6 text-center">
                <span class="font-medium">${employee.email || 'N/A'}</span>
            </td>
             <td class="py-1 px-1 md:py-2 md:px-3 text-center">
                <div class="flex justify-center space-x-1">
                    <button class="info-btn bg-blue-500 text-white p-1 rounded-full hover:bg-blue-600 transition duration-300" data-index="${index}" title="More Info">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                    <button class="delete-btn bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition duration-300" data-index="${employee.id}" title="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                    <button class="edit-btn bg-yellow-500 text-white p-1 rounded-full hover:bg-yellow-600 transition duration-300" data-index="${employee.id}" title="Edit">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                </div>
                <div id="info-row-${employee.id}" class="hidden opacity-0 transition-opacity duration-300">
                    <p>More information about ${employee.fullName}</p>
                </div>
            </td>
        </tr>
         <tr 
            id="info-row-${index}" 
            class="bg-gray-50 border-2 border-l-gray-100 hidden transition-all duration-300 ease-in-out overflow-hidden opacity-0"
        >
            <td colspan="5" class="py-2 px-3 md:px-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                        <span class="font-medium">Department:</span> ${employee.department || 'N/A'}
                    </div>
                    <div>
                        <span class="font-medium">Job Description:</span> ${employee.jobDescription || 'N/A'}
                    </div>
                    <div>
                        <span class="font-medium">Job Type:</span> ${employee.jobType || 'N/A'}
                    </div>
                </div>
            </td>
        </tr>
    `).join('');

    employeeTableBody.innerHTML = tableContent;

   
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function (e) {
            const index = this.getAttribute('data-index');
            if (confirm('Are you sure you want to delete this item?')) {
                deleteEmployee(index, currentPage);
            }
        });
    });

    document.querySelectorAll('.info-btn').forEach(button => {
        button.addEventListener('click', function (e) {
            e.stopPropagation();
            const index = this.getAttribute('data-index');
            const infoRow = document.getElementById(`info-row-${index}`);
            const svg = this.querySelector('svg');

            const isHidden = infoRow.classList.contains('hidden');

            if (isHidden) {
                infoRow.classList.remove('hidden');
                void infoRow.offsetHeight;
                infoRow.classList.remove('opacity-0');
                infoRow.classList.add('opacity-100');
                svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />';
            } else {
                infoRow.classList.remove('opacity-100');
                infoRow.classList.add('opacity-0');
                infoRow.addEventListener('transitionend', () => {
                    infoRow.classList.add('hidden');
                    svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />';
                }, { once: true });
            }
        });
    });

    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function (e) {
            const index = this.getAttribute('data-index');
            modelEmployee(index);
        });
    });


}

function modelEmployee(index) {
    if(index){
        fetch(`${UrlApi}/${index}`)
        .then(res => res.json())
        .then(employee => {
            let modalContent = `
                <div id="editModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div class="bg-gray-50 border-2 border-blue-200 rounded-lg shadow-lg p-6 m-w-full md:w-1/3">
                        <h2 class="text-lg font-bold mb-4 text-center bg-blue-100 text-gray-800 p-2 rounded-md">Edit Employee</h2>
                        <form id="editForm">
                            <input type="hidden" id="editEmployeeId" value="${employee.id}" />
                            <div class="mb-4">
                                <label for="editFullName" class="block text-sm font-medium text-gray-700">Full Name</label>
                                <input type="text" id="editFullName" class="mt-1 text-sm block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-100 " value="${employee.fullName}" required />
                            </div>
                            <div class="mb-4">
                                <label for="editEmail" class="block text-sm font-medium text-gray-700">Email</label>
                                <input type="email" id="editEmail" class="mt-1 block text-sm w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-100 " value="${employee.email}" required />
                            </div>
                            <div class="mb-4">
                                <label for="editJobTitle" class="block text-sm font-medium text-gray-700">Job Title</label>
                                <input type="text" id="editJobTitle" class="mt-1 text-sm block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-100 " value="${employee.jobTitle}" required />
                            </div>
                            <div class="flex justify-end">
                                <button type="button" id="closeModal" class="mr-2  text-sm px-5 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition">Cancel</button>
                                <button type="submit" class="px-5 py-2 bg-blue-500 text-sm text-white rounded-md hover:bg-blue-600 transition">Save</button>
                            </div>
                        </form>
                    </div>
                </div>`;
            editModal.innerHTML = modalContent;
            editModal.classList.remove('hidden');

            document.getElementById('editForm').addEventListener('submit', function (e) {
                e.preventDefault();
                const updatedEmployee = {
                    id: document.getElementById('editEmployeeId').value,
                    fullName: document.getElementById('editFullName').value,
                    email: document.getElementById('editEmail').value,
                    jobTitle: document.getElementById('editJobTitle').value,
                };
                updateEmployee(updatedEmployee);
            });

            document.getElementById('closeModal').addEventListener('click', function () {
                editModal.classList.add('hidden');
            });
        })
        .catch(error => {
            console.error('Error fetching employee data:', error);
        });
    }else{
        let modalContent = `
        <div id="editModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-gray-50 border-2 border-blue-200 rounded-lg shadow-lg p-6 w-1/3">
                <h2 class="text-lg font-bold mb-4 text-center bg-blue-100 text-gray-800 p-2 rounded-md">Add New Employee</h2>
                <form id="editForm">
                    <input type="hidden" id="editEmployeeId" value="" />
                    <div class="mb-4">
                        <label for="editFullName" class="block text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" id="editFullName" class="mt-1 text-sm block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-100 " value="" required />
                    </div>
                    <div class="mb-4">
                        <label for="editEmail" class="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" id="editEmail" class="mt-1 text-sm block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-100 " value="" required />
                    </div>
                    <div class="mb-4">
                        <label for="editJobTitle" class="block text-sm font-medium text-gray-700">Job Title</label>
                        <input type="text" id="editJobTitle" class="mt-1 block text-sm w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-100 " value="" required />
                    </div>
                    <div class="flex justify-end">
                        <button type="button" id="closeModal" class="mr-2 px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition">Cancel</button>
                        <button type="submit" class="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition">Add</button>
                    </div>
                </form>
            </div>
        </div>`;
        
        editModal.innerHTML = modalContent;
        editModal.classList.remove('hidden');

        document.getElementById('editForm').addEventListener('submit', function (e) {
            e.preventDefault();
            const newEmployee = {
                fullName: document.getElementById('editFullName').value,
                email: document.getElementById('editEmail').value,
                jobTitle: document.getElementById('editJobTitle').value,
            };
            addEmployee(newEmployee);
        });

        document.getElementById('closeModal').addEventListener('click', function () {
            editModal.classList.add('hidden');
        });
    }
}

function updateEmployee(employee) {
    fetch(`${UrlApi}/${employee.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(employee),
    })
    .then(res => {
        if (res.ok) {
            return res.json();
        }
        throw new Error('Failed to update employee');
    })
    .then(updatedEmployee => {
        console.log('Updated employee:', updatedEmployee);
        renderTable(currentPage);
        editModal.classList.add('hidden');
    })
    .catch(error => {
        console.error('Error updating employee:', error);
    });
}

function addEmployee(employee) {
    fetch(UrlApi, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(employee),
    })
    .then(res => {
        if (res.ok) {
            return res.json();
        }
        throw new Error('Failed to add employee');
    })
    .then(newEmployee => {
        console.log('Added new employee:', newEmployee);
        const fakeAvatar = 'https://via.placeholder.com/40';
        const newRow = `
            <tr class="border-b border-gray-200 hover:bg-gray-50 transition duration-300" data-index="${newEmployee.id}">
                <td class="py-2 px-3 md:px-6 text-left">
                    <img src="${fakeAvatar}" alt="${newEmployee.fullName || 'Employee'}" class="w-10 h-10 rounded-full object-cover">
                </td>
                <td class="py-2 px-3 md:px-6 text-left">
                    <span class="font-medium">${newEmployee.fullName || 'N/A'}</span>
                </td>
                <td class="py-2 px-3 md:px-6 text-left">
                    <span class="font-medium">${newEmployee.jobTitle || 'N/A'}</span>
                </td>
                <td class="py-2 px-3 md:px-6 text-center">
                    <span class="font-medium">${newEmployee.email || 'N/A'}</span>
                </td>
                <td class="py-1 px-1 md:py-2 md:px-3 text-center">
                    <div class="flex justify-center space-x-1">
                        <button class="info-btn bg-blue-500 text-white p-1 rounded-full hover:bg-blue-600 transition duration-300" data-index="${newEmployee.id}" title="More Info">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                        <button class="delete-btn bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition duration-300" data-index="${newEmployee.id}" title="Delete">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                        <button class="edit-btn bg-yellow-500 text-white p-1 rounded-full hover:bg-yellow-600 transition duration-300" data-index="${newEmployee.id}" title="Edit">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
        employeeTableBody.insertAdjacentHTML('beforeend', newRow);
        editModal.classList.add('hidden');
    })
    .catch(error => {
        console.error('Error adding employee:', error);
    });
}

function deleteEmployee(index, currentPage) {
    fetch(`${UrlApi}/${index}`, {
        method: 'DELETE',
    }).then(res => {
        if (res.ok) {
            return res.json();
        }
    }).then(employee => {
        console.log('Deleted employee:', employee);
        const rowToDelete = document.querySelector(`tr[data-index="${index}"]`);
        if (rowToDelete) {
            rowToDelete.remove(); 
        }
        renderTable(currentPage); 
    }).catch(error => {
        console.log('Error in Delete:', error);
        alert('Error in Delete...');
    });
}

renderTable(currentPage);

function pagination(currentPage) {
    const totalPages = 6;
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    const prevButton = document.createElement('button');
    prevButton.className = "px-2 py-1 bg-blue-500 text-white text-sm md:text-md rounded hover:bg-blue-600 transition duration-300";
    prevButton.innerText = 'Previous';
    prevButton.disabled = currentPage === 1;
    prevButton.onclick = function () {
        if (currentPage > 1) {
            renderTable(currentPage - 1);
        }
    };
    paginationContainer.appendChild(prevButton);

    let startPage, endPage;

    if (totalPages <= 3) {
        startPage = 1;
        endPage = totalPages;
    } else {
        startPage = Math.max(1, currentPage - 1);
        endPage = Math.min(totalPages, currentPage + 1);

        if (currentPage === 1) {
            endPage = 3;
        } else if (currentPage === totalPages) {
            startPage = totalPages - 2;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.className = `px-2 py-1 rounded text-sm hover:bg-blue-600 transition duration-300 ${
            currentPage === i ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-800'
        }`;
        pageButton.innerText = i;

        pageButton.onclick = (function(pageNumber) {
            return function() {
                renderTable(pageNumber);
            };
        })(i);

        paginationContainer.appendChild(pageButton);
    }

    const nextButton = document.createElement('button');
    nextButton.className = "px-2 py-1 bg-blue-500 text-white text-sm md:text-md rounded hover:bg-blue-600 transition duration-300";
    nextButton.innerText = 'Next';
    nextButton.disabled = currentPage === totalPages;
    nextButton.onclick = function () {
        if (currentPage < totalPages) {
            renderTable(currentPage + 1);
        }
    };
    paginationContainer.appendChild(nextButton);

    console.log('Current Page:', currentPage);
    console.log('Total Pages:', totalPages);
}

addNewEmployee.addEventListener('click', () => {
    modelEmployee(null);
});







