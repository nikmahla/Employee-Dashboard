let employeeTableBody = document.getElementById('employeeTableBody')

let UrlApi = 'https://66b9dfbbfa763ff550f9eff2.mockapi.io/Users'

renderTable()

function renderTable() {
    fetch(UrlApi, {
        method: 'GET',
        headers: { 'content-type': 'application/json' },
    }).then(res => {
        if (res.ok) {
            return res.json();
        }
        throw new Error('Failed to fetch data');
    }).then(data => {
        createEmployeeRows(data)
    }).catch(error => {
        console.log('Failed to fetch data:', error);
        alert('Failed to fetch data');
    })
}

function createEmployeeRows(data) {
    console.log(data);
    
    if (!Array.isArray(data)) {
        console.error('Data is not an array:', data);
        return;
    }

    let tableContent = data.map((employee, index) => `
        <tr class="border-b border-gray-200 hover:bg-gray-100" data-id="${employee.id}">
            <td class="py-2 px-3 md:px-6 text-left">
                <img src="${employee.avatar || 'https://randomuser.me/api/portraits/women/44.jpg'}"
                     alt="${employee.fullName || 'Employee'}"
                     class="w-10 h-10 rounded-full object-cover"
                     onerror="this.onerror=null;this.src='https://randomuser.me/api/portraits/women/44.jpg';">
            </td>
            
            <td class="py-2 px-3 md:px-6 text-left">
                <span class="font-medium">${employee.fullName || 'N/A'}</span>
            </td>
            <td class="py-2 px-3 md:px-6 text-left">
                <span class="font-medium">${employee.jobTitle || 'N/A'}</span>
            </td>
            <td class="py-2 px-3 md:px-6 text-center hidden md:table-cell">
                <span class="font-medium">${employee.email || 'N/A'}</span>
            </td>
            <td class="py-1 px-1 md:py-2 md:px-3 text-center">
                <div class="flex justify-center space-x-0.5 md:space-x-1">
                    <button class="info-btn bg-blue-500 text-white p-0.5 md:p-1 rounded-full text-xs hover:bg-blue-600 transition duration-300" data-index="${index}" title="More Info">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-2.5 w-2.5 md:h-4 md:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                    <button class="info-btn bg-red-500 text-white p-0.5 md:p-1 rounded-full text-xs hover:bg-red-600 transition duration-300" data-index="${index}" title="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-2.5 w-2.5 md:h-4 md:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                    <button class="info-btn bg-yellow-500 text-white p-0.5 md:p-1 rounded-full text-xs hover:bg-yellow-600 transition duration-300" data-index="${index}" title="Edit">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-2.5 w-2.5 md:h-4 md:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
        <tr class="bg-gray-50 border-2 border-l-gray-100 hidden  aos-init aos-animate" data-aos="fade-right" data-aos-duration="1000"
        id="info-row-${index}">
            <td colspan="5" class="py-2 px-3 md:px-6 ">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                        <span class="font-medium">Department:</span> ${employee.department || 'N/A'}
                    </div>
                   
                    <div>
                        <span class="font-medium">Job Description:</span> ${employee.jobDescription || 'N/A'}
                    </div>
                    <div>
                        <span class="font-medium">Job Type :</span> ${employee.jobType || 'N/A'}
                    </div>
                </div>
          
               
            </td>
        <tr 
        id="info-row-${index}">
    `).join('');

    employeeTableBody.innerHTML = tableContent;
    

    // Add event listeners to the info buttons
    document.querySelectorAll('.info-btn').forEach(button => {
        button.addEventListener('click', function (e) {
            AOS.init({
                duration: 800,
            });
            e.stopPropagation();
            const index = this.getAttribute('data-index');
            const infoRow = document.getElementById(`info-row-${index}`);

            // Toggle the visibility of the info row
            infoRow.classList.toggle('hidden');

            // Change the button icon from + to - and vice versa
            const svg = this.querySelector('svg');
            if (infoRow.classList.contains('hidden')) {
                svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />';
            } else {
                svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />';
            }
        });
    });
}

