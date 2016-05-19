let Pencil = {
  draw(drawArgs) {
    let { context, prevMousePosition, newMousePosition, brushColor, brushWidth } = drawArgs
    context.globalCompositeOperation = 'source-over'
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

      let radgrad = context.createRadialGradient(x, y, brushWidth, x, y, brushWidth * 2)

      let hexToRGB = hex => {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        } : null
      }
      let rgb = hexToRGB(brushColor)
      radgrad.addColorStop(0, brushColor)
      radgrad.addColorStop(0.5, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`)
      radgrad.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`)

      context.fillStyle = radgrad
      context.fillRect(x - (brushWidth * 2), y - (brushWidth * 2), (brushWidth * 4), (brushWidth * 4))
    }
  },
  name: 'TOOL_PENCIL',
}

export default Pencil
