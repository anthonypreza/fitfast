import React from 'react';
import StatCard from './lib/StatCard';
import M from 'materialize-css';

class Stats extends React.Component {
	constructor() {
		super();
		this.state = {
			currentRoutineId: null
		};
	}

	componentDidMount() {
		M.AutoInit();
	}

	render() {
		const exercises = Array.from(this.props.exercises);
		const routines = Array.from(this.props.routines);
		const currentRoutine =
			this.state.currentRoutineId || this.state.currentRoutineId === 0
				? routines.find((obj) => obj.id === this.state.currentRoutineId)
				: null;
		let exerciseObjects = null;
		if (currentRoutine) {
			const exerciseIds = currentRoutine.routineSteps;
			exerciseObjects = Array.from(exercises.filter((dat) => exerciseIds.includes(dat.id)));
		}

		return (
			<main className="section">
				<h1 className="center teal-text text-darken-2 light">Statistics</h1>
				<div className="container">
					<div className="center">
						<a className="dropdown-trigger btn white black-text center" href="#!" data-target="dropdown1">
							Select Routine
						</a>
					</div>
					<ul id="dropdown1" className="dropdown-content">
						{routines.map((obj) => (
							<li key={obj.id}>
								<a
									href="#!"
									className="black-text light"
									onClick={(e) => {
										this.setState({ currentRoutineId: obj.id });
									}}
								>
									{obj.routineName}
								</a>
							</li>
						))}
					</ul>
					<div className="row">
						<h3 className="center light">{currentRoutine ? currentRoutine.routineName : null}</h3>
					</div>
				</div>
				{currentRoutine ? (
					<div className="row">
						<StatCard title="# of Exercises" stat={`${currentRoutine.routineSteps.length}`} />
						<StatCard
							title="Routine Duration"
							stat={`${exerciseObjects
								.map((obj) => Number(obj.exerciseDuration))
								.reduce((a, b) => a + b, 0)} s`}
						/>
						{/* <StatCard
							title="Times Completed"
							stat={currentRoutine.numTimesCompleted ? `${currentRoutine.numTimesCompleted}` : '0'}
						/> */}
					</div>
				) : null}
			</main>
		);
	}
}

export default Stats;
