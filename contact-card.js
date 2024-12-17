import { ContactService } from './contact-service.js';
import { EventEmitter } from './events.js';

document.addEventListener('DOMContentLoaded', () => {
    EventEmitter.on('contact:added', renderContact);
    EventEmitter.on('contact:updated', updateContact);
    EventEmitter.on('contact:deleted', removeContact);
    EventEmitter.on('contact:favoriteToggled', toggleFavorite);
});

function renderContact(contact) {
    const contactsList = document.getElementById('contactsList');
    const contactElement = createContactElement(contact);
    contactsList.appendChild(contactElement);
}

function updateContact(updatedContact) {
    const contactElement = document.querySelector(`[data-id="${updatedContact.id}"]`);
    if (contactElement) {
        contactElement.replaceWith(createContactElement(updatedContact));
    }
}

function removeContact(contactId) {
    const contactElement = document.querySelector(`[data-id="${contactId}"]`);
    if (contactElement) {
        contactElement.remove();
    }
}

function toggleFavorite(contact) {
    const contactElement = document.querySelector(`[data-id="${contact.id}"]`);
    if (contactElement) {
        const favoriteBtn = contactElement.querySelector('.favorite-btn');
        favoriteBtn.classList.toggle('active', contact.isFavorite);
    }
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
        openEditModal(contact);
    });

    contactElement.querySelector('.delete-btn').addEventListener('click', () => {
        ContactService.deleteContact(contact.id);
    });

    return contactElement;
}

function openEditModal(contact) {
    const modal = document.getElementById('contactModal');
    modal.classList.add('active');
    document.getElementById('modalTitle').textContent = 'Edit Contact';
    
    document.getElementById('firstName').value = contact.firstName;
    document.getElementById('lastName').value = contact.lastName;
    document.getElementById('phone').value = contact.phoneNumber;
    document.getElementById('email').value = contact.email;
    document.getElementById('address').value = contact.address;
    document.getElementById('category').value = contact.category;
    document.getElementById('favorite').checked = contact.isFavorite;

    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        handleEditFormSubmit(contact.id);
    }, { once: true });
}

function handleEditFormSubmit(contactId) {
    const formData = new FormData(document.getElementById('contactForm'));
    const updatedContactData = Object.fromEntries(formData.entries());
    updatedContactData.id = contactId;

    const validation = Validators.validateContactForm(updatedContactData);
    if (!validation.isValid) {
        showErrors(validation.errors);
        return;
    }

    ContactService.updateContact(updatedContactData);
    closeModal();
}

function closeModal() {
    const modal = document.getElementById('contactModal');
    modal.classList.remove('active');
    document.getElementById('contactForm').reset();
}
