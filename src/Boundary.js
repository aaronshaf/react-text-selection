import React, { PureComponent } from 'react'

export default class Boundary extends PureComponent {
  render() {
    return (
      <div
        className="Boundary"
        style={{
          left: `${this.props.left}px`,
          top: `${this.props.top}px`,
          height: `${this.props.height}px`
        }}
      >
        <div
          className="Knob"
          style={{ top: `${this.props.kind === 'start' ? -9 : this.props.height}px` }}
        />
        <div
          className={`Boundary-caret ${this.props.isHighlighting ? 'Boundary-caret--dragging' : ''}`}
          style={{
            height: `${this.props.height}px`
          }}
        />
      </div>
    )
  }
}
