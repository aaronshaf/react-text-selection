import React, { Component } from 'react'

export default class Caret extends Component {
  render() {
    return (
      <div
        className={`Caret ${this.props.isVisible ? 'Caret--visible' : ''} ${this.props.isDragging ? 'Caret--dragging' : ''}`}
        style={{
          position: this.props.isDragging ? 'fixed' : 'absolute',
          left: `${this.props.left}px`,
          top: `${this.props.top}px`,
          height: `${this.props.height}px`
        }}
      />
    )
  }
}
