import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Box } from '@mui/material'
import { Button } from '@mui/material'
import { Container } from '@mui/material'
import { Dialog } from '@mui/material'
import { DialogActions } from '@mui/material'
import { DialogContent } from '@mui/material'
import { DialogTitle } from '@mui/material'
import { FormControl } from '@mui/material'
import { Grid } from '@mui/material'
import { IconButton } from '@mui/material'
import { TextField } from '@mui/material'
import useToken from '../../useToken'
import ModeIcon from '@mui/icons-material/Mode'
import dayjs from 'dayjs'
import PostHeader from './PostHeader'
import useMediaQuery from '@mui/material/useMediaQuery'
import { PostData } from './interfaces'
import TagSelects from './TagSelects'
import Loading from '../Common/Loading'
import styles from './styles.module.css'
import PinIcon from '@mui/icons-material/PushPin'

export default function Post() {
    const navigate = useNavigate()
    const pcScreen = useMediaQuery('(min-width:600px)')
    function matchScreen(pc: number, mobile: number): number {
        if (pcScreen === true) {
            return pc
        } else {
            return mobile
        }
    }
    function backToBlog() { navigate('/blog') }

    const { postId } = useParams()
    const { token } = useToken()
    const { state } = useLocation()
    const [post, setPost] = useState<PostData>()

    useEffect(() => {
        fetchPost()
    }, [])

    const handlePinPost = () => {
        fetch(`/api/blog/post/pin?id=${post?.id}`, { method: "POST" })
            .then(resp => resp.json())
            .then(data => {
                window.location.reload()
            })
    }

    const [openEditPostDialog, setOpenEditPostDialog] = useState(false)
    const handleEditPostDialogOpen = () => { setOpenEditPostDialog(true) }
    const handleEditPostDialogClose = () => {
        setOpenEditPostDialog(false)
    }

    const fetchPost = () => {
        var url = ""
        if (state === null) {
            url = `/api/blog/post/id/${postId}`
        } else {
            url = `/api/blog/post/id/${state.id}`
        }

        fetch(url)
            .then(resp => resp.json())
            .then(data => {
                setPost(data["post"])
            })
    }

    const handleDeletePost = (id: String) => {
        fetch(`/api/blog/post/delete?id=${id}`, { method: "POST" })
            .then(() => {
                handleEditPostDialogClose()
                backToBlog()
            })
    }

    if (!post) {
        return <Loading />
    } else {
        return (
            <Container>
                <PostHeader title={post!!.title} />

                {/* Date */}
                <Grid sx={{ mt: 1, ml: 1 }}>
                    <Box
                        sx={{
                            color: 'gray',
                            fontSize: 12
                        }}
                    >
                        {dayjs(post!!.date).format('ddd MMM DD YYYY')}
                        {token && <>
                            <IconButton onClick={handleEditPostDialogOpen}>
                                <ModeIcon sx={{ fontSize: 15, color: "gray" }} />
                            </IconButton>
                            <IconButton sx={{ ml: -1.5 }} onClick={handlePinPost}>
                                {post!!.is_pinned ?
                                    <PinIcon sx={{ fontSize: 15, color: "#9575CD" }} /> :
                                    <PinIcon sx={{ fontSize: 15, color: "gray" }} />
                                }
                            </IconButton>
                        </>}
                    </Box>
                </Grid>

                {/* Content */}
                <Box
                    style={{ wordWrap: 'break-word',  }}
                    sx={{
                        mt: 1,
                        pb: 5,
                        ml: matchScreen(4, 1),
                        mr: matchScreen(4, 1),
                    }}
                >
                    <ReactMarkdown
                        className={styles.tables}
                        children={post!!.content}
                        remarkPlugins={[remarkGfm]}
                        components={{
                            code(props) {
                                const { children, className } = props
                                const match = /language-(\w+)/.exec(className || '')
                                return match ? (
                                    <SyntaxHighlighter
                                        PreTag="div"
                                        children={String(children).replace(/\n$/, '')}
                                        language={match[1]}
                                        style={oneDark}
                                    />
                                ) : (
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                )
                            }
                        }}
                    />
                </Box>

                {/* Update Post Dialog */}
                <Dialog
                    open={openEditPostDialog}
                    onClose={handleEditPostDialogClose}
                >
                    <DialogTitle align="center" textAlign="center">
                        Update Post
                    </DialogTitle>
                    <DialogContent>
                        <form method="post" action="/api/blog/post/update">
                            <FormControl fullWidth sx={{ mt: 1.5 }}>
                                <TextField
                                    name="id"
                                    label="ID"
                                    defaultValue={post!!.id}
                                    required
                                    inputProps={{
                                        readOnly: true
                                    }}
                                />
                            </FormControl>

                            <FormControl fullWidth sx={{ mt: 1.5 }}>
                                <TextField
                                    name="title"
                                    label="Title"
                                    defaultValue={post!!.title}
                                    required>
                                </TextField>
                            </FormControl>

                            <FormControl fullWidth sx={{ mt: 1.2 }}>
                                <TextField
                                    name="preview"
                                    label="Preview"
                                    defaultValue={post!!.preview}
                                    required
                                    multiline maxRows={3}>
                                </TextField>
                            </FormControl>

                            <TagSelects selectedTags={post!!.tags} />

                            <FormControl fullWidth sx={{ mt: 1.5 }}>
                                <TextField
                                    name="content"
                                    label="Content"
                                    defaultValue={post!!.content}
                                    required
                                    multiline maxRows={15}>
                                </TextField>
                            </FormControl>

                            <DialogActions style={{ justifyContent: "space-between" }} sx={{ mb: -1, ml: -1, mr: -1 }}>
                                <Button color="error" onClick={e => handleDeletePost(post!!.id.toString())}>Delete</Button>
                                <Box>
                                    <Button color="secondary" onClick={handleEditPostDialogClose}>Cancel</Button>
                                    <Button color="success" type="submit">Update</Button>
                                </Box>
                            </DialogActions>
                        </form>
                    </DialogContent>
                </Dialog>
            </Container >
        )
    }
}