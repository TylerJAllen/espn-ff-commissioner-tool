class TeamScore {
	constructor(teamId, score) {
		this.teamId = teamId;
		this.score = score;		
	}
};

class PlayerPositionScore {
	constructor(playerName, points, teamId) {
		this.playerName = playerName;
		this.points = points;
		this.teamId = teamId;
	}
};

exports.sortScores = function(matches) {
		const scores = [];
		
		matches.map(m => {
			const home = {
				score: m.homeScore,
				team: m.homeTeamId
			}
			const away = {
				score: m.awayScore,
				team: m.awayTeamId
			}
			
			scores.push(home, away);
		});
		
		scores.sort((a,b) => a.score < b.score ? 1 : a.score > b.score ? -1 : 0);

		return scores;
};

exports.lowestTeamScore = function(matches) {
	
	var lowestTeamScore = new TeamScore(matches[0].awayTeamId, matches[0].awayScore);

	for(let match of matches) {
		if(match.homeScore < match.awayScore && match.homeScore < lowestTeamScore.score)
		{
			lowestTeamScore.score = match.homeScore;
			lowestTeamScore.teamId = match.homeTeamId;
		}
		else if(match.awayScore < lowestTeamScore.score)
		{
			lowestTeamScore.score = match.awayScore;
			lowestTeamScore.teamId = match.awayTeamId;
		}
	}

	console.log(lowestTeamScore);
	return lowestTeamScore;
};

exports.highestTeamScore = function(matches) {

	var hightestTeamScore = new TeamScore(0, 0);

	for(let match of matches) {
		if(match.homeScore > match.awayScore && match.homeScore > hightestTeamScore.score)
		{
			hightestTeamScore.score = match.homeScore;
			hightestTeamScore.teamId = match.homeTeamId;
		}
		else if(match.awayScore > hightestTeamScore.score)
		{
			hightestTeamScore.score = match.awayScore;
			hightestTeamScore.teamId = match.awayTeamId;
		}
	}

	console.log(hightestTeamScore);
	return hightestTeamScore;
};

exports.highestScoreByPosition = function(matches, position) {

	var playerPositionScore = new PlayerPositionScore("", 0, 0);

	for(let match of matches) 
	{
		for(let homePlayer of match.homeRoster)
		{
			if(homePlayer.position == position && homePlayer.totalPoints > playerPositionScore.points)
			{
				playerPositionScore.playerName = homePlayer.player.fullName;
				playerPositionScore.points = homePlayer.totalPoints;
				playerPositionScore.teamId = match.homeTeamId;
			}
		}

		for(let awayPlayer of match.awayRoster)
		{
			if(awayPlayer.position == position && awayPlayer.totalPoints > playerPositionScore.points)
			{
				playerPositionScore.playerName = awayPlayer.player.fullName;
				playerPositionScore.points = awayPlayer.totalPoints;
				playerPositionScore.teamId = match.awayTeamId;
			}
		}
	}

	console.log(playerPositionScore);
	return playerPositionScore;
};

exports.averageTeamScore = function(matches) {

	var averageScore = 0;
	var sumScore = 0;
	var numTeams = 0;

	for(let match of matches) {
		numTeams += 2; //2 teams per match

		sumScore += match.homeScore;
		sumScore += match.awayScore;
	}

	averageScore = sumScore/numTeams;
	console.log("Avg Score " + averageScore);
	return averageScore;
};


// exports.rankPosition = function(matches) {
// 	//rank all positions and return rankings
// }