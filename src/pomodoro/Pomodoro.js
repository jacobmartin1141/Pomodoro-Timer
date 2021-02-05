import React, { useState } from "react";
import classNames from "../utils/class-names";
import useInterval from "../utils/useInterval";
import { secondsToDuration } from '../utils/duration';

function Pomodoro() {
  const initialTimerValues = (60 * 25);
  const initialState = {
    tracker: initialTimerValues,
    focus: initialTimerValues,
    break: (60 * 5),
    duration: initialTimerValues,
    inFocus: true,
    enabled: false,
  }

  // Timer starts out paused
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timer, setTimer] = useState({ ...initialState });

  useInterval(
    () => {
      if(timer.tracker > 1) {
        updateTimer({tracker: (timer.tracker - 1)});

      } else {
        new Audio(`${process.env.PUBLIC_URL}/alarm/submarine-dive-horn.mp3`).play();

        const newDuration = (timer.inFocus ? timer.break : timer.focus);
        updateTimer({inFocus: !timer.inFocus, duration: newDuration, tracker: newDuration});
      }
    },
    isTimerRunning ? 1000 : null
  );

  function updateTimer(newValue) {
    setTimer((prevState) => {return {...prevState, ...newValue}});
  }

  function playPause() {
    setIsTimerRunning((prevState) => !prevState);
  }

  const handlePlayButton = () => {
    playPause();
    if(!timer.enabled) updateTimer({enabled: true, tracker: timer.focus, duration: timer.focus, inFocus: true});
  }
  const handleStopButton = () => {
    if(timer.enabled) {
      setIsTimerRunning(false);
      updateTimer({enabled: false});
    }
  }

  const handleFocusIncrease = () => {
    if(timer.focus < (60 * 60)) {
      updateTimer({focus: (timer.focus + (60 * 5))});
    }
  }
  const handleFocusDecrease = () => {
    if(timer.focus > (60 * 5)) {
      updateTimer({focus: (timer.focus - (60 * 5))});
    }
  }
  const handleBreakIncrease = () => {
    if(timer.break < (60 * 15)) {
      updateTimer({break: (timer.break + (60 * 1))});
    }
  }
  const handleBreakDecrease = () => {
    if(timer.break > (60 * 1)) {
      updateTimer({break: (timer.break - (60 * 1))});
    }
  }

  return (
    <div className="pomodoro">
      <div className="row">
        <div className="col">
          <div className="input-group input-group-lg mb-2">
            <span className="input-group-text" data-testid="duration-focus">
              {/* TODO: Update this text to display the current focus session duration */}
              Focus Duration: {timer.focus < (60 * 60) ? secondsToDuration(timer.focus) : "60:00"}
            </span>
            <div className="input-group-append">
              {/* TODO: Implement decreasing focus duration and disable during a focus or break session */}
              <button
                disabled={timer.enabled}
                type="button"
                className="btn btn-secondary"
                data-testid="decrease-focus"
                onClick={handleFocusDecrease}
              >
                <span className="oi oi-minus" />
              </button>
              {/* TODO: Implement increasing focus duration and disable during a focus or break session */}
              <button
                disabled={timer.enabled}
                type="button"
                className="btn btn-secondary"
                data-testid="increase-focus"
                onClick={handleFocusIncrease}
              >
                <span className="oi oi-plus" />
              </button>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="float-right">
            <div className="input-group input-group-lg mb-2">
              <span className="input-group-text" data-testid="duration-break">
                {/* TODO: Update this text to display the current break session duration */}
                Break Duration: {secondsToDuration(timer.break)}
              </span>
              <div className="input-group-append">
                {/* TODO: Implement decreasing break duration and disable during a focus or break session*/}
                <button
                  disabled={timer.enabled}
                  type="button"
                  className="btn btn-secondary"
                  data-testid="decrease-break"
                  onClick={handleBreakDecrease}
                >
                  <span className="oi oi-minus" />
                </button>
                {/* TODO: Implement increasing break duration and disable during a focus or break session*/}
                <button
                  disabled={timer.enabled}
                  type="button"
                  className="btn btn-secondary"
                  data-testid="increase-break"
                  onClick={handleBreakIncrease}
                >
                  <span className="oi oi-plus" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div
            className="btn-group btn-group-lg mb-2"
            role="group"
            aria-label="Timer controls"
          >
            <button
              type="button"
              className="btn btn-primary"
              data-testid="play-pause"
              title="Start or pause timer"
              onClick={handlePlayButton}
            >
              <span
                className={classNames({
                  oi: true,
                  "oi-media-play": !isTimerRunning,
                  "oi-media-pause": isTimerRunning,
                })}
              />
            </button>
            {/* TODO: Implement stopping the current focus or break session and disable when there is no active session */}
            <button
              disabled={!timer.enabled}
              type="button"
              className="btn btn-secondary"
              title="Stop the session"
              onClick={handleStopButton}
            >
              <span className="oi oi-media-stop" />
            </button>
          </div>
        </div>
      </div>
      <div style={{display: timer.enabled ? "block" : "none"}}>
        {/* TODO: This area should show only when a focus or break session is running or pauses */}
        <div className="row mb-2">
          <div className="col">
            {/* TODO: Update message below to include current session (Focusing or On Break) and total duration */}
            <h2 data-testid="session-title">
              {timer.inFocus ? "Focusing" : "On Break"} for {secondsToDuration(timer.duration)} {(timer.duration < 60) ? "seconds" : "minutes"}
            </h2>
            {/* TODO: Update message below to include time remaining in the current session */}
            <p className="lead" data-testid="session-sub-title">
              {secondsToDuration(timer.tracker)} remaining
            </p>
            <h2>
              {(timer.enabled && (!isTimerRunning)) ? "PAUSED" : null}
            </h2>
          </div>
        </div>
        <div className="row mb-2">
          <div className="col">
            <div className="progress" style={{ height: "20px" }}>
              <div
                className="progress-bar"
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={(100 - ((timer.tracker / timer.duration) * 100))} // TODO: Increase aria-valuenow as elapsed time increases
                style={{ width: (100 - ((timer.tracker / timer.duration) * 100))+"%" }} // TODO: Increase width % as elapsed time increases
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pomodoro;
