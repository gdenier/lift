"use client"

import { ReactElement, useMemo } from "react"
import { ProfileWeight } from "~/lib/db/schema"
import { ResponsiveStream } from "@nivo/stream"
import { linearGradientDef } from "@nivo/core"
import { formatWeight } from "~/lib/utils"

const defaultData = [
  { value: 0, date: "1" },
  { value: 0, date: "2" },
  { value: 0, date: "3" },
  { value: 0, date: "4" },
  { value: 0, date: "5" },
  { value: 0, date: "6" },
  { value: 0, date: "7" },
  { value: 0, date: "8" },
  { value: 0, date: "9" },
  { value: 0, date: "10" },
  { value: 0, date: "11" },
  { value: 0, date: "12" },
  { value: 0, date: "13" },
  { value: 0, date: "14" },
  { value: 0, date: "15" },
  { value: 0, date: "16" },
  { value: 0, date: "17" },
  { value: 0, date: "18" },
  { value: 0, date: "19" },
  { value: 0, date: "20" },
  { value: 0, date: "21" },
  { value: 0, date: "22" },
  { value: 0, date: "23" },
  { value: 0, date: "24" },
  { value: 0, date: "25" },
]

export const WeightChart = ({
  data,
}: {
  data: ProfileWeight[]
}): ReactElement => {
  const parsedData = useMemo(() => {
    const parsedData = data.map((weight) => ({
      ...weight,
      date: weight.date.toLocaleString(),
    }))
    if (parsedData.length < 25) {
      parsedData.unshift(
        ...(defaultData.slice(
          0,
          25 - parsedData.length
        ) as (typeof parsedData)[number][])
      )
    }
    return parsedData
  }, [data])

  const ticks = 

  return (
    <ResponsiveStream
      data={parsedData}
      keys={["value"]}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "",
        legendOffset: 36,
        format: (values) => {
          const data = parsedData[values]
          if(data.value === 0) return ""
          const date = new Date(data.date)
          
          return ""
        },
      }}
      axisLeft={null}
      enableGridX={false}
      enableGridY={false}
      offsetType="diverging"
      margin={{ top: 50, bottom: 20 }}
      curve="natural"
      label={() => "poids"}
      valueFormat={(value: number) =>
        value ? (formatWeight(value) as string) : "-"
      }
      defs={[
        // using helpers
        // will inherit colors from current element
        linearGradientDef("gradientA", [
          { offset: 0, color: "var(--primary)" },
          { offset: 90, color: "var(--primary)", opacity: 0 },
        ]),
      ]}
      fill={[
        // match using object query
        { match: { id: "value" }, id: "gradientA" },
      ]}
      stackTooltip={({ slice }) => (
        <div className="bg-background p-2 text-foreground shadow">
          {slice.stack[0]?.value > 0 ? (
            <>
              <p>{formatWeight(slice.stack[0]?.value)}</p>
              <p>{parsedData[slice.index].date}</p>
            </>
          ) : (
            <p>Pas de données</p>
          )}
        </div>
      )}
    />
  )
}
