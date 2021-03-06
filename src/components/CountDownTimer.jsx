import React, { Component } from "react";
import "../styles/CountDownTimerStyles.css";
class CountDownTimer extends Component {
  state = {
    days: "XX",
    hours: "XX",
    minutes: "XX",
    seconds: "XX",
  };
  render() {
    const { days, hours, minutes, seconds } = this.state;
    return (
      <div className="countDownContainer">
        <div className="clock-column">
          <p className="clock-timer">{days}</p>
          <p className="clock-label">Days</p>
        </div>

        <div className="clock-column">
          <p className="clock-timer">{hours}</p>
          <p className="clock-label">Hours</p>
        </div>

        <div className="clock-column">
          <p className="clock-timer">{minutes}</p>
          <p className="clock-label">Minutes</p>
        </div>

        <div className="clock-column">
          <p className="clock-timer">{seconds}</p>
          <p className="clock-label">Seconds</p>
        </div>
      </div>
    );
  }
  componentDidMount() {
    // 1) Get the eventTime from props and convert to milliseconds
    let { eventTime, eventName, eventID } = this.props;
    eventTime = new Date(this.props.eventTime).getTime();
    //2) Check if it is a future time, else shown it as completed
    if (this.isFutureTime(eventTime)) {
      // 3) Calculate the time left and store them
      let {
        daysLeft,
        hoursLeft,
        minutesLeft,
        secondsLeft,
      } = this.calculateTimeLeft(eventTime);
      // 4) setInterval runs every 1sec
      this.interval = setInterval(() => {
        const days = daysLeft;
        const hours = hoursLeft;
        const minutes = minutesLeft;
        const seconds = secondsLeft;
        // 5) Set the state for every second with updated values
        this.setState({ days, hours, minutes, seconds });
        if (secondsLeft > 0) {
          secondsLeft--;
        } else if (minutesLeft > 0) {
          minutesLeft--;
          secondsLeft = 59;
        } else if (hoursLeft > 0) {
          hoursLeft--;
          minutesLeft = 59;
          secondsLeft = 59;
        } else if (daysLeft > 0) {
          daysLeft--;
          hoursLeft = 23;
          minutesLeft = 59;
          secondsLeft = 59;
        } else {
          clearInterval(this.interval);
          this.eventComplete(eventID, eventName); //ETA reached
        }
      }, 1000);
    } else {
      this.eventComplete(eventID, eventName); //ETA reached
    }
  }
  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
  isFutureTime = (eventTime) => {
    const currentTime = new Date(Date.now()).getTime(); //Get currentDateTime in milliseconds
    eventTime = new Date(eventTime).getTime(); //Convert event date to milliseconds
    //If eventTime is greater than currentTime then Event is not yet expired
    return eventTime > currentTime; //Returns true if eventTime is greater than current Time
  };
  calculateTimeLeft = (eventTime) => {
    const currentTime = new Date(Date.now()).getTime(); //Convert currentDateTime to milliseconds

    let Difference_In_Time = eventTime - currentTime;

    Difference_In_Time = Math.floor(Difference_In_Time / 1000); //Divide by 1 Second(1000 milliseconds)
    let daysLeft = Math.floor(Difference_In_Time / 86400); //Divide by 60 Seconds(1 minute),60 Minutes (1 hour),24 Hours (1 day)

    Difference_In_Time -= daysLeft * 86400;
    let hoursLeft = Math.floor(Difference_In_Time / 3600); //Divide by 60 Seconds(1 minute),60 Minutes (1 hour)

    Difference_In_Time -= hoursLeft * 3600;
    let minutesLeft = Math.floor(Difference_In_Time / 60); //Divide by 60 Minutes (1 hour)

    Difference_In_Time -= minutesLeft * 60;
    let secondsLeft = Difference_In_Time; //We will have few seconds left

    return {
      daysLeft,
      hoursLeft,
      minutesLeft,
      secondsLeft,
    };
  };
  eventComplete = (id, eventName) => {
    //Event ETA is complete, so change the timerBox styling
    document
      .getElementById("Event" + id)
      .setAttribute("class", "timerBoxETAFinish");
    this.setState({ days: "D", hours: "O", minutes: "N", seconds: "E" });

    this.triggerNotification(eventName);
  };
  triggerNotification = (eventName) => {
    if (Notification.permission === "granted") {
      navigator.serviceWorker.getRegistration().then(function (reg) {
        var options = {
          body: 'HEY! Your task "' + eventName + '" is now overdue.',
          image: "images/notificationIcon.png",
          vibrate: [100, 50, 100],
          data: {
            dateOfArrival: Date.now(),
            primaryKey: 1,
          },
        };
        reg.showNotification(eventName + " Complete", options);
      });
    }
  };
}

export default CountDownTimer;
