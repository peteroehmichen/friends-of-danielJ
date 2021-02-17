import React from "react";
// TODO could set a flexible color on countdown
// TODO could define red after 90% or so
// needs to receive a timestamp in miliseconds to countdown to.
export default class Countdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            remainingSecs: "00",
            remainingMins: "00",
        };
    }

    componentDidMount() {
        this.timerId = setInterval(() => {
            this.tick();
        }, 1000);
    }

    tick() {
        const timeLeft = Math.floor(
            (this.props.deadline - Date.now().valueOf()) / 1000
        );
        let minutesLeft = Math.floor(timeLeft / 60).toString();
        let secondsLeft = Math.floor(timeLeft % 60).toString();
        minutesLeft = minutesLeft.padStart(2, "0");
        secondsLeft = secondsLeft.padStart(2, "0");
        this.setState({
            remainingSecs: secondsLeft,
            remainingMins: minutesLeft,
        });
        if (minutesLeft == "00" && secondsLeft == "00") {
            this.endCountdown();
        }
    }

    endCountdown() {
        clearInterval(this.timerId);
        if (this.props.actionOnEnd) {
            this.props.actionOnEnd();
        }
    }

    componentWillUnmount() {
        this.endCountdown();
    }

    render() {
        return (
            <span
                className={
                    (this.state.remainingMins == "00" && "lowTimer") || ""
                }
            >
                {this.state.remainingMins + ":" + this.state.remainingSecs}
            </span>
        );
    }
}
