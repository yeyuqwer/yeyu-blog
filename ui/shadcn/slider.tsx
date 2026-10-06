"use client"

import { Slider as SliderPrimitive } from "@base-ui/react/slider"
import { cn } from "cn"

function Slider<Value extends number | readonly number[]>({
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: SliderPrimitive.Root.Props<Value>) {
  const sliderValue = value === undefined ? defaultValue : value
  const thumbCount = Array.isArray(sliderValue) ? sliderValue.length : 1

  return (
    <SliderPrimitive.Root
      className={(state) =>
        cn(
          "relative flex w-full items-center data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
          typeof className === "function" ? className(state) : className
        )
      }
      data-slot="slider"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="edge"
      {...props}
    >
      <SliderPrimitive.Control
        data-slot="slider-control"
        className="relative flex min-h-4 w-full touch-none items-center select-none data-disabled:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-4 data-[orientation=vertical]:flex-col"
      >
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative grow overflow-hidden rounded-full bg-muted data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="bg-primary data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
          />
        </SliderPrimitive.Track>
        {Array.from({ length: thumbCount }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            index={index}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            className="block size-4 shrink-0 rounded-full border border-primary bg-white shadow-sm ring-ring/50 transition-[color,box-shadow] after:absolute after:-inset-2 hover:ring-4 has-[:focus-visible]:ring-4 has-[:focus-visible]:outline-hidden data-disabled:pointer-events-none data-disabled:opacity-50"
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export { Slider }
