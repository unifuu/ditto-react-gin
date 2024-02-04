import { useEffect, useState } from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import ListItemText from '@mui/material/ListItemText'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Checkbox from '@mui/material/Checkbox'
import { TagData } from './interfaces'

interface TagProps {
    selectedTags: TagData[]
}

const ITEM_HEIGHT = 50
const ITEM_PADDING_TOP = 0
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
}

function tagsToNames(tags: TagData[]): string[] {
    let tagNames: string[] = []
    tags.forEach((tag) => {
        tagNames.push(tag.name)
    })
    return tagNames
}

export default function TagSelects(props: TagProps) {
    const [tags, setTags] = useState<TagData[]>()
    const [selectedTags, setSelectedTags] = useState<string[]>(tagsToNames(props.selectedTags))

    useEffect(() => {
        fetchData()
      }, [])

    const fetchData = () => {
        fetch(`/api/blog/tag`)
        .then(resp => resp.json())
        .then(data => {
            if (data["tags"] != null) { setTags(data["tags"]) } else { setTags([]) }
        })
    }

    const handleChange = (event: SelectChangeEvent<typeof selectedTags>) => {
        const { target: { value } } = event
        setSelectedTags(
            typeof value === 'string' ? value.split(',') : value
        )
    }

    return (
        <FormControl fullWidth sx={{ mt: 1.5 }}>
            <InputLabel>Tags</InputLabel>
            <Select
                multiple
                name="tags"
                label="Tags"
                value={ selectedTags }
                onChange={ handleChange }
                renderValue={ (selected) => selected.filter(Boolean).join(', ') }
                MenuProps={ MenuProps }
            >
                {tags?.map((tag) => (
                    <MenuItem key={tag.id} value={tag.name}>
                        <Checkbox checked={selectedTags.indexOf(tag.name) > -1} />
                        <ListItemText primary={tag.name} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}