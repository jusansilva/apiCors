const Express = require('express');
const bodyParser = require('body-parser')
const request = require('request')
const app = new Express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const PORT = 3000;
const HOST = "0.0.0.0";

app.get('/', (req, res) => {
    const URL = req.query.data;

    res.header("Access-Control-Allow-Origin", "*");
    const dados = request.get(URL, function (error, response) {
        if (!error) {
            res.setHeader('Content-Type', 'text/plain')
            res.send(response.body)
        }
    })

});

app.get('/radio', (req, res) => {
    const URL = req.query.data;
    var strem = request(URL)

    res.header("Access-Control-Allow-Origin", "*");

    res.writeHead(200, {
        "Content-Type": "audio/mpeg"
    });

    try {
        strem.pipe(res)
    } catch (error) {
        console.log(error)
    }

});

app.listen(PORT, PORT)

