import React, { Component } from 'react'
import Example from './Example'

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>react-text-selection</h2>
          <p>This is a messy WIP. Stay tuned.</p>
        </div>
        <Example>
          <div
            style={{
              border: '1px solid grey',
              padding: '12px',
              backgroundColor: '#fafafa'
            }}
          >
            <h2>Paragraphs</h2>
            <p>
              Lorem ipsum dolor sit amet, nunc a, ipsum eros ullamcorper, eros nulla vestibulum pellentesque vestibulum morbi interdum, justo id, neque wisi magna lobortis. Aliquam nam arcu sed ac ipsum vitae, ante vel interdum neque nec, sed ac iaculis, urna wisi et dui vulputate imperdiet. Quam facilisi sollicitudin, urna egestas, dignissim placerat dictum voluptas nunc, auctor iaculis elit, purus pede egestas tristique purus fusce. Vitae habitasse suspendisse dictum malesuada a eros, suspendisse quis elit.
            </p>

            <p>
              Enim et, dui urna metus maecenas accumsan rhoncus, odio sed neque gravida, neque amet pellentesque duis, egestas dignissim orci amet vel. In vitae eleifend mollis duis luctus nulla. Condimentum enim excepteur quis mauris eros vivamus, id urna duis, accumsan nec, neque erat in odio neque, urna pretium duis lorem adipiscing sem nec. In eget, sed in non lacinia, augue gravida enim dignissim nulla. Faucibus mattis mauris id posuere, nisi adipiscing ut ac ullamcorper est amet, lacus sed est a netus suspendisse justo, praesent lorem at aliquam.
            </p>
          </div>
        </Example>

        <Example>
          <div
            style={{
              border: '1px solid grey',
              padding: '12px',
              backgroundColor: '#fafafa'
            }}
          >
            <h2>List</h2>
            <ul>
              <li>
                Enim et, dui urna metus maecenas accumsan rhoncus, odio sed neque gravida.
              </li>
              <li>
                Lorem ipsum dolor sit amet, nunc a, ipsum eros ullamcorper, eros nulla. Odio sed neque gravida.
              </li>
              <li>
                Neque gravida, neque amet pellentesque duis, egestas dignissim orci amet vel.
              </li>
            </ul>
          </div>
        </Example>
      </div>
    )
  }
}

export default App
