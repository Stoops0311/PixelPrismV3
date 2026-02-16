function SquareDot(props: any) {
  const { cx, cy, stroke, size = 6 } = props
  if (!cx || !cy) return null
  const half = size / 2
  return (
    <rect
      x={cx - half}
      y={cy - half}
      width={size}
      height={size}
      fill={stroke}
      stroke={stroke}
      strokeWidth={1}
    />
  )
}

function InvertBar(props: any) {
  const { x, y, width, height, fill, isHovered } = props
  if (isHovered) {
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill="transparent"
          stroke={fill}
          strokeWidth={2}
        />
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill="transparent"
          style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
        />
      </g>
    )
  }
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={fill}
      style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
    />
  )
}

export { SquareDot, InvertBar }
