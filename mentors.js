
const express = require('express')
const fs = require('fs/promises')
const app = express()

app.use(express.json)

app.get('/mentors/:id', async (request, response) => {
    const id = parseInt(request.params.id)
    const data = await fs.readFile('kodemia.json', 'utf-8')
    const db = JSON.parse(data)
    const getMentors = db.mentors.filter((mentor)=>{
        return mentor.id === id
    })
    response.json(getMentors)
})

app.listen(8080, () => {
    console.log('Server is listening')
})
