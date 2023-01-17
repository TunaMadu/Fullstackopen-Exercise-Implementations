/**
 * will be taking on the phone book excersice from the site
 * https://fullstackopen.com/en/part3/node_js_and_express
 */
console.clear();
const express = require('express');

const app = express();
let phoneBook = [
    {
        id: 1,
        name: 'Arto Hellas',
        number: '040-123456',
    },
    {
        id: 2,
        name: 'Ada Lovelace',
        number: '39-44-5323523',
    },
    {
        id: 3,
        name: 'Dan Abramov',
        number: '12-43-234345',
    },
    {
        id: 4,
        name: 'Mary Poppendieck',
        number: '39-23-6423122',
    },
];
/**
 * this enables us to use the req body with ease
 */

app.use(express.json());

app.use((req, res, next) => {
    console.log('server reached.');

    // since this will be a top level mw we have to have
    // next to continue the mw chain!
    next();
});

app.get('/api/persons', (req, res, next) => {
    res.json(phoneBook);
});

/**
 * here we want to get to a specific value back from
 * phonebook
 */
app.get('/api/persons/:id', (req, res, next) => {
    const id = +req.params.id;

    // we can use a array method!
    // to find the value for us.

    const entry = phoneBook.find((entries) => entries.id === id);

    if (entry) {
        res.json(entry);
    } else {
        res.status(404).end();
    }
});

/**
 * there are certain operations that dont need the literal
 * end because they include it like in json or send
 * but when we want to set specific values like statuses.
 * we need to then end the response physically!
 * if it looks like we're modifying the headers only, will need to call end()!
 */
app.delete('/api/persons/:id', (req, res, next) => {
    const id = +req.params.id;

    phoneBook = phoneBook.filter((entries) => entries.id !== id);
    console.log(phoneBook);

    res.status(204).end();
});

// here we have to generate a new id that should be large enough to have no
// duplicates.
// we also have to make sure thet the body recieved from the
// req is valid
app.post('/api/persons', (req, res, next) => {
    const id = +Math.trunc(Math.random() * 100000) + 1;
    const checkMissingContent = !req.body.name || !req.body.number;
    const checkUniqueName = phoneBook.find(
        (entries) => entries.name === req.body.name
    );

    if (checkMissingContent) {
        return res.status(400).json({
            status: 'Missing content check whether name or number exists',
        });
    }

    if (checkUniqueName) {
        return res.status(400).json({
            status: 'Name must be unique!',
        });
    }

    const entry = {
        id: id,
        name: req.body.name,
        number: req.body.number,
    };
    phoneBook.push(entry);

    // IMO the point of returning the new note is to let the programmer know
    // what was added on the server side.
    res.json(entry);
});

app.get('/info', (req, res, next) => {
    const currentEntries = phoneBook.length;
    res.send(
        `<p>Phonebook as info for ${currentEntries} people </p><p>${new Date()}</p>`
    );
});

/**
 * the following is illegal because when we send something back
 * in the previous mw we cant continue adding to the header
 * cause its already sent!
 * keep that in mind. b/c we can do some other processes, but
 * cant continue adding to the header once its already sent!
 
 app.use('/api/persons', (req, res, next) => {
     res.send('<h1>This should not be ab/le to run</h1>');
 });

*/

app.listen(3000, () => {
    console.log('server is running');
});
