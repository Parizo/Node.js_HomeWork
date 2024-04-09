
import { checkSchema, param} from "express-validator";

export const userValidationSchema = checkSchema({
name: {
    notEmpty: {
        errorMessage: 'Username cannot be empty'
    }
},

password: {
    isLength: {
        options: { min:5, max: 128 },
        errorMessage: 'Password must be between 5 and 128 characters'
    },
    notEmpty: {
        errorMessage: 'Password cannot be empty'
    },
},
email: {
        isEmail: {
            errorMessage: 'Email must be valid',
    }, 
},
phone_number: { 
        notEmpty: {
            errorMessage: 'must be a valid phone number'
        },
},
address: {
        notEmpty: {
            errorMessage: 'Address cannot be empty'
        },
}
});

export const validateUserId = [
    param('id').isInt().withMessage('Id must be integer')
]