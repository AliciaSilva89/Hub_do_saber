import * as React from "react"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"

import { cn } from "@/lib/utils"

type CalendarProps = React.ComponentPropsWithoutRef<typeof DayPicker>

const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  ({ className, classNames, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("rounded-lg p-2", className)}>
        <DayPicker
          {...props}
          className={cn("rounded-md p-1", classNames?.root)}
          classNames={{
            ...(classNames ?? {})
          }}
        />
      </div>
    )
  }
)
Calendar.displayName = "Calendar"

export { Calendar }
