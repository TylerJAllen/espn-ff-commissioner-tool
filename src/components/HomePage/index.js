import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useEspnForm } from './../CustomHooks';

const HomePage = () => {
	const [data, setData] = useState();
	const [seasonId, setSeasonId] = useState();
	const [scoringPeriod, setScoringPeriod] = useState();
	const [leagueId, setLeagueId] = useState();

	const getData = async() => {
		const currentData = await axios.get('http://localhost:4000/');
		console.log(currentData.data.boxscores)
		// const data = await JSON.parse(currentData);
		// return currentData;
	}

	const postData = (sId, sP, lId) => {
		axios.post('http://localhost:4000/', {
			seasonID: sId,
			scoringPeriod: sP,
			leagueID: lId
		})
		.then(function (response) {
			console.log("post: ",response);
		})
		.catch(function (error) {
			console.log(error);
		});
	}

	// useEffect(() => {
	// 	getData();
	// })


	const league = () => {
		setSeasonId(inputs.seasonId);
		setScoringPeriod(inputs.scoringPeriod);
		setLeagueId(inputs.leagueId);
		
		alert(`League Info: 
		SeasonID: ${inputs.seasonId}
		Scoring Period: ${inputs.scoringPeriod}
		LeagueID: ${inputs.leagueId}`);

		// getData();
		postData(inputs.seasonId, inputs.scoringPeriod, inputs.leagueId);
	}

	const { inputs, handleInputChange, handleSubmit } = useEspnForm(league);

	return (
		<div>
			<p>ESPN FF Tool</p>
			<form onSubmit={handleSubmit}>
			<div>
				<label>
					Season ID:
					<input
						type="text"
						name="seasonId"
						onChange={handleInputChange}
						value={inputs.seasonId}
						required />
				</label>
			</div>
			<div>
				<label>
					Scoring Period:
					<input
						type="text"
						name="scoringPeriod"
						onChange={handleInputChange}
						value={inputs.scoringPeriod}
						required />
				</label>
			</div>
			<div>
				<label>
					League ID:
					<input
						type="text"
						name="leagueId"
						onChange={handleInputChange}
						value={inputs.leagueId}
						required />
				</label>
			</div>
			<button type="submit">Submit</button>
		</form>
		</div>
	)
}

export default HomePage;