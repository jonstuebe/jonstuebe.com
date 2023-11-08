import { cacheHeader } from "pretty-cache-header";

type Millisecond = "ms" | "milli" | "millisecond" | "milliseconds";
type Second = "s" | "sec" | "secs" | "second" | "seconds";
type Minute = "m" | "min" | "mins" | "minute" | "minutes";
type Hour = "h" | "hr" | "hrs" | "hour" | "hours";
type Day = "d" | "day" | "days";
type Week = "w" | "week" | "weeks";
type Month = "mon" | "mth" | "mths" | "month" | "months";
type Year = "y" | "yr" | "yrs" | "year" | "years";
type TimeUnit =
  | Year
  | Month
  | Week
  | Day
  | Hour
  | Minute
  | Second
  | Millisecond;
type TimeString = `${number}${TimeUnit}` | `${number} ${TimeUnit}`;

/**
 *
 * @default stale "10mins"
 */
export const createCacheHeader = (
  { stale }: { stale?: TimeString } = { stale: "10mins" }
): Headers | HeadersInit => ({
  "Cache-Control": cacheHeader({
    public: true,
    maxAge: stale,
    staleWhileRevalidate: stale,
  }),
});
