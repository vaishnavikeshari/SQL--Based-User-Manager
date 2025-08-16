const { faker } = require('@faker-js/faker');
const express = require("express");
const path = require("path");
const app = express();
const methodOverride = require('method-override');
const { v4: uuidv4 } = require('uuid');

app.use(methodOverride('_method'));

let port = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    let q = "select count(*) from user";
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let count = result[0]["count(*)"];
            res.render("index.ejs", { count });

        });
    }
    catch (err) {
        console.log(err);
        res.send("some error in DB");
    }
})

app.get("/user", (req, res) => {
    let q = "select id,username,email from user";
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;

            let data = result;
            res.render("show.ejs", { data });

        });
    }
    catch (err) {
        console.log(err);
        res.send("some error in DB");
    }
})

app.get("/user/:id/edit", (req, res) => {
    let { id } = req.params;
    let q = `select * from user where id='${id}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;

            let data = result[0];
            res.render("edit.ejs", { data });


        });
    }
    catch (err) {
        console.log(err);
        res.send("some error in DB");
    }
});

app.patch("/user/:id", (req, res) => {
    let { password: formpass, username: newusername } = req.body;
    let { id } = req.params;

    let q = `select * from user where id='${id}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;

            let data = result[0];
            if (data.password != formpass) {
                res.send("wrong password");
            }
            else {
                let q2 = `update user set username='${newusername}' where id='${id}'`;
                try {
                    connection.query(q2, (err, result) => {
                        if (err) throw err;
                        res.redirect("http://localhost:8080/user");
                    });
                }
                catch (err) {
                    console.log(err);
                    res.send("some error in DB");
                }
            }

        });
    }
    catch (err) {
        console.log(err);
        res.send("some error in DB");
    }
});

app.get("/user/add",(req,res)=>{
      res.render("add.ejs");
})

app.post("/user/add",(req,res)=>{
    let {username,email,password}=req.body;
    let id=uuidv4();

    let q = `insert into user (id,username,email,password) values ('${id}','${username}','${email}','${password}')`;
   
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            console.log(result);
            res.redirect("/");
        });
    }
    catch (err) {
        console.log(err);
        res.send("some error in DB");
    }
})

app.delete("/user/:id",(req,res)=>{
    let {id}=req.params;
     let q = `delete from user where id='${id}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;

            let data = result[0];
            res.redirect("/user");

        });
    }
    catch (err) {
        console.log(err);
        res.send("some error in DB");
    }
})



app.listen(port, () => {
    console.log(`Server is listening on ${port}.....`)
});

const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'app',
    password: 'Ayush@123'

});

// try{
//     connection.query(q,[data],(err,result)=>{
//     if(err) throw err;
//     console.log(result);
// });
// }
// catch(err){
//     console.log(err);
// }

// connection.end();


function getRandomUser() {
    return [
        faker.string.uuid(),
        faker.internet.username(), // before version 9.1.0, use userName()
        faker.internet.email(),
        faker.internet.password(),

    ];
}

