const express = require("express");
const serverless = require('serverless-http');
const axios = require("axios");
const cors = require('cors');


const app = express();

const router =express.Router();

app.use(express.json());
app.use(cors());

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
    const playerName = playerData.name;
    const summonerLevel = playerData.summonerLevel;
    const profileIconId = playerData.profileIconId;


    const gamesResponse = await axios.get(`https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20&api_key=${api_key}`)
    const playerGames = gamesResponse.data;

    const data = [];

    const z = [];

    
    for (let games in playerGames) {
      const gamesDataResponse = await axios.get(`https://americas.api.riotgames.com/lol/match/v5/matches/${playerGames[games]}?api_key=${api_key}`);

      const y = [];

      for (let i = 0; i < 10; i++) {
        const playerGameChampionName = gamesDataResponse.data.info.participants[i].championName;
        const playerGameDeaths = gamesDataResponse.data.info.participants[i].deaths;
        const playerGameAssits = gamesDataResponse.data.info.participants[i].assits;
        const playerGameGold = gamesDataResponse.data.info.participants[i].goldEarned;
        const playerGameKills = gamesDataResponse.data.info.participants[i].kills;
        const playerGameSummonerName = gamesDataResponse.data.info.participants[i].summonerName;
        const playerGameWin = gamesDataResponse.data.info.participants[i].win;

        const x = [{
          championName: playerGameChampionName,
          deaths: playerGameDeaths,
          assists: playerGameAssits,
          goldEarned: playerGameGold,
          kills: playerGameKills,
          SummonerName: playerGameSummonerName
        }]

        y.push({
          player: i,
          information: x
        })


        // if (playerGameWin == playerName && playerGamWin == true ){
        //   y.push({
        //     win: true,
        //   })
        // }
      }

      z.push({
        gameId : games,
        game: y,
      })
    }

    data.push({
      playerName: playerName,
      summonerLevel: summonerLevel,
      profileIconId: profileIconId,
      game: z
    })

    res.status(200).json({ data: data });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'An error occurred while fetching player data' });
  }
});


app.use('/.netfly/functions/api', router);

module.exports.handler =serverless(app);