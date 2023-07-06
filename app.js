const express = require('express')
const { ObjectId } = require('mongodb')
const { connectToDb, getDb } = require('./db')

//Init app and middleware
const app = express()
app.use(express.json())

//db connection
let db

connectToDb((err) => {
    if(!err) {
        app.listen(3000, () => {
            console.log("App listening on port 3000")
        })
        db = getDb()
    }
})



//routes
app.get('/books', (req, res) => {
    //current page
    const page = req.query.page || 0
    const booksPerPage = 1

    let books = []

    db.collection('books')
        .find()
        .sort({author: 1})
        .skip(page * booksPerPage)
        .limit(booksPerPage)
        .forEach(book => books.push(book))
        .then(() => {
            res.status(200).json(books)
        })
        .catch(() => {
            res.status(500).json({error: 'Could not fetch the documents'})
        })
})

app.get('/books/:id', (req, res) => {

    const bookId = new ObjectId(req.params.id)
    if (ObjectId.isValid(req.params.id)) {
        db.collection('books')
       .findOne({_id: bookId})
       .then(doc => {
         res.status(200).json(doc)
       })
       .catch(err => {
         res.status(500).json({error: 'Could not fetch the document.'})
       })
    } else {
        res.status(500).json({error: 'Not a valid document id.'})
    }
 
})

app.post('/books', (req,res) => {
    const book = req.body

    db.collection('books')
     .insertOne(book)
     .then(result => {
        res.status(200).json(result)
     })
     .catch(err => {
        res.status(500).json({err: 'Could not create a new document'})
     })
})

app.delete('/books/:id', (req, res) => {

    const bookId = new ObjectId(req.params.id)
    if (ObjectId.isValid(req.params.id)) {
        db.collection('books')
       .deleteOne({_id: bookId})
       .then(result => {
         res.status(200).json(result)
       })
       .catch(err => {
         res.status(500).json({error: 'Could not delete the document.'})
       })
    } else {
        res.status(500).json({error: 'Not a valid document id.'})
    }
})
