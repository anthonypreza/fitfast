import React from "react";
import { Redirect } from "react-router-dom";
import M from "materialize-css";
import firebase from "firebase";

import { app, facebookProvider } from "../base";

class Login extends React.Component {
  constructor() {
    super();
    this.authWithFacebook = this.authWithFacebook.bind(this);
    this.authWithEmailPassword = this.authWithEmailPassword.bind(this);
    this.state = {
      redirect: false
    };
  }

  authWithFacebook() {
    console.log("Authenticating with Facebook...");
    app
      .auth()
      .signInWithPopup(facebookProvider)
      .then((user, error) => {
        if (error) {
          M.toast({
            html: "Couldn't login with Facebook...",
            displayLength: 2000
          });
        } else {
          this.props.setCurrentUser(user);
          this.setState({ redirect: true });
        }
      });
  }

  authWithEmailPassword(e) {
    console.log("Authenticating with email...");
    const email = this.emailInput.value;
    const password = this.passwordInput.value;
    app
      .auth()
      .fetchSignInMethodsForEmail(email)
      .then(providers => {
        if (providers.length === 0) {
          // create new user
          console.log("Creating new user");
          return app.auth().createUserWithEmailAndPassword(email, password);
        } else if (providers.indexOf("password") === -1) {
          console.log("Signing in with facebook and linking accounts");
          app.auth().signInWithPopup(facebookProvider);
          const credential = firebase.auth.EmailAuthProvider.credential(
            email,
            password
          );
          firebase
            .auth()
            .currentUser.linkAndRetrieveDataWithCredential(credential)
            .then(usercred =>
              console.log("Account linking success", usercred.user)
            )
            .catch(err => console.log("Account linking error", err));
        } else {
          console.log("Signing in");
          return app.auth().signInWithEmailAndPassword(email, password);
        }
      })
      .then(user => {
        if (user && user.user.email) {
          M.toast({
            html: "Success!",
            displayLength: 2000
          });
          this.props.setCurrentUser(user);
          this.setState({ redirect: true });
        }
      })
      .catch(err => {
        M.toast({
          html: `Error: ${err.message}`,
          displayLength: 2000
        });
      });
  }

  render() {
    const { from } = {
      from: { pathname: "/" }
    };
    const { redirect } = this.state;

    if (redirect) {
      return <Redirect to={from} />;
    }
    return (
      <div className="container">
        <h1 className="center light teal-text text-darken-2">FitFast</h1>
        <h4 className="center section light">
          Get fit faster! Upload and save routines, edit individual exercises,
          track progress, and much more.
        </h4>
        <div className="section center">
          <button className="btn blue" onClick={() => this.authWithFacebook()}>
            Log In with Facebook
          </button>
        </div>
        <div className="row">
          <form
            className="col s12"
            onSubmit={e => {
              e.preventDefault();
              this.authWithEmailPassword(encodeURIComponent);
            }}
            ref={form => {
              this.loginForm = form;
            }}
          >
            <div className="row">
              <div className="col s12">
                <h6>
                  If you don't have an account already, this form will create
                  your account.
                </h6>
              </div>
              <div className="input-field col s12">
                <input
                  className="validate"
                  id="email"
                  type="email"
                  ref={input => {
                    this.emailInput = input;
                  }}
                />
                <label htmlFor="email">Email</label>
              </div>
              <div className="input-field col s12">
                <input
                  className="validate"
                  id="password"
                  type="password"
                  ref={input => {
                    this.passwordInput = input;
                  }}
                />
                <label htmlFor="password">Password</label>
              </div>
              <div className="col s12">
                <button className="btn btn-large green" type="submit">
                  Log in
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
