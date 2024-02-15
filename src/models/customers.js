const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
    name: {type: "String"},
    industry: {type: "String"}
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;