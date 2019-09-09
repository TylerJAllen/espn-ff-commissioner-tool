const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 4000;

const allowCrossDomain = function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header("Access-Control-Allow-Credentials", "true");
	res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
	res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
	next();
};

//middleware
app.use(express.static('build'));
app.set('views', './build');
app.use(allowCrossDomain);
app.use(cors());
app.use(express.json());

const { Client } = require('espn-fantasy-football-api/node');
const myEmail = require('./email.js');
const matchUtils = require('./utilities').Match;
const myClient = new Client({ leagueId: 366210 });

myClient.setCookies({ espnS2: 'AEBxj59LhZR9gGHOlmjtmtwq29SGQJfSMCTgBIZR2a4tpSS3oBKdN9Pv%2B%2BmEVT7wdevZjt51N9iHUkM%2B%2FXAIBOemDz%2BNHKRCRmaDYZQpaO5Bgq9tZLus6vGri6kLGIFCd7T2B1Zb5l7nUhj5gCKz2juRYhUyDOCFN85z%2BsHZGOLsadDirS4mrnUE5EHCYcK25ZvaNs1hLWynHKTpgatQ9%2B6A9vrE7HItdQkND9WeSbatEcPrXlceuI8JqNtGI6DbbO5ZIPzimUQ1xbQ1Bw7y1dupadT5if6MMBWNAQncpqslEg%3D%3D', SWID: '73675E39-CDD8-49A3-8421-D94C4C7105D0' });

let data = {};

myClient.getBoxscoreForWeek({ seasonId: 2018, scoringPeriodId: 5, matchupPeriodId: 5 }).then((boxscores) => {
	data = { boxscores };
	const scores = matchUtils.sortScores(data.boxscores);

	const lowScoreTest = matchUtils.lowestTeamScore(boxscores);
	const highScoreTest = matchUtils.highestTeamScore(boxscores);
	const qbTest = matchUtils.highestScoreByPosition(boxscores, "QB");
	const rbTest = matchUtils.highestScoreByPosition(boxscores, "RB");
	const wrTest = matchUtils.highestScoreByPosition(boxscores, "WR");
	const teTest = matchUtils.highestScoreByPosition(boxscores, "TE");
	const dstTest = matchUtils.highestScoreByPosition(boxscores, "D/ST");
	const avgTeamScore = matchUtils.averageTeamScore(boxscores);

	if(scores) {
		myEmail.email(scores);
	}
});

app.post('/', (req, res) => {
	const response = req.body;
	console.log(response.seasonID);
	console.log(response.scoringPeriod);
	console.log(response.leagueID);
	// console.log(req.body) //undefined
	res.end("Success")
})

app.get('/', function (req, res) {
	res.status(200).send(data);
});


app.listen(PORT, function() {
	console.log("Server is running on Port: " + PORT);
});