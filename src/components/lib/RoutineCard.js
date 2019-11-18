import React from 'react';
import { Link } from 'react-router-dom';

class RoutineCard extends React.Component {
	render() {
		const buttonStyle = { cursor: 'pointer' };
		const name = this.props.name;
		const routineId = this.props.routineId;
		const id = this.props.id;
		const exercises = this.props.exercises;
		const routine = this.props.routines.find((obj) => obj.id === id);
		const routineSteps = Array.from(routine.routineSteps);
		const stepNames = Array.from(
			exercises.filter((dat) => routineSteps.includes(dat.id)).map((dat) => dat.exerciseName)
		);

		return (
			<div className="col s12 m4">
				<div className="card small">
					<Link to={`/routines/${id}`}>
						<button
							href="#!"
							className="btn-floating halfway-fab waves-effect waves-light red"
							style={buttonStyle}
						>
							<i className="material-icons">mode_edit</i>
						</button>{' '}
					</Link>
					<div className="card-content black-text center">
						<h3 className="light">{name}</h3>
						<p className="section">
							{stepNames.length > 4 ? (
								stepNames.slice(0, 4).join(', ') + ', and more...'
							) : (
								stepNames.join(', ')
							)}
						</p>
						<Link to={`/routines/${id}`}>View this routine </Link>
					</div>
					<div className="card-action">
						<i
							className="small material-icons red-text"
							onClick={() => {
								this.props.deleteRoutine(routineId);
							}}
							style={buttonStyle}
						>
							delete
						</i>
					</div>
				</div>
			</div>
		);
	}
}

export default RoutineCard;
