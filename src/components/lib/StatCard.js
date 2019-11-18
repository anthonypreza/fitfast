import React from "react";

class StatCard extends React.Component {
  render() {
    const title = this.props.title;
    const stat = this.props.stat;

    return (
      <div className="col s12 m4">
        <div className="card small">
          <div className="card-content black-text">
            <h3 className="center light card-title">{title}</h3>
            <h1 className="center teal-text text-darken-2">{stat}</h1>
          </div>
        </div>
      </div>
    );
  }
}

export default StatCard;
