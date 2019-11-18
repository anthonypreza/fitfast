import React from "react";

class ExerciseCard extends React.Component {
  render() {
    const buttonStyle = { cursor: "pointer" };

    return (
      <div className="col s12 m4">
        <div
          className={`card medium ${
            this.props.completed ? "teal lighten-3" : ""
          }`}
        >
          {this.props.completed ? (
            <button
              href="#!"
              className="btn-floating halfway-fab waves-effect waves-light red"
              type="submit"
              onClick={() =>
                this.props.toggleComplete(this.props.id, this.props.completed)
              }
              style={buttonStyle}
            >
              <i className="material-icons">clear</i>
            </button>
          ) : (
            <button
              href="#!"
              className="btn-floating halfway-fab waves-effect waves-light green"
              type="submit"
              onClick={() =>
                this.props.toggleComplete(this.props.id, this.props.completed)
              }
              style={buttonStyle}
            >
              <i className="material-icons">check</i>
            </button>
          )}

          <div className="card-content black-text">
            <h3 className="center light">{this.props.exerciseName}</h3>
            {this.props.numReps ? (
              <h4 className="center section">{this.props.numReps} reps</h4>
            ) : null}
            {this.props.exerciseDuration ? (
              <h4 className="center section">
                {this.props.exerciseDuration} s
              </h4>
            ) : null}
          </div>
          <div className="card-action">
            <i
              className="small material-icons red-text"
              onClick={() => {
                this.props.deleteExercise(this.props.id);
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

export default ExerciseCard;
