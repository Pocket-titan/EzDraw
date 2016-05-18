let Pencil = {
  draw(drawArgs) {
    let { context, points, brushColor, brushWidth } = drawArgs
    context.beginPath()
    context.globalCompositeOperation = 'source-over'
    context.strokeStyle = brushColor
    context.lineWidth = brushWidth
    context.lineJoin = context.lineCap = 'round'
    context.moveTo(points[0].x, points[0].y)
    for (var i = 1; i < points.length; i++) {
      context.lineTo(points[i].x, points[i].y)
    }
    context.stroke()
  },
  name: 'TOOL_PENCIL',
}

export default Pencil
