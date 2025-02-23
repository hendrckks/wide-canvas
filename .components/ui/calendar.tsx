import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "../../.lib/utils"
import { buttonVariants } from "./button"

interface CalendarProps {
  className?: string
  classNames?: Record<string, string>
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  mode?: "single"
  showOutsideDays?: boolean
}

function Calendar({
  className,
  classNames = {},
  selected,
  onSelect,
  showOutsideDays = true,
}: CalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(selected || new Date())
  const [viewDate, setViewDate] = React.useState(new Date(currentDate))

  const daysInMonth = new Date(
    viewDate.getFullYear(),
    viewDate.getMonth() + 1,
    0
  ).getDate()

  const firstDayOfMonth = new Date(
    viewDate.getFullYear(),
    viewDate.getMonth(),
    1
  ).getDay()

  const prevMonthDays = showOutsideDays
    ? Array.from({ length: firstDayOfMonth }, (_, i) => {
        const day = new Date(
          viewDate.getFullYear(),
          viewDate.getMonth(),
          0 - i
        )
        return day
      }).reverse()
    : []

  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => {
    return new Date(viewDate.getFullYear(), viewDate.getMonth(), i + 1)
  })

  const nextMonthDays = showOutsideDays
    ? Array.from(
        { length: 42 - (prevMonthDays.length + currentMonthDays.length) },
        (_, i) => {
          return new Date(
            viewDate.getFullYear(),
            viewDate.getMonth() + 1,
            i + 1
          )
        }
      )
    : []

  const allDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays]

  const weeks = Array.from({ length: Math.ceil(allDays.length / 7) }, (_, i) =>
    allDays.slice(i * 7, (i + 1) * 7)
  )

  const handlePrevMonth = () => {
    setViewDate(
      new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1)
    )
  }

  const handleNextMonth = () => {
    setViewDate(
      new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1)
    )
  }

  const handleDateSelect = (date: Date) => {
    if (onSelect) {
      onSelect(date)
    }
    setCurrentDate(date)
  }

  const isSelected = (date: Date) =>
    selected?.toDateString() === date.toDateString()

  const isToday = (date: Date) =>
    new Date().toDateString() === date.toDateString()

  const isOutsideMonth = (date: Date) =>
    date.getMonth() !== viewDate.getMonth()

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className={cn("p-3", className)}>
      <div className={cn("space-y-4", classNames.months)}>
        <div className={cn("relative flex justify-center pt-1", classNames.caption)}>
          <div className={cn("text-sm font-medium", classNames.caption_label)}>
            {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
          </div>
          <div className={cn("flex items-center gap-1", classNames.nav)}>
            <button
              onClick={handlePrevMonth}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "size-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                "absolute left-1",
                classNames.nav_button,
                classNames.nav_button_previous
              )}
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "size-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                "absolute right-1",
                classNames.nav_button,
                classNames.nav_button_next
              )}
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
        <div className={cn("w-full", classNames.month)}>
          <div className={cn("flex", classNames.head_row)}>
            {dayNames.map((day) => (
              <div
                key={day}
                className={cn(
                  "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
                  classNames.head_cell
                )}
              >
                {day}
              </div>
            ))}
          </div>
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className={cn("flex w-full mt-2", classNames.row)}>
              {week.map((date, dateIndex) => {
                const isDisabled = false // Add your disable logic here
                return (
                  <div
                    key={dateIndex}
                    className={cn(
                      "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                      isSelected(date) && "bg-accent",
                      classNames.cell
                    )}
                  >
                    <button
                      onClick={() => handleDateSelect(date)}
                      disabled={isDisabled}
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "size-8 p-0 font-normal",
                        isSelected(date) &&
                          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                        isToday(date) && "bg-accent text-accent-foreground",
                        isOutsideMonth(date) &&
                          "text-muted-foreground",
                        isDisabled && "text-muted-foreground opacity-50",
                        classNames.day
                      )}
                    >
                      {date.getDate()}
                    </button>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export { Calendar }
