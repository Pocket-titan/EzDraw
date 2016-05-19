let Eraser = {
  draw(drawArgs) {
    let { context, prevMousePosition, newMousePosition, brushWidth } = drawArgs
    context.globalCompositeOperation = 'destination-out'
    let distanceBetween = (point1, point2) => {
      return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
    }

    let angleBetween = (point1, point2) => {
      return Math.atan2( point2.x - point1.x, point2.y - point1.y );
    }

    let dist = distanceBetween(prevMousePosition, newMousePosition);
    let angle = angleBetween(prevMousePosition, newMousePosition);

    for (let i = 0; i < dist; i += 2) {
      let x = prevMousePosition.x + (Math.sin(angle) * i)
      let y = prevMousePosition.y + (Math.cos(angle) * i)

      let radgrad = context.createRadialGradient(x, y, brushWidth * 2, x, y, brushWidth * 3)

      radgrad.addColorStop(0, 'rgba(255,255,255,1)')
      radgrad.addColorStop(1, 'transparent')

      context.fillStyle = radgrad
      context.fillRect(x - (brushWidth * 2), y - (brushWidth * 2), (brushWidth * 4), (brushWidth * 4))
    }
  },
  name: 'TOOL_ERASER',
}

export default Eraser
