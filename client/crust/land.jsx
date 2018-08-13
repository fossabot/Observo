import { h, render, Component } from 'preact';
export default class LandProvider extends Component {
  constructor() {
    super()
  }
  getChildContext() {
   const { theme } = this.props
   return { theme }
  }
  render(props, state) {
    return( <div class="crust--land"> {props.children} </div>)
  }
}