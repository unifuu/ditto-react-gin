// export function formatDuration(duration: number): { h: number, m: number } {
//     if (duration < 0) {
//         throw new Error("Bad parameter!")
//     }
//     const hours = Math.floor(duration / 60)
//     const minutes = duration % 60;
//     return { h: hours, m: minutes }
// }

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