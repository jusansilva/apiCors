const Express = require('express');
const bodyParser = require('body-parser')
const request = require('request')
const app = new Express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const PORT = 3000;
const HOST = "localholst";
const Themeparks = require("themeparks");

//parques
const DisneyWorldMagicKingdom = new Themeparks.Parks.WaltDisneyWorldMagicKingdom();
const WaltDisneyWorldHollywoodStudios = new Themeparks.Parks.WaltDisneyWorldHollywoodStudios();
const WaltDisneyWorldAnimalKingdom = new Themeparks.Parks.WaltDisneyWorldAnimalKingdom();
const WaltDisneyWorldEpcot = new Themeparks.Parks.WaltDisneyWorldEpcot();

const UniversalStudiosFlorida = new Themeparks.Parks.UniversalStudiosFlorida();
const UniversalIslandsOfAdventure = new Themeparks.Parks.UniversalIslandsOfAdventure();

const SeaworldOrlando = new Themeparks.Parks.SeaworldOrlando();
const BuschGardensTampa = new Themeparks.Parks.BuschGardensTampa();
const SixFlagsDiscoveryKingdom = new Themeparks.Parks.SixFlagsDiscoveryKingdom();






//retorna resposta como JSON
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

//aplica stream a url de stream
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

app.get('/park', (req, res) => {
    
    res.header("Access-Control-Allow-Origin", "*");

    const park = req.query.park;

    switch (park) {
        case 'DisneyWorldMagicKingdom':
            dataPark = DisneyWorldMagicKingdom;
            break;
        case 'WaltDisneyWorldHollywoodStudios':
            dataPark = WaltDisneyWorldHollywoodStudios;
            break;
        case 'WaltDisneyWorldAnimalKingdom':
            dataPark = WaltDisneyWorldAnimalKingdom;
            break;
        case 'WaltDisneyWorldEpcot':
            dataPark = WaltDisneyWorldEpcot;
            break;
        case 'UniversalStudiosFlorida':
            dataPark = UniversalStudiosFlorida;
            break;
        case 'UniversalIslandsOfAdventure':
            dataPark = UniversalIslandsOfAdventure;
            break;
        case 'SeaworldOrlando':
            dataPark = SeaworldOrlando;
            break;
        case 'BuschGardensTampa':
            dataPark = BuschGardensTampa;
            break;
        case 'SixFlagsDiscoveryKingdom':
            dataPark = SixFlagsDiscoveryKingdom;
            break;
        default:
            res.json('parque nao suportado')
            break;
    }

    // Access wait times by Promise
    dataPark.GetWaitTimes().then((rideTimes) => {
        res.json(rideTimes);
    }).catch((error) => {
        console.error(error);
    })
})


app.get('/teste', (req, res) => {
    res.render(__dirname + '/test.html');

})



app.listen(PORT, HOST)

