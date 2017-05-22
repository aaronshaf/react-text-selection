import React, { Component } from 'react'

export default class Knob extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isDragging: false,
      clientX: null,
      clientY: null
    }
  }
  handleKnobMouseDown = event => {
    event.stopPropagation()
    event.preventDefault()
    this.setState(
      {
        isDragging: true,
        clientX: event.clientX,
        clientY: event.clientY
      },
      () => {
        // console.debug('handleKnobMouseDown')
        document.addEventListener('mousemove', this.handleKnobMouseMove)
        document.addEventListener('mouseup', this.handleKnobMouseUp)
      }
    )
    // this.props.onMouseDown()
  }

  handleKnobMouseMove = event => {
    event.stopPropagation()
    if (!this.state.isDragging) {
      return
    }
    // console.debug(range)
    // const textNode = range.startContainer
    // offset = range.startOffset
    this.setState(
      {
        clientX: event.clientX,
        clientY: event.clientY
      },
      () => {
        const range = document.caretRangeFromPoint(
          event.clientX,
          event.clientY + 8
        )
        // console.debug(range)
        if (this.props) {
          this.props.onMove(range)
        }
      }
    )
  }

  handleKnobMouseUp = () => {
    this.setState({ isDragging: false })
    // this.props.onMouseUp()
    document.removeEventListener('mouseup', this.handleKnobMouseUp)
    document.removeEventListener('mousemove', this.handleKnobMouseMove)
  }

  handleKeyPress = event => {
    switch (event.key) {
      case 'ArrowLeft':
        break
      case 'ArrowRight':
        break
      default:
        return
    }
  }

  render() {
    return (
      <div
        onKeyDown={this.handleKeyPress}
        tabIndex="0"
        className={`Knob ${this.props.isVisible ? 'Knob--visible' : ''} ${this.props.isDragging ? 'Knob--dragging' : ''}`}
        style={{
          position: this.state.isDragging ? 'fixed' : 'absolute',
          left: `${this.state.isDragging ? this.state.clientX - 4 : this.props.left - 4}px`,
          top: `${this.state.isDragging ? this.state.clientY - 8 : this.props.top - 8}px`
        }}
        onMouseDown={this.handleKnobMouseDown}
      />
    )
  }
}
