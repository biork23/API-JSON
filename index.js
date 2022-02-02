
const express = require('express')
const fs = require('fs')
const fsPromise= require('fs/promises')


const app = express()

app.use(express.json()) //sin esta linea no puedo leer el body

// app.get('/file', (request, response) => { 
//     response.send('hola mundo')
// })
// app.get('/file', function (req, res){
//     fs.readFile('text.txt', function (error, data){
//         res.send(data)
//     })
// })
app.get('/file', (request, response) => {
    fs.readFile('text.txt', (error, response) => {
        if (error) {
            response.send('no se pudo leer ;c')
            return
        }
    })
})

app.get('/file-promise', (request, response)=> {
    fsPromise.readFile('text.txt', 'utf-8')
    .then((data) => {
        response.send(data)
    })
    .catch((error) => {
        response.send('no se pudo leer ;c')
    })
})
//con promises (async-await)
// app.get('/file-async', async (request, response) => {
//     const data = await fsPromise.readFile('text.txt', 'utf-8')
//     response.send(data)
// })
app.get('/koders',async (request, response) => {
    const data = await fsPromise.readFile('kodemia.json', 'utf-8')
    const db = JSON.parse(data)
    let kodersFound = db.koders

    if(request.query.max_age) {
        kodersFound = kodersFound.filter((koder)=>{
            return koder.age = parseInt(request.query.max_age)
        })

    }


    response.json(kodersFound)
})

// app.get('/koders/:name', async (request, response) =>{
//     const name = request.params.name
//     const data = await fsPromise.readFile('kodemia.json', 'utf-8')
//     const db = JSON.parse(data)
//      const koderFound = db.koders.find((koder) => {
//     return koder.name.toLowerCase() === name.toLowerCase()

//      })
//      response.json(koderFound)
// })

// app.get('/koders/sex/:sex', async (request, response) => {
//     const sex = request.params.sex
//     const data = await fsPromise.readFile('kodemia.json', 'utf-8')
//     const sx = JSON.parse(data)
//     const genderSex = sx.koders.filter((koder) => {
//         return koder.sex.toLowerCase() === sex.toLowerCase()
//     })
//     response.json(genderSex)
// })

app.get('/koders/:id', async (request, response) =>{
    const id = parseInt(request.params.id)
    const data = await fsPromise.readFile('kodemia.json', 'utf-8')
    const db = JSON.parse(data)
    const koderFound = db.koders.filter((koder) => {
        return koder.id === id

     })
     response.json(koderFound)
})
//crear un koder
app.post('/koders', async (request, response) => {
const data = await fsPromise.readFile('kodemia.json', 'utf-8')
const db = JSON.parse(data)

const newKoderId = db.koders.length + 1
const newKoderData = {
    id: newKoderId,
    ...request.body
}

db.koders.push(newKoderData)
const dbAsSring = JSON.stringify(db, '\n', 2)
await fsPromise.writeFile('kodemia.json', dbAsSring, 'utf-8')


    response.json(db.koders)
})
//metodo delete
app.delete('/koders/:id', async (request, response)=> {
    const id = parseInt(request.params.id)
    const data = await fsPromise.readFile('kodemia.json', 'utf-8')
    const db = JSON.parse(data)

    const newKodersArray = db.koders.filter((koder) => id != koder.id)
    db.koders = newKodersArray
    const dbAsString = JSON.stringify(db, '\n', 2)
    await fsPromise.writeFile('kodemia.json', dbAsString, 'utf-8')
    response.json(db.koders)


})
  
app.patch('/koders/:id', async(request, response)=>{
    const id =parseInt(request.params.id)
    if(isNaN(id)){
        response
         .status(400)
         .json({
             message: ' id must be a number'
         })
         return
    }
    const data = await fsPromise.readFile('kodemia.json', 'utf-8')
    const db = JSON.parse(data)
    const koderFoundIndex = db.koders.findIndex((koder) => id === koder.id)
    if (koderFoundIndex < 0 ){
        response.status(404)
        response.json({
            message: 'koder not found'
        })
        return
    }

    db.koders[koderFoundIndex] = {
        ...db.koders[koderFoundIndex],
        ...request.body,
    }

    const dbAsString = JSON.stringify(db, '\n', 2)
    await fsPromise.writeFile('kodemia.json', dbAsString, 'utf-8')
    response.json(db.koders[koderFoundIndex])

})


app.listen(8080, () => {
    console.log('Server is listening')
})




