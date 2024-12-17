document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    document.getElementById('cancelBtn').addEventListener('click', closeModal);

    const addContactBtn = document.getElementById('addContactBtn');
    if (addContactBtn) {
        addContactBtn.addEventListener('click', openContactModal);
    }
});

function openContactModal() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.classList.add('active');
        document.getElementById('modalTitle').textContent = 'Add New Contact';
        const contactForm = document.getElementById('contactForm');
        contactForm.reset();
        contactForm.removeEventListener('submit', handleEditFormSubmit);
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }
}

function closeModal() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.classList.remove('active');
        const contactForm = document.getElementById('contactForm');
        contactForm.reset();
        contactForm.removeEventListener('submit', handleContactFormSubmit);
        contactForm.removeEventListener('submit', handleEditFormSubmit);
    }
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

function handleEditFormSubmit(event) {
    event.preventDefault();
    const contactId = event.target.getAttribute('data-id');
    const formData = new FormData(event.target);
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

function showErrors(errors) {
    // Display validation errors to the user
}
