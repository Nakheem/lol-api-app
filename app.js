import express from "express";
import axios from "axios";

const app = express();

app.use(express.json())

import {getNotes, getNote, createNote } from './database.js'


app.get('/', (req, res) => {
    res.send('Welcome to the League of Legends API app!');
  });

app.get("/notes", async (req,res) =>{
    const notes = await getNotes()
    res.send(notes)
})

app.get("/notes/:id", async(req, res) => {
    const id = req.params.id
    const note = await getNote(id)
    res.send(note)
})

app.post("/notes", async (req, res) =>{
    const {title, contents } = req.body
    const note = await createNote(title, contents)
    res.status(201).send(note)
})

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

      const response = await axios.get(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=RGAPI-b502d60c-ff6e-40cc-a838-ebb8794f2363`, {

      });
      const playerData = response.data;
      const puuid = playerData.puuid;
      
      res.json(playerData);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'An error occurred while fetching player data' });
    }
  });