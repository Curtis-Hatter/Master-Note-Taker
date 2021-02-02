const express = require("express");
const path = require("path");
const fs = require("fs");

let app = express();
let PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

//=================================================//

//Create the get function to route html
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

//==================================================//

//Create get response to access db.json file to retrieve notes
app.get("/api/notes", function (req, res) {
    // console.log("EHLLOE!");
    fs.readFile("./db/db.json", function (err, data) {
        if (err) throw err;
        // console.log(data);
        const notes = JSON.parse(data);
        // console.log(note);
        res.send(notes);
    });
});

//Create post response to access db.json add to file and retrieve added file
app.post("/api/notes", function (req, res) {
    let newnotes = req.body;
    newnotes.id = JSON.stringify(Math.random());
    fs.readFile("./db/db.json", function (err, data) {
        if (err) throw err;
        //Retrieve old file and push data into array
        let notes = JSON.parse(data);
        //Push the request into the array
        notes.push(newnotes);
        //Overwrite old data with new
        fs.writeFile("./db/db.json", JSON.stringify(notes), function (err) {
            if (err) console.log(err);
            //respond with most recent entry text (note)
            res.send(notes[(notes.length - 1)].text);
            // res.send();
        });
    });
});

app.delete("/api/notes/:id", function (req, res) {
    const idNote = req.params.id;
    // console.log(idNote);
    fs.readFile("./db/db.json", function (err, data) {
        if (err) throw err;
        let notes = JSON.parse(data);
        // console.log(notes);
        let newNotes = [];
        notes.forEach(obj => {
            if (obj.id !== idNote) {
                newNotes.push(obj);
            };
        });
        // console.log(newNotes);
        fs.writeFile("./db/db.json", JSON.stringify(newNotes), function (err) {
            if (err) console.log(err);
            //respond with most recent entry text (note)
            // res.send(notes[(notes.length - 1)].text);
            res.send();
        });
    });
});


































app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

//Start it UP!
app.listen(PORT, function () {
    console.log("App listening on PORT" + PORT);
})