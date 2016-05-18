let Eraser = {
  draw(drawArgs) {
    let { context, points, brushWidth } = drawArgs
    context.beginPath()
    context.globalCompositeOperation = 'destination-out'
    context.lineWidth = brushWidth * 3
    context.lineJoin = context.lineCap = 'round'
    context.moveTo(points[0].x, points[0].y)
    for (var i = 1; i < points.length; i++) {
      context.lineTo(points[i].x, points[i].y)
    }
    context.stroke()
  },
  name: 'TOOL_ERASER',
}

export default Eraser
