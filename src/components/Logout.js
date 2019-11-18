import React from 'react';
import { Redirect } from 'react-router-dom';
import Preloader from './Preloader';
import { app } from '../base';

class Logout extends React.Component {
	constructor() {
		super();
		this.state = {
			redirect: false
		};
	}

	componentWillMount() {
		app.auth().signOut().then((user, err) => {
			this.setState({ redirect: true });
		});
	}

	render() {
		if (this.state.redirect === true) {
			return <Redirect to="/" />;
		}
		return <Preloader />;
	}
}

export default Logout;
