import { AuthService } from './auth-service.js';
import { ContactService } from './contact-service.js';
import { SearchComponent } from './search-component.js';
import { Validators } from './validators.js';
import { EventEmitter } from './events.js';

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
    if (AuthService.isAuthenticated()) {
        loadContacts();
    } else {
        redirectToLogin();
    }

    SearchComponent.init();
    document.getElementById('addContactBtn').addEventListener('click', openContactModal);
    document.getElementById('contactForm').addEventListener('submit', handleContactFormSubmit);
    document.querySelector('.close-btn').addEventListener('click', closeModal);
    document.getElementById('cancelBtn').addEventListener('click', closeModal);

    EventEmitter.on('search:changed', () => {
        const searchTerm = SearchComponent.searchInput.value.toLowerCase();
        const category = SearchComponent.categoryFilter.value;
        updateContactList({ searchTerm, category });
    });
    EventEmitter.on('contact:added', addContactToList);
    EventEmitter.on('contact:updated', updateContactInList);
    EventEmitter.on('contact:deleted', removeContactFromList);
    EventEmitter.on('contact:favoriteToggled', toggleFavoriteInList);
});

function loadContacts() {
    const contacts = ContactService.getContacts();
    updateContactList({ searchTerm: '', category: 'All' });
}

function redirectToLogin() {
    window.location.href = 'login.html';
}

function openContactModal() {
    const modal = document.getElementById('contactModal');
    modal.classList.add('active');
    document.getElementById('modalTitle').textContent = 'Add New Contact';
}

function closeModal() {
    const modal = document.getElementById('contactModal');
    modal.classList.remove('active');
    document.getElementById('contactForm').reset();
}

function handleContactFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const contactData = Object.fromEntries(formData.entries());
    const validation = Validators.validateContactForm(contactData);

    if (!validation.isValid) {
        showErrors(validation.errors);
        return;
    }

    ContactService.addContact(contactData);
    closeModal();
}

function showErrors(errors) {
    // Display validation errors to the user
}

function updateContactList({ searchTerm, category }) {
    const contacts = ContactService.getContacts();
    const filteredContacts = SearchComponent.filterContacts(contacts, { searchTerm, category });
    renderContacts(filteredContacts);
}

function addContactToList(contact) {
    const contactsList = document.getElementById('contactsList');
    const contactElement = createContactElement(contact);
    contactsList.appendChild(contactElement);
}

function updateContactInList(contact) {
    const contactElement = document.querySelector(`[data-id="${contact.id}"]`);
    if (contactElement) {
        contactElement.replaceWith(createContactElement(contact));
    }
}

function removeContactFromList(contactId) {
    const contactElement = document.querySelector(`[data-id="${contactId}"]`);
    if (contactElement) {
        contactElement.remove();
    }
}

function toggleFavoriteInList(contact) {
    const contactElement = document.querySelector(`[data-id="${contact.id}"]`);
    if (contactElement) {
        const favoriteBtn = contactElement.querySelector('.favorite-btn');
        favoriteBtn.classList.toggle('active', contact.isFavorite);
    }
}

function renderContacts(contacts) {
    const contactsList = document.getElementById('contactsList');
    contactsList.innerHTML = '';
    contacts.forEach(contact => {
        const contactElement = createContactElement(contact);
        contactsList.appendChild(contactElement);
    });
}

function createContactElement(contact) {
    const contactElement = document.createElement('div');
    contactElement.classList.add('contact-card');
    contactElement.setAttribute('data-id', contact.id);

    contactElement.innerHTML = `
        <div class="contact-header">
            <div class="contact-profile">
                ${contact.profilePicture ? 
                    `<img src="${contact.profilePicture}" alt="${contact.fullName}" class="profile-picture">` :
                    `<div class="profile-placeholder">${contact.initials}</div>`
                }
                <div>
                    <div class="contact-name">${contact.fullName}</div>
                    <div class="contact-category">${contact.category}</div>
                </div>
            </div>
            <button class="favorite-btn ${contact.isFavorite ? 'active' : ''}">&starf;</button>
        </div>
        <div class="contact-info">
            <div class="info-item"><svg>...</svg>${contact.phoneNumber}</div>
            <div class="info-item"><svg>...</svg>${contact.email}</div>
            <div class="info-item"><svg>...</svg>${contact.address}</div>
        </div>
        <div class="contact-actions">
            <button class="action-btn edit-btn">Edit</button>
            <button class="action-btn delete-btn">Delete</button>
        </div>
    `;

    contactElement.querySelector('.favorite-btn').addEventListener('click', () => {
        ContactService.toggleFavorite(contact.id);
    });

    contactElement.querySelector('.edit-btn').addEventListener('click', () => {
        openContactModal(contact);
    });

    contactElement.querySelector('.delete-btn').addEventListener('click', () => {
        ContactService.deleteContact(contact.id);
    });

    return contactElement;
}
