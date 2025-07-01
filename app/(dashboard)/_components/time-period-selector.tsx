"use client"

interface TimePeriodSelectorProps {
  selectedPeriod:  "Week" | "Month" | "Year"
  onPeriodChange: (period: "Week" | "Month" | "Year") => void
}

export function TimePeriodSelector({ selectedPeriod, onPeriodChange }: TimePeriodSelectorProps) {
  const periods: Array< "Week" | "Month" | "Year"> = [ "Week", "Month", "Year"]

  return (
    <div className="flex space-x-1">
      {periods.map((period) => (
        <button
          key={period}
          onClick={() => onPeriodChange(period)}
          className={`px-3 py-1 text-xs rounded ${
            selectedPeriod === period ? "bg-green-500 text-white" : "bg-gray-100"
          }`}
        >
          {period}
        </button>
      ))}
    </div>
  )
}
