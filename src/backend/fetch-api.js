import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import axios from 'axios';

const app = express()
const PORT = 3000

const api_key = process.env.API_KEY
const latitude = process.env.LATITUDE
const longitude = process.env.LONGITUDE
const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${api_key}`

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const frontendPath = path.join(__dirname, '..', '..', 'src', 'frontend');
app.use(express.static(frontendPath));

app.get('/api/data', async (req, res) => {

    try{

        const response = await axios.get(url);
        const data = response.data

        res.send(data)
    }catch(error){
        console.error(error)
    }

})

app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'))
})

app.listen(PORT, ()=> {
    console.log(`Live on http://localhost:${PORT}`)
})


  