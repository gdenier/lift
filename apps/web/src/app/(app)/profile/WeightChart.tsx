"use client"

import { ReactElement, useMemo } from "react"
import { ResponsiveLine } from "@nivo/line"
import { ProfileWeight } from "~/lib/db/schema"
import { formatWeight } from "~/lib/utils"
import { timeFormat } from "d3-time-format"
import { scaleTime } from "d3-scale"
import { linearGradientDef } from "@nivo/core"

export const WeightChart = ({
  data,
}: {
  data: ProfileWeight[]
}): ReactElement => {
  const parsedData = useMemo(() => {
    const parsedData =
      data.map((weight) => ({
        y: weight.value,
        x: weight.date.toLocaleString(),
      })) ?? []
    return { id: "weight", color: "var(--primary)", data: parsedData }
  }, [data])

  const min = parsedData.data.reduce(
    (min, parsed) => (parsed.y < min ? parsed.y : min),
    parsedData.data[0]?.y ?? 0
  )
  const max = parsedData.data.reduce(
    (max, parsed) => (parsed.y > max ? parsed.y : max),
    parsedData.data[0]?.y ?? 0
  )

  const format = (value: Date) =>
    new Intl.DateTimeFormat("fr-fr", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(value)

  const timeScaleTicks: string[] = useMemo(() => {
    const scale = scaleTime().domain([
      new Date(parsedData.data[0]?.x),
      new Date(parsedData.data[parsedData.data.length - 1]?.x),
    ])
    const ticks = scale.ticks(10)
    return ticks.map((tick) => format(tick))
  }, [parsedData.data])

  return (
    <ResponsiveLine
      data={[parsedData]}
      margin={{ top: 30, right: 50, bottom: 30, left: 50 }}
      yScale={{
        type: "linear",
        min: min - 10000,
        max: max + 1000,
      }}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        format: (val) => {
          return timeScaleTicks.includes(format(new Date(val)))
            ? format(new Date(val))
            : ""
        },
      }}
      axisLeft={null}
      enableGridY={false}
      enableGridX={false}
      pointSize={12}
      pointColor="var(--primary)"
      enablePointLabel
      pointLabel={(point) => formatWeight(point.yFormatted as number) as string}
      useMesh={true}
      tooltip={({ point }) => (
        <div className="z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
          <p>{formatWeight(point.data.y.valueOf() as number)}</p>
          <p>{format(new Date(point.data.x))}</p>
        </div>
      )}
      curve="catmullRom"
      colors={{
        datum: "var(--primary)",
        size: 2,
      }}
      enableArea
      areaBaselineValue={min - 10000}
      defs={[
        // using helpers
        // will inherit colors from current element
        linearGradientDef("gradientA", [
          { offset: 0, color: "var(--primary)" },
          { offset: 40, color: "var(--primary)" },
          { offset: 100, color: "var(--primary)", opacity: 0 },
        ]),
      ]}
      fill={[
        // match using object query
        { match: { id: "weight" }, id: "gradientA" },
      ]}
    />
  )
}
