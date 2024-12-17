import { EventEmitter } from './events.js';
import { Contact } from './contact.model.js';

export const ContactService = {
    STORAGE_KEY: 'phonebook_contacts',

    getContacts() {
        const contacts = localStorage.getItem(this.STORAGE_KEY);
        return contacts ? JSON.parse(contacts).map(data => new Contact(data)) : [];
    },

    saveContacts(contacts) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(contacts));
    },

    addContact(contactData) {
        const contacts = this.getContacts();
        const newContact = new Contact(contactData);
        contacts.push(newContact);
        this.saveContacts(contacts);
        EventEmitter.emit('contact:added', newContact);
        return newContact;
    },

    updateContact(contact) {
        const contacts = this.getContacts();
        const index = contacts.findIndex(c => c.id === contact.id);
        if (index !== -1) {
            contacts[index] = contact;
            this.saveContacts(contacts);
            EventEmitter.emit('contact:updated', contact);
        }
    },

    deleteContact(id) {
        const contacts = this.getContacts();
        const filteredContacts = contacts.filter(contact => contact.id !== id);
        this.saveContacts(filteredContacts);
        EventEmitter.emit('contact:deleted', id);
    },

    toggleFavorite(id) {
        const contacts = this.getContacts();
        const contact = contacts.find(c => c.id === id);
        if (contact) {
            contact.isFavorite = !contact.isFavorite;
            this.saveContacts(contacts);
            EventEmitter.emit('contact:favoriteToggled', contact);
        }
    }
};
