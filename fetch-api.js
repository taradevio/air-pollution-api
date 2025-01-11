require("dotenv").config()

const api_key = process.env.API_KEY
const latitude = process.env.LATITUDE
const longitude = process.env.LONGITUDE

async function getData() {
    const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${api_key}`
    try{   
        const response = await fetch(url);
        if (!response.ok){
            throw new Error(`Response status: ${response.status}`)
        }
        const json = await response.json()
        console.log(json['list'])
    } catch (error){
        console.error(error)
        // if (response.status === 401){
        //     console.error(`${response.status} - Invalid API KEY` )
            
        // }else if (response.status === 400){
        //     console.error(`${response.status} - Invalid Location` )
        
        // }else{
        //     console.error(`${response.status} - ${response.statusText}` )
        //     }
        // }
    }
}
getData()