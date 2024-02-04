import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import { Box, Chip, Stack } from '@mui/material'
import { NavLink, useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { PostData, TagData } from './interfaces'
import PinIcon from '@mui/icons-material/PushPin'

interface Props {
    posts: PostData[],
    tagging: TagData | undefined,
};

export default function PostRows(props: Props) {
    const navigate = useNavigate()
    const { posts, tagging } = props

    return (
        <Grid item xs={7} md={8} sx={{ '& .markdown': { py: 3 } }}>
            {/* Filter */}
            <Typography sx={{ pl: 2 }} variant="h6" gutterBottom>
                {/* { tag } */}
                {tagging === undefined
                        ? <>The latest posts</>
                        : <>Posts in <Chip label={tagging?.name} variant="outlined" sx={{ fontSize: 14, borderColor: tagging?.color, color: tagging?.color }} onDelete={ () => navigate("/blog") } />  tag</>
                }
            </Typography>

            <Divider />

            {/* Post List */}
            {posts?.map((element, i) => (
                <Grid
                    item
                    sx={{ pt: 2, pl: 2 }}
                >
                    <Stack
                        direction="row"
                        alignItems="center"
                    >
                        {/* Pin */}
                        {
                            element.is_pinned
                                ? <PinIcon sx={{ mr: 0.3, fontSize: 18, color: '#AEAEAE' }} />
                                : <></>
                        }

                        {/* Tags */}
                        {element.tags?.map((t) => (
                            t.name.length === 0
                                ? <></>
                                : <Chip label={t.name} sx={{ mr: 0.5 }} style={{ color: `${t.color}` }} size="small" />
                            
                        ))}
                    </Stack>

                    {/* Title */}
                    <Box sx={{ mt: 0.5, fontWeight: 'bold', fontSize: 23 }}>
                        <NavLink
                            to='/post'
                            state={{ id: element.id }}
                            style={{ textDecoration: 'none', color: 'skyblue' }}
                        >
                            {element.title}
                        </NavLink>
                    </Box>

                    {/* Preview */}
                    <Box
                        sx={{
                            pt: 0.3,
                            color: '#AEAEAE',
                            fontSize: 16,
                        }}
                    >
                        {element.preview}
                    </Box>

                    {/* Date */}
                    <Box
                        sx={{
                            pt: 0.5,
                            color: 'gray',
                            fontSize: 12
                        }}
                    >
                        {dayjs(element.date).format('ddd MMM DD YYYY')}
                    </Box>

                    <Divider sx={{ ml: -2, pt: 2 }} />
                </Grid>
            ))}
        </Grid>
    );
}