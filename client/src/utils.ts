// export function formatDuration(duration: number): { h: number, m: number } {
//     if (duration < 0) {
//         throw new Error("Bad parameter!")
//     }
//     const hours = Math.floor(duration / 60)
//     const minutes = duration % 60;
//     return { h: hours, m: minutes }
// }

/**
 * 
 * @param amount 1500
 * @returns ¥1,500
 */
export function formatJPY(amount: number): string {
    if (amount === 0) { return "-" }

    const parts = amount.toFixed(2).split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    if (parts[1] === '00') {
        parts.pop()
    }
    return '¥' + parts.join('.')
}

export function hourOfDuration(duration: number): number {
    if (duration < 0) { return 0 }
    return Math.floor(duration / 60)
}

export function minOfDuration(duration: number): number {
    if (duration < 0) { return 0 }
    return duration % 60
}

export function formattedHourOfDuration(duration: number): string {
    const h = hourOfDuration(duration)
    if (h === 0) {
        return ''
    } else {
        return h + 'h'
    }
}

export function formattedMinOfDuration(duration: number): string {
    const m = minOfDuration(duration)
    if (m === 0) {
        return ''
    } else {
        return m + 'm'
    }
}

export function formatDuration(duration: number): string {
    const h = formattedHourOfDuration(duration)
    const m = formattedMinOfDuration(duration)

    if (h.length > 0 && m.length > 0) {
        return h + ' ' + m
    } else if (h.length > 0) {
        return h
    } else {
        return m
    }
}

export function percentage(current: number, total: number): number {
    switch (total) {
        case -1:    // Endless
            return -1;
        case 0:     // Undefined
            return 0;
        default:    // Defined
            if (current >= total) {
                return 100;
            } else {
                return Math.round((current / total) * 100);
            }
    }
}

export function formatTime(inputTime: string): string {
    if (!/^\d{4}$|^\d{6}$/.test(inputTime)) {
        return ''
    }
    const hours = inputTime.slice(0, 2)
    const minutes = inputTime.slice(2, 4)
    const formattedTime = `${hours}:${minutes}`
    return formattedTime
}

/**
 * Check the progress is in schedule or not in this month
 * @param cur 
 * @param total 
 */
export function checkIsInSchedule(cur: number, total: number) {
    const currentDate = new Date()
    const day = currentDate.getDate()
    const totalDays = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
    return cur/total > day/totalDays
}

export function percentageOfProgress(cur: number, total: number): string {
    if (total === 0) {
        return '0%'
    }
    
    const percentage = (cur / total) * 100
    const formattedPercentage = percentage % 1 === 0 ? percentage.toFixed(0) : percentage.toFixed(1)
    return formattedPercentage + '%'
}