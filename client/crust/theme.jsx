import {h, Component } from 'preact';
const ThemeWrapper = (ComponentToWrap) => {
  return class ThemeWrapper extends Component {
    render(props, state) {
      const { theme } = this.context
      return (
        <ComponentToWrap {...props} theme={theme} />
      )
    }
  }
}
export default ThemeWrapper