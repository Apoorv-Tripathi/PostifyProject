const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const methodOverride = require("method-override");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

let posts = [
    {
        id: uuidv4(),
        username: "Apoorv",
        content: "I love coding! Building things from scratch is pure joy.",
        createdAt: new Date(),
    },
    {
        id: uuidv4(),
        username: "Amit",
        content: "Hard work pays off. Never stop learning and growing every day.",
        createdAt: new Date(),
    },
    {
        id: uuidv4(),
        username: "Akshat",
        content: "Time and Tide wait for none. Make the most of every moment.",
        createdAt: new Date(),
    },
];

app.get("/posts", (req, res) => {
    res.render("index.ejs", { posts });
});

app.get("/posts/new", (req, res) => {
    res.render("new.ejs", { query: req.query });
});

app.post("/posts", (req, res) => {
    let { username, content } = req.body;
    username = username ? username.trim() : "";
    content = content ? content.trim() : "";
    if (!username || !content) return res.redirect("/posts/new?error=empty");
    let id = uuidv4();
    posts.push({ id, username, content, createdAt: new Date() });
    res.redirect("/posts");
});

app.get("/posts/:id", (req, res) => {
    let { id } = req.params;
    let post = posts.find((p) => id === p.id);
    if (!post) return res.status(404).render("404.ejs");
    res.render("show.ejs", { post });
});

app.get("/posts/:id/edit", (req, res) => {
    let { id } = req.params;
    let post = posts.find((p) => id === p.id);
    if (!post) return res.status(404).render("404.ejs");
    res.render("edit.ejs", { post, query: req.query });
});

app.patch("/posts/:id", (req, res) => {
    let { id } = req.params;
    let newContent = req.body.content ? req.body.content.trim() : "";
    let post = posts.find((p) => id === p.id);
    if (!post) return res.status(404).render("404.ejs");
    if (!newContent) return res.redirect(`/posts/${id}/edit?error=empty`);
    post.content = newContent;
    res.redirect("/posts");
});

app.delete("/posts/:id", (req, res) => {
    let { id } = req.params;
    posts = posts.filter((p) => id !== p.id);
    res.redirect("/posts");
});

app.get("/", (req, res) => {
    res.redirect("/posts");
});

app.use((req, res) => {
    res.status(404).render("404.ejs");
});

app.listen(port, () => {
    console.log(`Postify listening at http://localhost:${port}`);
});