export const Validators = {
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    isValidPhone(phone) {
        return /^\d{10}$/.test(phone);
    },

    validateContactForm(data) {
        const errors = {};

        if (!data.firstName?.trim()) errors.firstName = 'First name is required';
        if (!data.lastName?.trim()) errors.lastName = 'Last name is required';
        if (!data.phoneNumber?.trim()) errors.phoneNumber = 'Phone number is required';
        if (!this.isValidPhone(data.phoneNumber)) errors.phoneNumber = 'Invalid phone number format';
        if (!data.email?.trim()) errors.email = 'Email is required';
        if (!this.isValidEmail(data.email)) errors.email = 'Invalid email format';

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }
};
