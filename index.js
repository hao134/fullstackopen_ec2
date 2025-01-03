const express = require('express');
const app = express();

app.use(express.json())


let persons = 
[
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(n => n.id))
        : 0
    
    const minId = maxId + 1
    const maxIdLimit = 100000;

    const randomId = Math.random() * (maxIdLimit - minId) + minId;
    
    return Math.floor(randomId);
}

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id 
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.number || !body.name) {
        return response.status(400).json({
            error: 'need name or number'
        })
    }

    const existPerson = persons.find((person) => person.name === body.name)
    if (existPerson){
        return response.status(400).json({
            error: 'the name already existed'
        })
    }
    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(person)

    response.json(person)
})

app.get('/info', (request, response) => {
    response.send(
        `<p>Phone book has info for ${persons.length} people</p>
        <p>${new Date()}</p>`
    );
})

const PORT = 3002
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})