import React from 'react';
import { Link } from 'react-router-dom';
import M from 'materialize-css';

class Navigation extends React.Component {
	componentDidMount() {
		M.AutoInit();
	}
	render() {
		return (
			<div className="nav">
				<nav>
					<div className="nav-wrapper teal">
						{this.props.authenticated ? (
							<a href="#!" data-target="mobile-nav" className="sidenav-trigger show-on-large">
								<i className="material-icons">menu</i>
							</a>
						) : null}

						{this.props.authenticated ? (
							<ul className="right hide-on-med-and-down">
								<li>
									<Link to="/">Routines</Link>
								</li>
								{/* <li>
                  <Link to="/progress">Progress</Link>
                </li> */}
								<li>
									<Link to="/stats">Stats</Link>
								</li>
							</ul>
						) : (
							<ul className="right hide-on-med-and-down">
								<li>
									<Link to="/login">Login</Link>
								</li>
							</ul>
						)}
					</div>
				</nav>

				{this.props.authenticated && this.props.currentUser ? (
					<ul className="sidenav sidenav-fixed" id="mobile-nav">
						<li>
							<div className="user-view">
								{this.props.currentUser.photoURL ? (
									<a href="#user">
										<img className="circle" src={this.props.currentUser.photoURL} alt="User" />
									</a>
								) : null}

								<a href="#name">
									<span className="black-text name">{this.props.currentUser.displayName}</span>
								</a>
								<a href="#email">
									<span className="black-text email">{this.props.currentUser.email}</span>
								</a>
							</div>
						</li>
						<li>
							<Link to="/" className="sidenav-close waves-effect">
								Routines
							</Link>
						</li>
						{/* <li>
              <Link to="/progress" className="sidenav-close waves-effect">
                Progress
              </Link>
            </li> */}
						<li>
							<Link to="/stats" className="sidenav-close waves-effect">
								Stats
							</Link>
						</li>
						<li>
							<Link to="/logout" className="btn btn-flat red white-text">
								Logout
							</Link>
						</li>
					</ul>
				) : null}
			</div>
		);
	}
}

export default Navigation;
