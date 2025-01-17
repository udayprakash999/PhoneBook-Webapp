let contacts = JSON.parse(localStorage.getItem('contacts')) || [];
let editingIndex = null;

function saveContacts() {
    localStorage.setItem('contacts', JSON.stringify(contacts));
}

function addContact() {
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const countryCodeSelect = document.getElementById('countryCode');

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const countryCode = countryCodeSelect.value;

    if (name === '' || phone === '') {
        showAlert('Please fill in both fields.');
        return;
    }

    if (editingIndex !== null) {
        contacts[editingIndex] = { name, phone: countryCode + phone };
        editingIndex = null;
    } else {
        contacts.push({ name, phone: countryCode + phone });
    }

    nameInput.value = '';
    phoneInput.value = '';
    saveContacts();
    displayContacts();
}

function editContact(index) {
    const contact = contacts[index];
    document.getElementById('name').value = contact.name;
    document.getElementById('phone').value = contact.phone.slice(contact.phone.indexOf(contact.phone[0]) === 0 ? contact.phone.length - 10 : 0);
    document.getElementById('countryCode').value = contact.phone.slice(0, contact.phone.indexOf(contact.phone[0]) === 0 ? 3 : 0);
    editingIndex = index;
}

function deleteContact(index) {
    document.getElementById('deletePopup').classList.add('show');
    window.deleteIndex = index; 
}

function confirmDelete() {
    const index = window.deleteIndex;
    contacts.splice(index, 1);
    saveContacts();
    displayContacts();

    closePopup('deletePopup');
}
function closePopup(popupId) {
    document.getElementById(popupId).classList.remove('show');
}




function searchContacts() {
    const searchQuery = document.getElementById('search').value.toLowerCase();
    displayContacts(searchQuery);
}

function displayContacts(searchQuery = '') {
    const contactList = document.getElementById('contactList');
    contactList.innerHTML = '';

    contacts
        .filter(contact => contact.name.toLowerCase().includes(searchQuery))
        .forEach((contact, index) => {
            const li = document.createElement('li');
            const contactText = document.createElement('span');
            contactText.textContent = `${contact.name}: ${contact.phone}`;

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.className = 'edit';
            editButton.onclick = () => editContact(index);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'delete';
            deleteButton.onclick = () => deleteContact(index);

            li.appendChild(contactText);
            li.appendChild(editButton);
            li.appendChild(deleteButton);
            contactList.appendChild(li);
        });
}

function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');
}

function showAlert(message) {
    const alertMessage = document.getElementById('alertMessage');
    alertMessage.textContent = message;
    const alertBox = document.getElementById('customAlert');
    alertBox.style.display = 'block';
}

function closeAlert() {
    const alertBox = document.getElementById('customAlert');
    alertBox.style.display = 'none';
}




function saveAsText() {
    const textData = contacts
        .map(contact => `Name: ${contact.name}, Phone: ${contact.phone}`)
        .join('\n');

    const blob = new Blob([textData], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'contacts.txt';
    link.click();
}

window.addEventListener('load', () => {
    displayContacts();
});