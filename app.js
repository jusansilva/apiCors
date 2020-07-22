const Express = require('express');
const bodyParser = require('body-parser')
const request = require('request')
const app = new Express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const PORT = 3000;
const Themeparks = require("themeparks");
const fs = require('fs');

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
            return res.json('parque nao suportado')
            break;
    }

    // Access wait times by Promise
    dataPark.GetWaitTimes().then((rideTimes) => {
        res.json(rideTimes);
    }).catch((error) => {
        console.error(error);
    })
})


app.get('/parques', (req, res) => {
    let data = [];
    res.header("Access-Control-Allow-Origin", "*");
    const processo = async () => {
        DisneyWorldMagicKingdom.GetWaitTimes().then((d) => {
            data.push({ "WaltDisneyWorldMagicKingdom": d })
            WaltDisneyWorldHollywoodStudios.GetWaitTimes().then((d) => {
                data.push({ "WaltDisneyWorldHollywoodStudios": d })
                WaltDisneyWorldAnimalKingdom.GetWaitTimes().then((d) => {
                    data.push({ "WaltDisneyWorldAnimalKingdom": d })
                    WaltDisneyWorldEpcot.GetWaitTimes().then((d) => {
                        data.push({ "WaltDisneyWorldEpcot": d })
                        SeaworldOrlando.GetWaitTimes().then((d) => {
                            data.push({ "SeaworldOrlando": d })
                            BuschGardensTampa.GetWaitTimes().then((d) => {
                                data.push({ "BuschGardensTampa": d })
                                SixFlagsDiscoveryKingdom.GetWaitTimes().then((d) => {
                                    data.push({ "SixFlagsDiscoveryKingdom": d })
                                    res.json(data);
                                }).catch((error) => {
                                    console.log(error)
                                })
                            }).catch((error) => {
                                console.log(error)
                            })
                        }).catch((error) => {
                            console.log(error)
                        })
                    }).catch((error) => {
                        console.log(error)
                    })

                }).catch((error) => {
                    console.log(error)
                })
            }).catch((error) => {
                console.log(error)
            })
        }).catch((error) => {
            console.log(error)
        })



        // UniversalStudiosFlorida.GetWaitTimes().then((d) => {
        //     data.push(d)
        // }).catch((error) => {
        //     console.log(error)
        // })
        // UniversalIslandsOfAdventure.GetWaitTimes().then((d) => {
        //     data.push(d)
        // }).catch((error) => {
        //     console.log(error)
        // })







    }

    processo();



})

app.get('/count-down', (req, res) => {

    const { email } = req.query;

    try {
        fs.readFile('./data.json', (err, data) => {
            if (err) console.log(err);
            let database = JSON.parse(data);
            let verify = database.table.filter(value => {
                if (value.email === email) {
                    return value
                }
            })

            if (verify[0].email === email) {
                const { email, data } = verify[0];
                return res.status(200).json({ email, data });
            } else {
                return res.status(500).json({ message: "email não encontrado" })

            }
        });
    } catch (error) {
        return res.status(500).json({ message: error })
    }


})

app.post('/count-down', (req, res) => {

    const { email, data } = req.body;

    try {
        fs.readFile('./data.json', (err, response) => {

            let database = JSON.parse(response);
            database.table.push({ email: email, data: data });
            var json = JSON.stringify(database);
            fs.writeFile('./data.json', json, function (err, result) {
                if (err) console.log('error', err);
                return res.status(200).json({ message: "success" })
            });

        });

    } catch (error) {
        return res.status(500).json({ message: error })
    }

})


app.listen(PORT, function () {
    console.log("estou no ar")
})

