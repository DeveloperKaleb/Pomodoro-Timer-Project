import React, { useState } from "react";
import classNames from "../utils/class-names";
import useInterval from "../utils/useInterval";
import SessionView from "./SessionView"
import StopButton from "./StopButton"

// These functions are defined outside of the component to ensure they do not have access to state
// and are, therefore, more likely to be pure.

/**
 * Update the session state with new state after each tick of the interval.
 * @param prevState
 *  the previous session state
 * @returns
 *  new session state with timing information updated.
 */
function nextTick(prevState) {
  const timeRemaining = Math.max(0, prevState.timeRemaining - 1);
  return {
    ...prevState,
    timeRemaining,
  };
}

/**
 * Higher-order function that returns a function to update the session state with the next session type upon timeout.
 * @param focusDuration
 *    the current focus duration
 * @param breakDuration
 *    the current break duration
 * @returns
 *  function to update the session state.
 */
function nextSession(focusDuration, breakDuration) {
  /**
   * State function to transition the current session type to the next session. e.g. On Break -> Focusing or Focusing -> On Break
   */
  return (currentSession) => {
    if (currentSession.label === "Focusing") {
      return {
        label: "On Break",
        timeRemaining: breakDuration * 60,
      };
    }
    return {
      label: "Focusing",
      timeRemaining: focusDuration * 60,
    };
  };
}

function Pomodoro() {
  // Timer starts out paused
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  // The current session - null where there is no session running
  const [session, setSession] = useState(null);

  // State declarations and functions for focus duration adjustment
  const [focusDuration, setFocusDuration] = useState(25);
  const focusDurationIncreaseHandler = () => {
    if (focusDuration < 60) {
      setFocusDuration((prevDuration) => prevDuration + 5)
    }
  }
  const focusDurationDecreaseHandler = () => {   
    if (focusDuration > 5) {
      setFocusDuration((prevDuration) => prevDuration - 5)
    }
  }
  // State declarations and functions for break duration adjustment
  const [breakDuration, setBreakDuration] = useState(5);
  const breakDurationIncreaseHandler = () => {
    if (breakDuration < 15) {
      setBreakDuration((prevDuration) => prevDuration + 1)
    }
  }
  const breakDurationDecreaseHandler = () => {   
    if (breakDuration > 1) {
      setBreakDuration((prevDuration) => prevDuration - 1)
    }
  }
  // Formatting code for focus and break duration display
  let breakView = "";
  if (breakDuration < 10) { 
    breakView = ["0", breakDuration].slice(-2) 
  } else {
    breakView = breakDuration
  }
  let focusView = "";
  if (focusDuration < 10) { 
    focusView = ["0", focusDuration].slice(-2) 
  } else {
    focusView = focusDuration
  }
  /**
   * Custom hook that invokes the callback function every second
   *
   * NOTE: You won't need to make changes to the callback function
   */
  useInterval(() => {
      if (session.timeRemaining === 0) {
        new Audio("https://bigsoundbank.com/UPLOAD/mp3/1482.mp3").play();
        console.log("We finished.")
        return setSession(nextSession(focusDuration, breakDuration));
      }
      console.log(1)
      return setSession(nextTick);
    },
    isTimerRunning ? 1000 : null
  );

  /**
   * Called whenever the play/pause button is clicked.
   */
  function playPause() {
    setIsTimerRunning((prevState) => {
      const nextState = !prevState;
      if (nextState) {
        console.log(2)
        setSession((prevStateSession) => {
          // If the timer is starting and the previous session is null,
          // start a focusing session.
          if (prevStateSession === null) {
            return {
              label: "Focusing",
              timeRemaining: focusDuration * 60,
            };
          }
          return prevStateSession;
        });
      }
      return nextState;
    });
  }

  function stopSession() {
    setSession(null)
    setIsTimerRunning(false)
  }

    
  return (
    <div className="pomodoro">
      <div className="row">
        <div className="col">
          <div className="input-group input-group-lg mb-2">
            <span className="input-group-text" data-testid="duration-focus">
              Focus Duration: {focusView}:00
            </span>
            <div className="input-group-append">
              <button
                type="button"
                className="btn btn-secondary"
                data-testid="decrease-focus"
                onClick={focusDurationDecreaseHandler}
              >
                <span className="oi oi-minus" />
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                data-testid="increase-focus"
                onClick={focusDurationIncreaseHandler}
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
                Break Duration: {breakView}:00
              </span>
              <div className="input-group-append">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-testid="decrease-break"
                  onClick={breakDurationDecreaseHandler}
                >
                  <span className="oi oi-minus" />
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-testid="increase-break"
                  onClick={breakDurationIncreaseHandler}
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
              onClick={playPause}
            >
              <span
                className={classNames({
                  oi: true,
                  "oi-media-play": !isTimerRunning,
                  "oi-media-pause": isTimerRunning,
                })}
              />
            </button>
            {/* TODO: Implement stopping the current focus or break session. and disable the stop button when there is no active session */}
            {/* TODO: Disable the stop button when there is no active session */}
            <StopButton session={session} stopSession={stopSession}/>
          </div>
        </div>
      </div>
      <SessionView session={session} focusDuration={focusDuration} breakView={breakView} focusView={focusView} breakDuration={breakDuration} />
    </div>
  );
}

export default Pomodoro;
