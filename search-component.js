import { EventEmitter } from './events.js';

export const SearchComponent = {
    searchInput: document.getElementById('searchInput'),
    categoryFilter: document.getElementById('categoryFilter'),
    
    init() {
        this.searchInput.addEventListener('input', () => this.triggerSearch());
        this.categoryFilter.addEventListener('change', () => this.triggerSearch());
    },

    triggerSearch() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const category = this.categoryFilter.value;
        EventEmitter.emit('search:changed', { searchTerm, category });
    },

    filterContacts(contacts, { searchTerm, category }) {
        return contacts.filter(contact => {
            const matchesSearch = 
                contact.firstName.toLowerCase().includes(searchTerm) ||
                contact.lastName.toLowerCase().includes(searchTerm) ||
                contact.email.toLowerCase().includes(searchTerm) ||
                contact.phoneNumber.includes(searchTerm);
            
            const matchesCategory = category === 'All' || contact.category === category;
            
            return matchesSearch && matchesCategory;
        }).sort((a, b) => {
            if (a.isFavorite === b.isFavorite) {
                return b.createdAt - a.createdAt;
            }
            return a.isFavorite ? -1 : 1;
        });
    }
};
