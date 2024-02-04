// [Act]
export interface ActData {
    id: string,
    type: string,
    date: string,
    start: string,
    end: string,
    duration: number,
    target_id: string,
    title: string
}

export interface ActSummaryData {
    type: string,
    duration: number,
    hour: number,
    min: number
}

export interface StopwatchData {
    start_time: string,
    end_time: string,
    duration: number,
    type: string,
    target_id: string,
    target_title: string
}

// [Book]
export interface BookData {
    id: string,
    title: string,
    author: string,
    publisher: string,
    pub_year: string,
    genre: string,
    status: string,
    cur_page: number,
    total_page: number,
    total_time: number,
    hour: number,
    min: number,
    page_progress: string,
    page_percentage: string,
    logs: LogData[],
}

export interface LogData {
    date: string,
    start: string,
    end: string,
    cur_page: number,
}

// [Game]
export interface GameDetailData {
    game: GameData,
    developer: DeveloperData,
    publisher: PublisherData,
    played_hour: 0,
    played_min: 0,
}

export interface GameData {
    id: string,
    title: string,
    genre: string,
    platform: string,
    developer_id: string,
    publisher_id: string,
    status: string,
    total_time: number,
    how_long_to_beat: number,
    ranking: number,
    rating: string,
    developer: string,
    publisher: string
}

export interface IncData {
    id: string,
    name: string,
    is_dev: boolean,
    is_pub: boolean
}

export interface DeveloperData {
    id: string,
    name: string,
}

export interface PublisherData {
    id: string,
    name: string,
}

// [Programming]
export interface ProjectData {
    id: string,
    title: string
}