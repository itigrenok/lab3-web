import fetch from 'node-fetch';
import cookieParser from "cookie-parser"
import express from 'express'

const app = express()
const urlencodedParser = express.urlencoded({extended: false});

app.use(cookieParser());
app.listen(15000)

app.post("/v1/authorization", urlencodedParser, async function (req, res) {
    let response = await fetch("http://localhost:8990/v1/authorization", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            login: req.body.login,
            password: req.body.password
        })
    }).catch((error) =>
        res.send(error)
    )

    res.cookie("access_token", await response.json()['access_token'])
        .redirect("/v1/cars")
});

app.get('/v1/authorization', function (req, res) {
    res.sendFile('/views/authorization.html', {root: '.'})
});

app.get('/', function(req, res){
    res.sendFile( 'views/authorization.html', {root: '.'})
});

app.get("/v1/cars", async (req, res) => {
    let response = await fetch("http://localhost:8990/v1/cars", {
        method: 'GET',
        headers: {
            "Authorization": req.cookies.access_token,
            'Content-Type': 'application/json'
        }
    }).catch((error) => res.send(error))

    res.send(await response.json())
});

app.get('*', function(req, res){
    res.status(404).sendFile('views/404.html', {root: '.'})
});