import React from "react"
import ProgressBarDisplay from "./ProgressBarDisplay"


function SessionView({ session, focusDuration, breakView, focusView, breakDuration }) {
  if (session) {
  const seconds = session.timeRemaining % 60
  let formattedSecs = ""
  if (seconds < 10) { formattedSecs = (["0", seconds].slice(-2)).join("") } else { formattedSecs = seconds }
  const minutesSeconds = Math.floor(session.timeRemaining / 60) + ":" + formattedSecs 
  return (
  <div>
    <div className="row mb-2">
      <div className="col">
        {/* TODO: Update message below to include current session (Focusing or On Break) total duration */}
        <h2 data-testid="session-title">
          {session.label} for {session.label === "Focusing" ? focusView : breakView }:00 minutes
        </h2>
        {/* TODO: Update message below correctly format the time remaining in the current session */}
        <p className="lead" data-testid="session-sub-title">
          {minutesSeconds} remaining
        </p>
      </div>
    </div>
    <ProgressBarDisplay session={session} focusDuration={focusDuration} breakDuration={breakDuration}/>
  </div>
  )
  } else {
    return null
  }
}

export default SessionView;
