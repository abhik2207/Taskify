const express = require('express');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

const server = express();

server.set("view engine", "ejs");

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use(express.static(path.join(__dirname, "public")));

server.get('/', (req, res) => {
    fs.readdir("./files", (err, files) => {
        if (err) {
            console.error(err);
        }
        else {
            console.log(chalk.yellow('~ Fetched all tasks!'));
            res.render("index.ejs", { files: files });
        }
    });
});

server.post('/create', (req, res) => {
    fs.writeFile(`./files/${req.body.titleInput.split(" ").join("")}.txt`, req.body.taskInput, (err) => {
        if (err) {
            console.error(err);
        }
        else {
            console.log(chalk.yellow('~ Created a task!'));
            res.redirect("/");
        }
    });
});

server.get('/file/:filename', (req, res) => {
    fs.readFile(`./files/${req.params.filename}`, "utf-8", (err, data) => {
        if (err) {
            console.error(err);
        }
        else {
            console.log(chalk.yellow('~ Fetched a task!'));
            res.render("file.ejs", { fileName: req.params.filename, fileData: data });
        }
    });
});

server.get('/edit/:filename', (req, res) => {
    fs.readFile(`./files/${req.params.filename}`, "utf-8", (err, data) => {
        if (err) {
            console.error(err);
        }
        else {
            console.log(chalk.yellow('~ Loaded a task!'));
            res.render("edit.ejs", { fileName: req.params.filename, fileData: data });
        }
    });
});

server.post('/edit', (req, res) => {
    fs.writeFile(`./files/${req.body.previousTitle}`, `${req.body.newTask}`, (err) => {
        if (err) {
            console.error(err);
        }
        else {
            console.log(chalk.yellow("~ Updated a task's content!"));
            
            fs.rename(`./files/${req.body.previousTitle}`, `./files/${req.body.newTitle}`, (err) => {
                if (err) {
                    console.error(err);
                }
                else {
                    console.log(chalk.yellow("~ Updated a task's title!"));
                    res.redirect("/");
                }
            });
        }
    });
});

server.get('/delete/:filename', (req, res) => {
    fs.unlink(`./files/${req.params.filename}`, (err, data) => {
        if (err) {
            console.error(err);
        }
        else {
            console.log(chalk.yellow('~ Deleted a task!'));
            res.redirect("/");
        }
    });
});

server.listen(8080, () => {
    console.log(chalk.blue.bold("--- SERVER RUNNING AT PORT 8080 ---"));
});