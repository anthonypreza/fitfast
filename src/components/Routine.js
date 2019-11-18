import React from 'react';
import ExerciseCard from './lib/ExerciseCard';

class Routine extends React.Component {
	constructor() {
		super();
		this.resetForm = this.resetForm.bind(this);
		this.state = {};
	}

	resetForm = () => {
		document.getElementById('addForm').reset();
		this.setState({
			exerciseName: null,
			numReps: null,
			exerciseDuration: null
		});
		this.formInput.focus();
	};

	render() {
		const routineId = this.props.routineId;
		const routine = this.props.routine;
		const exercises = this.props.exercises;
		const exerciseIds = routine.routineSteps;
		let exerciseObjects = false;
		if (exerciseIds) {
			exerciseObjects = Array.from(exercises.filter((dat) => exerciseIds.includes(dat.id)));
		}

		return (
			<main className="section">
				<h1 className="light teal-text center">{routine.routineName}</h1>
				<h5 className="light center">Routine</h5>
				<div className="row">
					{exerciseObjects ? (
						exerciseObjects.map((dat) => (
							<ExerciseCard
								key={dat.id}
								exerciseName={dat.exerciseName}
								numReps={dat.numReps}
								exerciseDuration={dat.exerciseDuration}
								completed={dat.completed}
								id={dat.id}
								toggleComplete={this.props.toggleComplete}
								deleteExercise={this.props.deleteExercise}
							/>
						))
					) : null}
				</div>
				<h4 className="center light">Add exercise to routine</h4>
				<div className="row container">
					<form
						id="addForm"
						className="col s12"
						onSubmit={(e) => {
							e.preventDefault();
							let exerciseKey = this.props.addExercise(
								this.state.exerciseName,
								this.state.numReps,
								this.state.exerciseDuration
							);
							this.props.addExerciseToRoutine(exerciseKey, routineId);
							this.resetForm();
						}}
					>
						<div className="row">
							<div className="input-field col s4">
								<input
									ref={(input) => (this.formInput = input)}
									id="exerciseName"
									type="text"
									onChange={(e) => this.setState({ exerciseName: e.target.value })}
								/>
								<label htmlFor="exerciseName">Exercise</label>
							</div>
							<div className="input-field col s4">
								<input
									id="numReps"
									type="number"
									onChange={(e) => this.setState({ numReps: e.target.value })}
								/>
								<label htmlFor="numReps"># of Reps</label>
							</div>
							<div className="input-field col s4">
								<input
									id="exerciseDuration"
									type="number"
									onChange={(e) => this.setState({ exerciseDuration: e.target.value })}
								/>
								<label htmlFor="exerciseDuration">Duration (s)</label>
							</div>
							<button
								className="btn"
								type="submit"
								onClick={(e) => {
									e.preventDefault();
									let exerciseKey = this.props.addExercise(
										this.state.exerciseName,
										this.state.numReps,
										this.state.exerciseDuration
									);
									this.props.addExerciseToRoutine(exerciseKey, routineId);
									this.resetForm();
								}}
							>
								Add Exercise
							</button>
						</div>
					</form>
				</div>
			</main>
		);
	}
}

export default Routine;
