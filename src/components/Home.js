import React from 'react';
import M from 'materialize-css';

import RoutineCard from './lib/RoutineCard';

class Home extends React.Component {
	constructor() {
		super();
		this.resetRoutineForm = this.resetRoutineForm.bind(this);
		this.state = {
			exerciseName: null,
			numReps: null,
			exerciseDuration: null
		};
	}

	componentDidMount() {
		M.AutoInit();
	}

	resetRoutineForm = () => {
		document.getElementById('routineForm').reset();
		this.setState({
			routineName: null
		});
		this.routineInput.focus();
	};

	render() {
		const exercises = Array.from(this.props.exercises);
		const routines = Array.from(this.props.routines);
		return (
			<main>
				{this.props.currentUser.displayName ? (
					<h4 className="center section teal-text text-darken-2 light">
						Welcome, {this.props.currentUser.displayName.split(' ')[0]}!
					</h4>
				) : (
					<h4 className="center section teal-text text-darken-2 light">
						Welcome, {this.props.currentUser.email}!
					</h4>
				)}
				<h2 className="center light">Routines</h2>
				<ul className="row">
					{routines.length >= 1 ? (
						routines.map((dat) => (
							<li key={dat.id}>
								<RoutineCard
									name={dat.routineName}
									id={dat.id}
									routineId={dat.id}
									exercises={exercises}
									routines={routines}
									deleteRoutine={this.props.deleteRoutine}
								/>
							</li>
						))
					) : (
						<li className="center">You have no current routines...</li>
					)}
				</ul>
				<div className="fixed-action-btn">
					<button
						className="btn-floating btn-large red modal-trigger"
						data-target="addRoutine"
						onClick={() => {
							this.routineInput.focus();
						}}
					>
						<i className="large material-icons">add</i>
					</button>
					<div id="addRoutine" className="modal">
						<div className="modal-content">
							<h4 className="center light">Add Routine</h4>
							<form
								id="routineForm"
								onSubmit={(e) => {
									e.preventDefault();
									var elem = document.querySelector('#addRoutine');
									var instance = M.Modal.getInstance(elem);
									this.props.addRoutine(this.state.routineName);
									instance.close();
									this.resetRoutineForm();
									M.AutoInit();
								}}
							>
								<div className="row">
									<div className="input-field col s12">
										<input
											ref={(input) => (this.routineInput = input)}
											id="routineName"
											type="text"
											onChange={(e) => this.setState({ routineName: e.target.value })}
										/>
										<label htmlFor="routineName">Name your routine</label>
									</div>

									<button
										className="btn modal-close"
										type="submit"
										onClick={(e) => {
											e.preventDefault();
											this.props.addRoutine(this.state.routineName);
											this.resetRoutineForm();
											M.AutoInit();
										}}
									>
										Add Routine
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</main>
		);
	}
}

export default Home;
