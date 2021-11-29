const express = require('express');
const { v4: uuidv4 } = require('uuid'); //instalar a dependencia yarn add uuid

const app = express();

app.use(express.json()); //middleware para api estar apt a trafegar dados json.

const customers =[];

//Middleware
function verifyifExistsAccountCPF(request, response, next){
    const { cpf } = request.params;
    
    const customer = customers.find((customer) => customer.cpf === cpf);

    if(!customer) {
        return response.status(400).json({ error: "Customer not found!" });
    }
    request.customer = customer;

    return next();

}

app.get("/", (request, response) => {
    return response.json({message: "Ta funcionando!"})
})

app.post("/account", (request, response) => {
    const { cpf, name } = request.body;
    
    const customersAlredyExists = customers.some((customer) => customer.cpf === cpf);

    if(customersAlredyExists){
        return response.status(400).json({error: "Customer alredy existis!"});
    }

    customers.push({
        cpf: cpf,
        name: name,
        id: uuidv4(),
        statement: []
    });

    return response.status(201).send();
});

app.get("/statement/:cpf", verifyifExistsAccountCPF, (request, response) => {
    const { customer } = request;
    return response.json(customer.statement);

});

app.listen(3333);