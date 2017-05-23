import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

export default class Boundary extends PureComponent {
  state = {
    isHovered: false
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (!prevProps.isHighlighting && this.props.isActive) {
      console.debug('componentWillReceiveProps (yes)', this.props.kind)
      this.div.focus()
    } else {
      console.debug('componentWillReceiveProps (no)', this.props.kind)
    }
  }

  handleKnobMouseDown = event => {
    // document.body.style.userSelect = 'none'
    event.stopPropagation()
    event.preventDefault()
    this.props.onHighlightStart(this.props.kind)
  }

  handleFocus = () => {
    console.debug('handleFocus')
  }

  handleBlur = () => {
    console.debug('handleBlur')
  }

  handleMouseEnter = () => {
    this.setState({ isHovered: true })
  }

  handleMouseLeave = () => {
    this.setState({ isHovered: false })
  }

  handleClick = () => {
    console.debug('handleClick')
    this.setState({}, () => {
      if (this.props.isActive) {
        this.div.focus()
      }
    })
    // this.div.focus()
  }

  setDiv = node => {
    this.div = node
  }

  render() {
    const knobClasses = ['Knob']
      .concat(this.state.isHovered ? 'Knob--hover' : [])
      .join(' ')

    return (
      <div
        tabIndex="0"
        ref={this.setDiv}
        className="Boundary"
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
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
          className={`Boundary-caret`}
          style={{
            height: `${this.props.height}px`
          }}
        />
        <div
          className="BoundaryControl"
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          onMouseDown={this.handleKnobMouseDown}
          onClick={this.handleClick}
          style={{
            pointerEvents: this.props.isHighlighting ? 'none' : 'auto',
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
  isActive: PropTypes.bool.isRequired,
  isHighlighting: PropTypes.bool.isRequired,
  onHighlightStart: PropTypes.func.isRequired
}
