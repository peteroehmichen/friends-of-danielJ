import React from "react";

export default class Countdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            codeValidUntil: props.codeValidUntil,
            remainingSecs: "00",
            remainingMins: "10",
        };
    }

    // componentDidMount() {
    //     this.setState({
    //         endOfTime: Date.now() + 1000 * 60 * 10,
    //     });
    //     // this.analyseTime();
    //     // this.timerId = setInterval(() => {
    //     //     // this.tick();
    //     // }, 1000);
    // }

    // console.log("time:", this.state.codeValidUntil);
    // let newDate = new Date(this.state.codeValidUntil);
    // console.log(newDate);
    // newDate = newDate.valueOf() + 1000 * 60 * 10;
    // console.log(newDate);
    // newDate = Math.floor(newDate / 1000);
    // console.log(newDate);
    // }

    // tick() {
    //     const remaining = this.state.endOfTime - Date.now();

    //     this.setState({
    //         remainingSecs: Math.floor(remaining / 1000),
    //         remainingMins: Math.floor(remaining / (1000 * 60),

    //         // remainingSecs: Math.floor(
    //         //     (this.state.endOfTime - Date.now()) / 1000
    //         // ),
    //     });
    // }

    // componentWillUnmount() {
    //     clearInterval(this.timerId);
    // }

    render() {
        return <span>{this.state.codeValidUntil}</span>;
    }
}
