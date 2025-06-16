interface ChartLegendProps {
  items: Array<{
    color: string
    label: string
  }>
}

export function ChartLegend({ items }: ChartLegendProps) {
  return (
    <div className="flex items-center space-x-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-1">
          <div className={`w-2 h-2 ${item.color} rounded-full`}></div>
          <span className="text-xs text-gray-600">{item.label}</span>
        </div>
      ))}
    </div>
  )
}
