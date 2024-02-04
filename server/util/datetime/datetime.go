// Format_ will return string
// Trans_ will return time.Time
package datetime

import (
	"fmt"
	"log"
	"strconv"
	"strings"
	"time"
	_ "time/tzdata"
)

var (
	// 20060102
	YYYYMMDD = Format("yyyymmdd")

	// 2006-01-02
	YYYY_MM_DD = Format("yyyy-mm-dd")

	HHMM     = Format("HHmm")     // 1504
	HHMMSS   = Format("hhmmss")   // 150405
	HH_MM    = Format("hh:mm")    // 15:04
	HH_MM_SS = Format("hh:mm:ss") // 15:04:05

	// Datetime
	FULL_PLAIN = Format("yyyymmddhhmmss")
	FULL_CLEAR = Format("yyyy-mm-dd hh:mm:ss")
)

// Convert time.Time to string
func Time2Str(t time.Time, f Format) string {
	// Convert to full plain
	plain := t.Format("20060102150405")
	if len(plain) < 14 {
		return ""
	}

	switch f {
	case YYYYMMDD:
		return plain[0:8]

	case YYYY_MM_DD:
		return plain[0:4] + "-" + plain[5:6] + "-" + plain[7:8]

	case HHMM:
		return plain[8:10] + plain[10:12]

	case HHMMSS:
		return plain[8:]

	case HH_MM_SS:
		return plain[8:10] + ":" + plain[10:12] + ":" + plain[12:14]

	case HH_MM:
		return plain[8:10] + ":" + plain[10:12]

	default:
		return plain
	}
}

func Str2Time(t string) (time.Time, error) {
	if len(t) == 5 {
		return time.Parse("15:04:00", t)
	} else if len(t) == 8 {
		return time.Parse("15:04:05", t)
	} else {
		return time.Now(), fmt.Errorf("Bad format: " + t)
	}
}

func StrDateToTime(yyyymmdd string) (time.Time, error) {
	return time.Parse("20060102", yyyymmdd)
}

// Today returns today date string
func Today(f Format) string {
	return Time2Str(time.Now(), f)
}

// Now returns now datetime string
func Now(f Format) string {
	return Time2Str(time.Now(), f)
}

// ThisWeek returns the days of the current week with Monday as the first day
func ThisWeekdays() []string {
	var result []string
	t := time.Now()

	// Calculate the start of the current week
	weekday := int(t.Weekday())
	for startOfWeek := 1; weekday > startOfWeek; weekday-- {
		t = t.AddDate(0, 0, -1)
	}

	for i := 0; i < 7; i++ {
		day := t.AddDate(0, 0, i)
		result = append(result, day.Format("20060102"))
	}
	return result
}

func Weekdays(date string) []string {
	var result []string
	t, _ := StrDateToTime(date)

	// Calculate the start of the current week
	weekday := int(t.Weekday())
	for startOfWeek := 1; weekday > startOfWeek; weekday-- {
		t = t.AddDate(0, 0, -1)
	}

	for i := 0; i < 7; i++ {
		day := t.AddDate(0, 0, i)
		result = append(result, day.Format("20060102"))
	}
	return result
}

// Transform UTC time to Tokyo time
func UtcTime2TokyoTime(utc time.Time) time.Time {
	loc, err := time.LoadLocation("Asia/Tokyo")
	if err != nil {
		log.Println(err)
	}
	return utc.In(loc)
}

// Format UTC time to Tokyo time string
func UtcTime2Str(utc time.Time, f Format) string {
	return Time2Str(UtcTime2TokyoTime(utc), f)
}

// 15:04 → 1504
func ClearTime2Plain(t string) (string, error) {
	t = strings.Replace(t, ":", "", -1)

	if len(t) != 4 {
		return "", fmt.Errorf("Bad input: " + t)
	}

	if _, err := strconv.Atoi(t); err == nil {
		return "", fmt.Errorf("Bad input: " + t)
	}

	return t, nil
}

// 01/02/2006
func ClearDate2Plain(t string) (string, error) {
	var pattern = "ymd"
	if t[2:3] == "/" || t[2:3] == "-" {
		pattern = "mdy"
	}

	t = strings.Replace(t, "-", "", -1)
	t = strings.Replace(t, "/", "", -1)

	if len(t) != 8 {
		return "", fmt.Errorf("Bad input: " + t)
	}

	if pattern == "mdy" {
		return t[4:] + t[:4], nil
	}
	return t, nil
}

// Format plain time to clear time
// 1504 → 15:04
// 150405 → 15:04:05
func PlainTime2Clear(t string, f Format) string {
	switch f {
	case HHMM:
		if len(t) < 4 {
			return t
		} else {
			return t[0:2] + ":" + t[2:4]
		}

	case HHMMSS:
		if len(t) < 6 {
			return t
		} else {
			return t[0:2] + ":" + t[2:4] + ":" + t[4:6]
		}

	default:
		return t
	}
}

// Format clear time to plain time
// 15:04:05 → 150405
func FormatClearTime(t string) string {
	return strings.Replace(t, ":", "", -1)
}

// Transform Dayjs to time.Time
func Dayjs2Time(dayjs string) time.Time {
	// 2023-01-22T10:27:18.084Z

	// 2023-01-22T10:27:18
	sub := dayjs[0:19]

	// 2023-01-22 10:27:18
	sub = strings.Replace(sub, "T", "", 1)

	// 20230122 10:27:18
	sub = strings.Replace(sub, "-", "", 2)

	// 20230122 102718
	sub = strings.Replace(sub, ":", "", 2)

	// 20230122102718
	sub = strings.Replace(sub, " ", "", 1)

	par, _ := time.Parse("20060102150405", sub)

	// UTC to local
	loc := UtcTime2TokyoTime(par)

	return loc
}

type Format string
