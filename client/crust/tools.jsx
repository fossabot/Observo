
import classNames from 'classnames'

function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
}
function build(config, props) {
  let localProps = {}
  let classes
  if (config.section && config.component) {
    classes = `crust--${config.section}--${config.component}`
  }
  let style = {}
  if (config.ripple) {
    localProps.onPointerDown = props.onPointerDown
  }
  let type = config.type
  if (props.type) {
    type = props.type
  }
  if (props.theme && config.section && config.component && type) {
    classes = classNames(classes, `${props.theme}`, config.section, config.component, config.type);
  }
  localProps.class = classNames(classes, props.class)
  localProps.style = props.style

  return localProps
}
const Tools = []
Tools.uuidv4 = uuidv4
Tools.build = build
export default Tools