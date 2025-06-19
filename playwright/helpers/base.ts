import { DateIntervals } from '@gt-types/dates.ts';
import { DateTime } from 'luxon';

export function getDatesDifference(): { [key in DateIntervals]: number } {
  return {
    [DateIntervals.FUTURE]: 2,
    [DateIntervals.FUTURE_YEAR_AND_MONTH]: 395,
  };
}

export function getDateWithFormat(date: string, format: string): string {
  return DateTime.now().setZone('Atlantic/Reykjavik').plus({ day: getDatesDifference()[date] }).toFormat(format);
}
