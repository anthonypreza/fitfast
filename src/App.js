import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import M from 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Login from './components/Login';
import Logout from './components/Logout';
import Preloader from './components/Preloader';
import Routine from './components/Routine';
import Stats from './components/Stats';
import { app, base } from './base';
import './css/index.css';

function AuthenticatedRoute({ component: Component, authenticated, ...rest }) {
	return (
		<Route
			{...rest}
			render={(props) =>
				authenticated ? (
					<Component {...props} {...rest} />
				) : (
					<Redirect to={{ pathname: '/login', state: { from: props.location } }} />
				)}
		/>
	);
}

class App extends React.Component {
	constructor() {
		super();
		this.setCurrentUser = this.setCurrentUser.bind(this);
		this.addExercise = this.addExercise.bind(this);
		this.deleteExercise = this.deleteExercise.bind(this);
		this.toggleComplete = this.toggleComplete.bind(this);
		this.addRoutine = this.addRoutine.bind(this);
		this.state = {
			currentUser: null,
			authenticated: false,
			loading: true,
			exercises: {},
			routines: {}
		};
	}

	componentWillMount() {
		this.removeAuthListener = app.auth().onAuthStateChanged((user) => {
			if (user) {
				this.setState({
					authenticated: true,
					loading: false,
					currentUser: user
				});
				this.exercisesRef = base.syncState(`${user.uid}/exercises`, {
					context: this,
					state: 'exercises'
				});
				this.routinesRef = base.syncState(`${user.uid}/routines`, {
					context: this,
					state: 'routines'
				});
			} else {
				this.setState({
					authenticated: false,
					loading: false,
					currentUser: null
				});
				base.removeBinding(this.exercisesRef);
				base.removeBinding(this.routinesRef);
			}
		});
		M.AutoInit();
	}

	componentDidMount() {
		M.AutoInit();
	}

	componentWillUnmount() {
		M.AutoInit();
		this.removeAuthListener();
		base.removeBinding(this.exercisesRef);
		base.removeBinding(this.routinesRef);
	}

	setCurrentUser(user) {
		if (user) {
			this.setState({
				currentUser: user,
				authenticated: true
			});
		} else {
			this.setState({
				currentUser: null,
				authenticated: false
			});
		}
	}

	addExercise = (name, reps, duration) => {
		let date = new Date(Date.now());
		let createdAt = date.toISOString();
		if (!name || !createdAt) {
			console.error('Invalid inputs...');
			return;
		}
		if (!reps) {
			reps = null;
		}
		if (!duration) {
			duration = null;
		}
		const currentIds = Array.from(this.state.exercises).map((dat) => dat.id);
		let newId = 0;
		while (currentIds.includes(newId)) {
			newId++;
		}
		const newExercise = {
			owner: this.state.currentUser.uid,
			createdAt: createdAt,
			id: newId,
			exerciseName: name,
			numReps: reps,
			exerciseDuration: duration,
			completed: false
		};
		const exercises = [ ...Array.from(this.state.exercises), newExercise ];
		this.setState({
			exercises: exercises
		});
		return newExercise.id;
	};

	deleteExercise = (id) => {
		const updatedExercises = Array.from(this.state.exercises.filter((dat) => dat.id !== id));
		var updatedRoutines = [ ...this.state.routines ];
		for (let x = 0; x < updatedRoutines.length; x++) {
			let newRoutine;
			if (updatedRoutines[x].routineSteps !== 'none') {
				newRoutine = updatedRoutines[x].routineSteps.filter((dat) => dat !== id);
			} else {
				newRoutine = [];
			}
			let result = 'none';
			if (newRoutine.length >= 1) {
				result = newRoutine;
			}
			updatedRoutines[x].routineSteps = result;
		}
		this.setState({
			exercises: updatedExercises,
			routines: updatedRoutines
		});
	};

	toggleComplete = (id, completed) => {
		const exercises = [ ...this.state.exercises ];
		let exerciseInQuestion = exercises.find((obj) => obj.id === id);
		exerciseInQuestion.completed = !completed;
		this.setState({ exercises });
		if (completed === false) {
			M.toast({
				html: 'Nice!',
				displayLength: 1000
			});
		}
	};

	addRoutine = (name) => {
		let date = new Date(Date.now());
		let createdAt = date.toISOString();
		if (!name || !createdAt) {
			console.error('Invalid inputs...');
			return;
		}
		const currentIds = Array.from(this.state.routines).map((dat) => dat.id);
		let newId = 0;
		while (currentIds.includes(newId)) {
			newId++;
		}
		const newRoutine = {
			owner: this.state.currentUser.uid,
			createdAt: createdAt,
			id: newId,
			routineName: name,
			routineSteps: 'none',
			numTimesCompleted: 0
		};
		this.setState({
			routines: [ ...Array.from(this.state.routines), newRoutine ]
		});
	};

	deleteRoutine = (id) => {
		const updatedRoutines = Array.from(this.state.routines.filter((dat) => dat.id !== id));
		this.setState({
			routines: updatedRoutines
		});
	};

	addExerciseToRoutine = (exerciseId, routineId) => {
		if (exerciseId === null || routineId === null) {
			console.log("Can't add to current routine...");
			return;
		}
		var routines = Array.from(this.state.routines);
		const routine = routines.find((obj) => obj.id === routineId);
		const routineSteps = routine.routineSteps;
		if (routineSteps === 'none') {
			routine.routineSteps = [ exerciseId ];
		} else {
			routine.routineSteps = [ ...Array.from(routineSteps), exerciseId ];
		}
		this.setState({ routines });
	};

	render() {
		if (this.state.loading === true) {
			return <Preloader />;
		}

		return (
			<Router>
				<div>
					<Navigation authenticated={this.state.authenticated} currentUser={this.state.currentUser} />
					<AuthenticatedRoute
						exact
						path="/"
						component={Home}
						authenticated={this.state.authenticated}
						currentUser={this.state.currentUser}
						exercises={this.state.exercises}
						routines={this.state.routines}
						addExercise={this.addExercise}
						deleteExercise={this.deleteExercise}
						toggleComplete={this.toggleComplete}
						addRoutine={this.addRoutine}
						deleteRoutine={this.deleteRoutine}
					/>
					<Route
						exact
						path="/login"
						render={(props) => {
							return <Login setCurrentUser={this.setCurrentUser} {...props} />;
						}}
					/>
					<Route exact path="/logout" component={Logout} />
					{Array.from(this.state.routines).map((obj) => (
						<AuthenticatedRoute
							key={obj.id}
							path={`/routines/${obj.id}`}
							routineId={obj.id}
							routine={obj}
							component={Routine}
							authenticated={this.state.authenticated}
							currentUser={this.state.currentUser}
							exercises={this.state.exercises}
							routines={this.state.routines}
							addExercise={this.addExercise}
							deleteExercise={this.deleteExercise}
							toggleComplete={this.toggleComplete}
							addRoutine={this.addRoutine}
							deleteRoutine={this.deleteRoutine}
							addExerciseToRoutine={this.addExerciseToRoutine}
						/>
					))}
					<AuthenticatedRoute
						exact
						path="/stats"
						component={Stats}
						authenticated={this.state.authenticated}
						currentUser={this.state.currentUser}
						exercises={this.state.exercises}
						routines={this.state.routines}
						addExercise={this.addExercise}
						deleteExercise={this.deleteExercise}
						toggleComplete={this.toggleComplete}
						addRoutine={this.addRoutine}
						deleteRoutine={this.deleteRoutine}
						addExerciseToRoutine={this.addExerciseToRoutine}
					/>
				</div>
			</Router>
		);
	}
}

export default App;
