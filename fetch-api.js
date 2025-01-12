require("dotenv").config()

const express = require('express')
const axios = require('axios')

const app = express()
const PORT = 3000

const api_key = process.env.API_KEY
const latitude = process.env.LATITUDE
const longitude = process.env.LONGITUDE
const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${api_key}`

app.get('/', async (req, res) => {

    try{

        const response = await axios.get(url);
        const data = response.data

        res.send(data)
    }catch(error){
        console.error(error)
    }

})

app.listen(PORT, ()=> {
    console.log(`Live on http://localhost:${PORT}`)
})


  