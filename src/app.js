const express = require('express')
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Customer = require('./models/customers');
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

if (process.env.NODE_ENV !== 'production'){
    dotenv.config();
}
PORT = process.env.PORT || 3000
conn = process.env.CONN

//api end point to send customer data
app.post("/api/customers", async (req, res)=>{
    try{
        const {name, industry} = req.body;
        const newCustomer = new Customer({
        name: name,
        industry: industry
        });
        await newCustomer.save();
        res.status(201).json({
            message: "new customer created",
            newCustomer
        })
    } catch(error){
        res.status(500).json({
            Error: error.message
        })
    }
})

// api end point to get all customers data
app.get("/api/customers", async(req, res)=>{
    try{
        const customers = await Customer.find();
        res.status(200).json({
            message: "customers",
            customers
        });
    } catch(e){
        res.status(500).json({
            Error: e.messsage
        })
    }
})

// api end point to update name and industry
app.put("/api/customers/:customerId", async(req, res)=>{
    try{
        const {customerId} = req.params;
        const updatedCustomer = await Customer.findByIdAndUpdate(customerId, req.body, {new: true});
        if (!updatedCustomer){
            return res.status(404).json({Error:"No record found"})
        }
        res.status(200).json({updatedCustomer})
    }catch(e){
        res.status(500).json({Error:e.message});
    }
});

//api end point to update industry only
app.patch("/api/customers/update-industry/:customerId", async(req, res)=>{
    const customerId = req.params.customerId;
    const {industry} = req.body;
    const updatedIndustry = await Customer.findByIdAndUpdate(customerId, {industry:industry}, {new: true});
    if(!updatedIndustry){
        return res.status(404).json({Error: "not found"})
    }
    res.status(200).json({updatedIndustry});
})

//api end point to get a customer
app.get("/api/customers/customer/:customerId", async(req, res)=>{
    try{
        const {customerId} = req.params;
        const customer = await Customer.findById(customerId);
        if (!customer){
            return res.status(404).json({
                Error: "Record not found"
            })
        }
        res.status(200).json({customer});
    }catch(e){
        res.status(500).json({
            Error: e.message
        })
    }
});

//api endpoint to delete a customer
app.delete("/api/customers/:id", async(req, res)=>{
    try{
        const customerId = req.params.id;
        console.log(customerId);
        const result = await Customer.deleteOne({ _id: customerId});
        if (result.deletedCount === 1){
            res.status(200).json({message: "Customer deleted successfully"})
        } else {
            res.status(404).json({message: "Customer not found"})
        }
    }catch(error){
        res.status(500).json({Error: "Something went wrong"})
    }
})
const start = async () => {
    await mongoose.connect(conn);
    app.listen(PORT, () => {
        console.log("Server is running on port", PORT)
    })
}

start();

