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

let data = {};
let m_SeasonId;
let m_ScoringPeriod;
let m_LeagueId;

const ESPNLeagues = {
	"366210" : { //The Gauntlet
		espnS2: 'AEBHlMoAYrIefvNrROA95rgFPH3y%2Bun%2BDEsGxeDF%2BTex3oTD5%2FAS2gezlGLqt0XdzRzsWFOqt%2FkVNAvIoSHn%2BZPIP%2BKa20lhYI9exWetksMb049L780Pn7rE8Nxpj5izaEep4DIrj6MBeRx%2F1n6MqPDEW2MilWyZaH6hBzBiVRXongetqnTxCG8yyDuBgAx0RZAqMxz6ieyr6sDu%2FjKhgZNJFZzdwL%2BAHCOxGtLXecQ3NnucNuFR%2B8dm%2Fqe30pE96T3QhiGBKtdS0nAcIN9e54Qw',
		SWID: '73675E39-CDD8-49A3-8421-D94C4C7105D0'
	},
	"183872" : { //There Can Be Only One
		espnS2: 'AEA7UKN4ndWlXcRYh3Zq7ckgFkuk8n9JNoUUpsY1EPIX8SrMA7YKfobgQn%2FRkwsnqIHGr5CdHqu6SCyiWqmGU8v0SfgRoTeuYi%2BL8dFq7EOMIOba3kyBmoLEItkMjOk5ANEfwPxSFdkVNo9gPHJP9Rcw9X3soTHzTu5vLP5o%2F3aV5V2GyN8pj2Y275dGnu1TbR6FSvY3xbQXbnt5sZ6GI9O%2F%2BUjy7pWSr7CAXzISv1dDxxJWRaEZ2AspZYtk9Xlnxqhijk0ribppauRjWMh90bE5',
		SWID: '73675E39-CDD8-49A3-8421-D94C4C7105D0'
	},
	"147475" : { //City of Broses
		espnS2: 'AEA%2Fy3UCItY%2F9fVGOTIYmmwePFEjCukg0giIGJ6mJEz90BK9TsgYaNAmbDWtCP36yAGZVs5STUuq1nSfokwVicGn%2F7uyuElS%2Bytfpjtx2hYd4fHdwZkHJmHoMd2MX9LpysrKYXI95JU%2Fq9%2BjQo3fAVmuqQlaBmsm9z3cwCsyNTES%2FtOMgYEXlXHWXYWDCeI27TaGLBLGuSFw0hEnUiUFKjfA8yg8%2BgPRryNhbkR5awQhtAfFFxJJrMtXm4n%2F6XOSeIN%2B6TNjAyGNBxxFCHBK14Lt',
		SWID: '73675E39-CDD8-49A3-8421-D94C4C7105D0'
	}
};

const { Client } = require('espn-fantasy-football-api/node');
const myEmail = require('./email.js');
const matchUtils = require('./utilities').Match;

app.post('/', (req, res) => {
	const response = req.body;
	m_SeasonId =  parseInt(response.seasonID);
	m_ScoringPeriod =  parseInt(response.scoringPeriod);
	m_LeagueId =  response.leagueID;

	const myClient = new Client({ leagueId: m_LeagueId });

	myClient.setCookies( ESPNLeagues[m_LeagueId] );

	//console.log(ESPNLeagues[m_LeagueId]);

	//console.log(typeof m_SeasonId);
	//console.log(typeof m_ScoringPeriod);
	//console.log(typeof m_LeagueId);

	myClient.getBoxscoreForWeek({ seasonId: m_SeasonId, scoringPeriodId: m_ScoringPeriod, matchupPeriodId: m_ScoringPeriod }).then((boxscores) => {
		data = { boxscores };
		console.log(data.boxscores);

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


	// console.log(req.body) //undefined
	res.end("Success")
})




app.get('/', function (req, res) {
	res.status(200).send(data);
});

app.listen(PORT, function() {
	console.log("Server is running on Port: " + PORT);
});