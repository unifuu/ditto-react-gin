export interface PostData {
    id: string,
    title: string,
    preview: string,
    content: string,
    tag_ids: string[],
    tags: TagData[],
    is_pinned: boolean,
    date: string,
}

export interface TagData {
    id: string,
    name: string,
    color: string,
}