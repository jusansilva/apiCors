const Express = require('express');
const bodyParser = require('body-parser')
const request = require('request')
const app = new Express();
app.use(Express.json())
app.use(Express.urlencoded({ extended: true }))
const PORT = 3000;
var Themeparks = require("themeparks");
const baseUrl = 'https://touringplans.com';
const fs = require('fs');
const fetch = require('node-fetch');
const axios = require('axios');
const cors = require('cors')

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

app.get('/park', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");

    const park = req.query.park;
    switch (park) {
        case 'DisneyWorldMagicKingdom':
            const magicKingdom = (parque) => {
                return fetch(`${baseUrl}/${parque}/attractions.json`).then((response) => {
                    return response.json();
                }).then(async (dataJson) => {
                    const data = await Promise.all(dataJson.map((element) => {

                        return fetch(`${baseUrl}/${parque}/attractions/${element.permalink}.json`).then((resp) => {
                            return resp.json()
                        }).then((d) => {
                            return { name: d.name , status: d.open_emh_morning?"Aberto":"fechado", waitTime: d.average_wait_per_hundred?d.average_wait_per_hundred:'' };
                        })
                    }))
                    return data;
                })
            }
            return res.json(await magicKingdom('magic-kingdom'));
            break;
        case 'WaltDisneyWorldHollywoodStudios':
            const HollywoodStudios = (parque) => {
                return fetch(`${baseUrl}/${parque}/attractions.json`).then((response) => {
                    return response.json();
                }).then(async (dataJson) => {
                    const data = await Promise.all(dataJson.map((element) => {

                        return fetch(`${baseUrl}/${parque}/attractions/${element.permalink}.json`).then((resp) => {
                            return resp.json()
                        }).then((d) => {
                            return { name: d.name , status: d.open_emh_morning?"Aberto":"fechado", waitTime: d.average_wait_per_hundred?d.average_wait_per_hundred:'' };
                        })
                    }))
                    return data;
                })
            }
            return res.json(await HollywoodStudios('hollywood-studios'));
            break;
        case 'WaltDisneyWorldAnimalKingdom':
            const WorldAnimalKingdom = (parque) => {
                return fetch(`${baseUrl}/${parque}/attractions.json`).then((response) => {
                    return response.json();
                }).then(async (dataJson) => {
                    const data = await Promise.all(dataJson.map((element) => {

                        return fetch(`${baseUrl}/${parque}/attractions/${element.permalink}.json`).then((resp) => {
                            return resp.json()
                        }).then((d) => {
                            return { name: d.name , status: d.open_emh_morning?"Aberto":"fechado", waitTime: d.average_wait_per_hundred?d.average_wait_per_hundred:'' };
                        })
                    }))
                    return data;
                })
            }
            return res.json(await WorldAnimalKingdom('animal-kingdom'));
            break;
        case 'WaltDisneyWorldEpcot':
            const Epcot = (parque) => {
                return fetch(`${baseUrl}/${parque}/attractions.json`).then((response) => {
                    return response.json();
                }).then(async (dataJson) => {
                    const data = await Promise.all(dataJson.map((element) => {

                        return fetch(`${baseUrl}/${parque}/attractions/${element.permalink}.json`).then((resp) => {
                            return resp.json()
                        }).then((d) => {
                            return { name: d.name , status: d.open_emh_morning?"Aberto":"fechado", waitTime: d.average_wait_per_hundred?d.average_wait_per_hundred:'' };
                        })
                    }))
                    return data;
                })
            }
            return res.json(await Epcot('epcot'));
            break;
        case 'UniversalStudiosFlorida':
            UniversalStudiosFlorida.GetWaitTimes().then((d) => {
                return res.json(d)
            }).catch((error) => {
                console.log(error)
            })
            break;
        case 'UniversalIslandsOfAdventure':
            UniversalIslandsOfAdventure.GetWaitTimes().then((d) => {
                return res.json(d)
            }).catch((error) => {
                console.log(error)
            })
            break;
        case 'SeaworldOrlando':
            SeaworldOrlando.GetWaitTimes().then((d) => {
                return res.json(d)
            }).catch((error) => {
                console.log(error)
            })
            break;
        case 'BuschGardensTampa':
            BuschGardensTampa.GetWaitTimes().then((d) => {
                return res.json(d)
            }).catch((error) => {
                console.log(error)
            })
            break;
        case 'SixFlagsDiscoveryKingdom':
            SixFlagsDiscoveryKingdom.GetWaitTimes().then((d) => {
                return res.json(d)
            }).catch((error) => {
                console.log(error)
            })
            break;
        default:
            return res.json('parque nao suportado')
            break;
    }
});




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
                        UniversalStudiosFlorida.GetWaitTimes().then((d) => {
                            data.push(d)
                            UniversalIslandsOfAdventure.GetWaitTimes().then((d) => {
                                data.push(d)
                                return res.json(data);

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
    }

    processo();

});


app.post('/sehal', async (req, res) => {
    const { login, senha } = req.body
    const token = "815E6988B0AEA1BAA77AD0688A2EA361";
    if (!login || !senha) return res.status(401).json({ error: true, msg: "login e senha obrigatorio" })

    const data = JSON.stringify({
        "sdtCNPJ": {
            "Token": token,
            "CNPJ": login
        }
    });

    var config = {
        method: 'post',
        url: 'https://sehal.arccasoftware.com/rest/getdadospessoa',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

   await axios(config)
        .then(function (response) {
            
            response.data.sdtDadosPessoa.senha = "1234";
            if (response.data.sdtDadosPessoa.senha !== senha) {
                return res.status(400).json({ error: true, msg: "senha incorreta" })
            }
            delete response.data.sdtDadosPessoa.senha;
            console.log(response.data.sdtDadosPessoa)

            res.json(response.data.sdtDadosPessoa).status(200);
        })
        .catch(function (error) {
            res.json(error).status(500);
        });

})


app.listen(PORT, function () {
    console.log("estou no ar")
})



