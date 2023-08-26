const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json())

//To-do move to env file
const api_key = 'RGAPI-b502d60c-ff6e-40cc-a838-ebb8794f2363'

app.get('/', (req, res) => {
    res.send('Welcome to the League of Legends API app!');
  });

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.listen(8080, () => {
    console.log('Server is running on port  8080')
})

app.get('/player/:summonerName', async (req, res) => {
    const { summonerName } = req.params;
    try {

      const response = await axios.get(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${api_key}`, {

      });
      const playerData = response.data;
      const puuid = playerData.puuid;
      res.json(playerData);
      
      response = await axios.get(`https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20&api_key=${api_key}`)
      playerGames = response.data;

      for (games in playerGames){
        
      }
      
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'An error occurred while fetching player data' });
    }
  });