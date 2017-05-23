import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

export default class Boundary extends PureComponent {
  state = {
    isFocused: false,
    isHovered: false
  }

  handleKnobMouseDown = event => {
    // document.body.style.userSelect = 'none'
    event.stopPropagation()
    event.preventDefault()
    this.props.onHighlightStart(this.props.kind)
  }

  handleFocus = () => {
    this.setState({ isFocused: true })
  }

  handleBlur = () => {
    this.setState({ isFocused: false })
  }

  handleMouseEnter = () => {
    this.setState({ isHovered: true })
  }

  handleMouseLeave = () => {
    this.setState({ isHovered: false })
  }

  setDiv = node => {
    this.div = node
  }

  render() {
    const knobClasses = ['Knob']
      .concat(this.state.isFocused ? 'Knob--focus' : [])
      .concat(this.state.isHovered ? 'Knob--hover' : [])
      .join(' ')

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
          className={knobClasses}
          style={{
            top: `${this.props.kind === 'start' ? -9 : this.props.height}px`
          }}
        />
        <div
          className={`Boundary-caret ${this.props.isFocused ? 'Knob--focused' : ''}`}
          style={{
            height: `${this.props.height}px`
          }}
        />
        <div
          className="BoundaryControl"
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          tabIndex="0"
          ref={this.setDiv}
          onMouseDown={this.handleKnobMouseDown}
          style={{
            display: this.props.isHighlighting ? 'none' : 'block',
            position: 'absolute',
            left: `-1px`,
            top: `-1px`,
            height: `${this.props.height}px`
          }}
        />
      </div>
    )
  }
}

Boundary.propTypes = {
  kind: PropTypes.string.isRequired,
  left: PropTypes.number.isRequired,
  top: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  isHighlighting: PropTypes.bool
}
