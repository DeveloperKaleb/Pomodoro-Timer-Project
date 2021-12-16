import React from "react"


function ProgressBarDisplay({ breakDuration, focusDuration, session }) {
  
  let totalTime = focusDuration * 60  
  if (session.label !== "Focusing") { totalTime = breakDuration * 60}
  const timeRemaining = session.timeRemaining
  let percent = 100 - ((timeRemaining / totalTime) * 100)
  const widthStyle = { "width": `${percent}%`}

  return (
    <div className="row mb-2">
      <div className="col">
        <div className="progress" style={{ height: "20px" }}>
          <div
            className="progress-bar"
            role="progressbar"
            aria-valuemin="0" 
            aria-valuemax="100"
            aria-valuenow={percent}
            style={widthStyle}
          />
        </div>
      </div>
    </div>
  )
}

export default ProgressBarDisplay;