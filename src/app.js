const express = require('express')
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Customer = require('./models/customer');
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

if (process.env.NODE_ENV !== 'production'){
    dotenv.config();
}
PORT = process.env.PORT || 3000
conn = process.env.CONN

const customer = new Customer({
    name: "hari",
    industry: "Barista"
})

app.get("/", (req, res) => {
    res.json({
        message: "customer received",
        customer
    })
    customer.save();
});

// To retrieve data from customer collection
app.get('/api/customers', async(req, res) => {
    try {
        const customers = await Customer.find();
        const customer_name = customers.map(customer => customer.name);
        res.json({
            customer_name: customer_name
        })
    } catch(e) {
        res.status(500).json({Error: e.message})
    }
})

// Route to handle customer data
app.post("/api/customers", async (req, res) => {
    try {
        // Extract the data from request body
        const { name, industry } = req.body;

        // Create a new instance of customer
        const customer = new Customer({
            name: name,
            industry: industry
        })

        // save the customer data to database
        await customer.save();
        
        // send response to the user
        res.status(201).json({
            "Customer created successfully": customer
        })
    } catch (e) {
        res.json({
            Error: e.message
        })
    }
})


const start = async () => {
    await mongoose.connect(conn);
    app.listen(PORT, () => {
        console.log("Server is running on porT", PORT)
    })
}

start();

