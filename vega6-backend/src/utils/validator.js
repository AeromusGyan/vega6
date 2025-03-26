const {check} = require('express-validator');

exports.userValidation = [
    check('email', 'Please enter valid email').isEmail().normalizeEmail({gmail_remove_dots: true}),
    check('password', 'Password is required').isLength({min: 6}),
    check('name', 'Name is required').notEmpty(),
]

exports.orderValidation = [
    check('userId').isInt().withMessage('User ID must be an integer.'),
    check('orderNumber').notEmpty().withMessage('Order number is required.'),
    check('totalAmount').isFloat({gt: 0}).withMessage('Total amount must be greater than 0.'),
    check('products').isArray({min: 1}).withMessage('At least one product is required.'),
    check('payment.method').notEmpty().withMessage('Payment method is required.'),
    check('status', 'Status is required').not().isEmpty(),
    check('shippingAddress', 'Shipping address is required').not().isEmpty(),
    check('billingAddress', 'Billing address is required').not().isEmpty(),
    check('placedAt', 'Placed at is required').not().isEmpty(),
]
exports.userAddressValidation = [
    check('userId').isInt().withMessage('User ID must be an integer.'),
    check('street').notEmpty().withMessage('Street is required.'),
    check('city').notEmpty().withMessage('City is required.'),
    check('state').notEmpty().withMessage('State is required.'),
    check('zipCode').notEmpty().withMessage('Zip code is required.'),
    check('country').notEmpty().withMessage('Country is required.'),
    check('addressType').notEmpty().withMessage('Address type is required.'),
    check('isDefault').isBoolean().withMessage('Is default must be a boolean value.'),
]
exports.customerValidation = [
    check('userId').isInt().withMessage('User ID must be an integer.'),
    check('email', 'Please enter valid email').isEmail().normalizeEmail({gmail_remove_dots: true}),
    check('phone', 'Phone number is required').notEmpty(),
    check('firstName', 'First name is required').notEmpty(),
    check('lastName', 'Last name is required').notEmpty(),
    check('gender', 'Gender is required').notEmpty(),
    check('status', 'Status is required').notEmpty(),
    check('type', 'Type is required').notEmpty(),
    check('address', 'Address object is required').notEmpty(),
    check('address.street', 'Street is required').notEmpty(),
    check('address.city', 'City is required').notEmpty(),
    check('address.state', 'State is required').notEmpty(),
    check('address.zipCode', 'Zip code is required').notEmpty(),
    check('address.country', 'Country is required').notEmpty(),
    check('address.addressType', 'Address type is required').notEmpty(),
    check('address.isDefault', 'Is default must be a boolean value').isBoolean()
]