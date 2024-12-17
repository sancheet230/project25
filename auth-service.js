import { EventEmitter } from '../utils/events.js';

export const AuthService = {
    USERS_KEY: 'phonebook_users',
    CURRENT_USER_KEY: 'phonebook_current_user',

    getUsers() {
        const users = localStorage.getItem(this.USERS_KEY);
        return users ? JSON.parse(users) : [];
    },

    saveUsers(users) {
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    },

    async register(userData) {
        const users = this.getUsers();
        if (users.some(user => user.email === userData.email)) {
            throw new Error('Email already registered');
        }

        const newUser = {
            id: crypto.randomUUID(),
            email: userData.email,
            password: userData.password,
            name: userData.name,
            createdAt: Date.now()
        };

        users.push(newUser);
        this.saveUsers(users);
        EventEmitter.emit('user:registered', newUser);
        return newUser;
    },

    async login(email, password) {
        const users = this.getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            throw new Error('Invalid email or password');
        }

        const { password: _, ...userWithoutPassword } = user;
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
        EventEmitter.emit('user:login', userWithoutPassword);
        return userWithoutPassword;
    },

    logout() {
        localStorage.removeItem(this.CURRENT_USER_KEY);
        EventEmitter.emit('user:logout');
    },

    getCurrentUser() {
        const user = localStorage.getItem(this.CURRENT_USER_KEY);
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated() {
        return !!this.getCurrentUser();
    }
};
