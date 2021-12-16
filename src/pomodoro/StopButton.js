import React from "react"

function StopButton({ stopSession, session }) {
    if (session) {
    return (
        <button
          type="button"
          className="btn btn-secondary"
          data-testid="stop"
          title="Stop the session"
          onClick={stopSession}
        >
          <span className="oi oi-media-stop" />
        </button>
    )
    }
    return (
    
    <button
      type="button"
      className="btn btn-secondary"
      data-testid="stop"
      title="Stop the session"
      onClick={stopSession}
      disabled
    >
      <span className="oi oi-media-stop" />
    </button>)
}

export default StopButton;