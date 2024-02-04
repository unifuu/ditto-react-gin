import { AppBar, Chip } from '@mui/material'
import { ListItemIcon } from '@mui/material'
import { Menu } from '@mui/material'
import { MenuItem } from '@mui/material'
import { Pagination } from '@mui/material'
import { Box } from '@mui/material'
import { Button } from '@mui/material'
import { Container } from '@mui/material'
import { Dialog } from '@mui/material'
import { DialogActions } from '@mui/material'
import { DialogContent } from '@mui/material'
import { DialogTitle } from '@mui/material'
import { Divider } from '@mui/material'
import { FormControl } from '@mui/material'
import { Grid } from '@mui/material'
import { List } from '@mui/material'
import { ListItem } from '@mui/material'
import { ListItemText } from '@mui/material'
import { Paper } from '@mui/material'
import { TextField } from '@mui/material'
import { Toolbar } from '@mui/material'
import { Typography } from '@mui/material'
import { ChangeEvent, useEffect } from 'react'
import { useState } from 'react'
import IconButton from '@mui/material/IconButton'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import PostAddIcon from '@mui/icons-material/PostAdd'
import EditIcon from '@mui/icons-material/Edit'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import Header from './Header'
import PostRows from './PostRows'
import Footer from './Footer'
import TagSelects from './TagSelects'
import { NavLink } from 'react-router-dom'
import { useLocation, useNavigate} from 'react-router-dom'
import MenuIcon from '@mui/icons-material/Menu'
import { purple } from '@mui/material/colors'
import { PostData, TagData } from './interfaces'

export default function Blog(props: { authed: boolean }) {
    // React
    const navigate = useNavigate()
    const { state } = useLocation()

    // States
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const [posts, setPosts] = useState<PostData[]>([])
    const [tagging, setTagging] = useState<string>('')
    const [tags, setTags] = useState<TagData[]>([])
    const [searchResultTags, setSearchResultTags] = useState<TagData[]>([])
    const [updatingTag, setUpdatingTag] = useState<TagData>()

    // Dialogs
    const [openCreatePostDialog, setOpenCreatePostDialog] = useState(false)
    const handleCreatePostDialogOpen = () => { setOpenCreatePostDialog(true) }
    const handleCreatePostDialogClose = () => { setOpenCreatePostDialog(false) }

    const [openTagDialog, setOpenTagDialog] = useState(false)
    const handleTagDialogOpen = () => { setOpenTagDialog(true) }
    const handleTagDialogClose = () => { setOpenTagDialog(false) }

    const [openCreateTagDialog, setOpenCreateTagDialog] = useState(false)
    const handleCreateTagDialogOpen = () => { setOpenCreateTagDialog(true) }
    const handleCreateTagDialogClose = () => { setOpenCreateTagDialog(false) }

    const [openUpdateTagDialog, setOpenUpdateTagDialog] = useState(false)
    const handleUpdateTagDialogOpen = () => { setOpenUpdateTagDialog(true) }
    const handleUpdateTagDialogClose = () => { setOpenUpdateTagDialog(false) }

    const handleUpdateTagging = (tagging: string) => { state.tag = tagging }

    // Effects
    useEffect(() => {
        if (state !== null) {
            setTagging(state.tag)
        } else {
            setTagging('')
        }

        fetchBlogPosts()
        fetchTags()
    }, [page, state])

    // Functions
    function tagByName(name: string): TagData | undefined {
        const foundTag = tags.find((tag) => tag.name === name)
        return foundTag
    }

    const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
        setPage(value)
    }

    const handleToUpdateTag = (id: string, name: string, color: string) => {
        setUpdatingTag({ id: id, name: name, color: color })
        handleUpdateTagDialogOpen()
    }

    const handleDeleteTag = (id: string) => {
        fetch(`/api/blog/tag/delete?id=${id}`)
            .then(resp => {
                if (!resp.ok) { alert(resp.json()) }
                else { navigate(0) }
            })
    }

    const fetchTags = () => {
        fetch(`/api/blog/tag`)
            .then(resp => resp.json())
            .then(data => {
                if (data["tags"] != null) { setTags(data["tags"]) } else { setTags([]) }
            })
    }

    const fetchBlogPosts = () => {
        var url = ""
        if (state === null) {
            url = `/api/blog/p/${page}`
        } else {
            url = `/api/blog/tag/${state.tag}/p/${page}`
        }

        fetch(url)
            .then(resp => resp.json())
            .then(data => {
                if (data["posts"] != null) {setPosts(data["posts"])}
                else { setPosts([]) }
                setTotalPages(data["total_page"])
            })
    }

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    return (
        <>
            <Container maxWidth="lg">
                <Grid container>
                    {
                        props.authed ?
                            <Grid item>
                                <Box justifyContent="flex-start">
                                    <AppBar
                                        sx={{ width: '50%', mr: '50%' }}
                                        style={{ background: 'transparent', boxShadow: 'none' }}
                                    >
                                        <Toolbar>
                                            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                                                <IconButton
                                                    onClick={handleClick}
                                                    aria-controls={open ? 'account-menu' : undefined}
                                                    aria-haspopup="true"
                                                    aria-expanded={open ? 'true' : undefined}
                                                >
                                                    <MenuIcon
                                                        sx={{
                                                            fontSize: 32,
                                                            color: purple[100],
                                                            "&:hover": { color: purple[200], fontSize: 35 }
                                                        }}
                                                    />
                                                </IconButton>
                                            </Box>
                                            <Menu
                                                anchorEl={anchorEl}
                                                id="account-menu"
                                                open={open}
                                                onClose={handleClose}
                                                onClick={handleClose}
                                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                            >
                                                <MenuItem onClick={handleCreatePostDialogOpen}>
                                                    <ListItemIcon>
                                                        <PostAddIcon
                                                            sx={{
                                                                fontSize: 28,
                                                                color: purple[100],
                                                                "&:hover": { color: purple[200] }
                                                            }}
                                                        />
                                                    </ListItemIcon>
                                                    <Typography
                                                        sx={{
                                                            pl: 1,
                                                            color: purple[100],
                                                        }}
                                                    >
                                                        Create Post
                                                    </Typography>
                                                </MenuItem>

                                                <MenuItem onClick={handleTagDialogOpen}>
                                                    <ListItemIcon>
                                                        <LocalOfferIcon
                                                            sx={{
                                                                fontSize: 28,
                                                                color: purple[100],
                                                                "&:hover": { color: purple[200] }
                                                            }}
                                                        />
                                                    </ListItemIcon>
                                                    <Typography
                                                        sx={{
                                                            pl: 1,
                                                            color: purple[100]
                                                        }}
                                                    >
                                                        Manage Tags
                                                    </Typography>
                                                </MenuItem>
                                            </Menu>
                                        </Toolbar>
                                    </AppBar>
                                </Box>
                            </Grid>
                            : <></>
                    }
                </Grid>

                {/* Title */}
                <Header title="ひととせ" />
                <main>
                    <Grid container spacing={5} sx={{ mt: 1, mb: 5 }}>
                        {/* Posts List */}
                        <PostRows posts={posts} tagging={tagByName(tagging)} />

                        {/* Tags */}
                        <Grid item xs={5} md={4} alignItems="flex-start">
                            <Paper elevation={1} sx={{ p: 2, bgcolor: 'grey.900' }}>
                                <Typography
                                    variant="h6"
                                    gutterBottom
                                >
                                    Tags
                                </Typography>

                                <Grid container sx={{ pt: 0.1 }} spacing={0.7}>
                                    {tags.map((tag) => (
                                        <Grid item>
                                            <NavLink
                                                to='/blog'
                                                state={{ tag: tag.name }}
                                                style={{ textDecoration: 'none' }}
                                            >
                                                <Button
                                                    style={{
                                                        borderRadius: 20,
                                                        color: tag.color,
                                                        borderColor: tag.color,
                                                        textTransform: 'none',
                                                    }}
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={ () => setPage(1) }
                                                >
                                                    {tag.name}
                                                </Button>
                                            </NavLink>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </main>

                {/* Create Post Dialog */}
                <Dialog
                    open={openCreatePostDialog}
                    onClose={handleCreatePostDialogClose}
                >
                    <DialogTitle align="center">Create Post</DialogTitle>
                    <DialogContent>
                        <form method="post" action="/api/blog/post/create">
                            {/* Title */}
                            <FormControl fullWidth sx={{ mt: 1 }}>
                                <TextField
                                    name="title"
                                    label="Title"
                                    required>
                                </TextField>
                            </FormControl>

                            {/* Preview */}
                            <FormControl fullWidth sx={{ mt: 1.5 }}>
                                <TextField
                                    name="preview"
                                    label="Preview"
                                    required
                                    multiline maxRows={3}>
                                </TextField>
                            </FormControl>

                            <TagSelects selectedTags={[]} />

                            {/* Content */}
                            <FormControl fullWidth sx={{ mt: 1.5 }}>
                                <TextField
                                    name="content"
                                    label="Content"
                                    required
                                    multiline maxRows={15}>
                                </TextField>
                            </FormControl>

                            {/* Buttons */}
                            <DialogActions sx={{ mt: 1, mb: -1, mr: -1 }}>
                                <Button color="secondary" onClick={handleCreatePostDialogClose}>Cancel</Button>
                                <Button color="success" type="submit">Create</Button>
                            </DialogActions>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Search Tag Dialog */}
                <Dialog
                    open={openTagDialog}
                    onClose={handleTagDialogClose}
                >
                    <DialogTitle align="center">
                        Tags
                        <IconButton onClick={handleCreateTagDialogOpen}>
                            <AddCircleOutlineIcon sx={{ color: "gray" }} />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <form>
                            <List>
                                {tags.map((tag, index) => (
                                    <>
                                        <ListItem
                                            key={tag.id}
                                            disableGutters
                                            secondaryAction={
                                                <>
                                                    <IconButton
                                                        edge="end"
                                                        style={{ color: `${tag.color}` }}
                                                        onClick={() => handleToUpdateTag(tag.id, tag.name, tag.color)}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>

                                                    <IconButton
                                                        edge="end"
                                                        sx={{ pl: 1 }}
                                                        style={{ color: `${tag.color}` }}
                                                        onClick={() => handleDeleteTag(tag.id)}
                                                    >
                                                        <RemoveCircleOutlineIcon />
                                                    </IconButton>
                                                </>
                                            }
                                        >
                                            <ListItemText
                                                sx={{ mr: 5 }}
                                                style={{ color: `${tag.color}` }}
                                                primary={tag.name}
                                            />
                                        </ListItem>
                                        {index !== tags.length - 1 ? <Divider /> : <></>}
                                    </>
                                ))}
                            </List>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Create Tag Dialog */}
                <Dialog
                    open={openCreateTagDialog}
                    onClose={handleCreateTagDialogClose}
                >
                    <DialogTitle align='center'>Create Tag</DialogTitle>
                    <Divider />
                    <DialogContent>
                        <form method="post" action="/api/blog/tag/create">
                            {/* Name */}
                            <FormControl fullWidth>
                                <TextField
                                    variant="filled"
                                    name="name"
                                    label="Name"
                                    required>
                                </TextField>
                            </FormControl>

                            {/* Color */}
                            <FormControl fullWidth sx={{ mt: 1 }}>
                                <TextField
                                    variant="filled"
                                    name="color"
                                    label="Color"
                                    required>
                                </TextField>
                            </FormControl>

                            {/* Buttons */}
                            <DialogActions sx={{ mr: -2 }}>
                                <Button color="secondary" onClick={handleCreateTagDialogClose}>Close</Button>
                                <Button color="success" type="submit">Create</Button>
                            </DialogActions>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Update Tag Dialog */}
                <Dialog
                    open={openUpdateTagDialog}
                    onClose={handleUpdateTagDialogClose}
                >
                    <DialogTitle align='center'>Update Tag</DialogTitle>
                    <DialogContent>
                        <form method="post" action="/api/blog/tag/update">
                            {/* Id */}
                            <FormControl fullWidth>
                                <TextField
                                    variant="filled"
                                    name="id"
                                    label="ID"
                                    defaultValue={updatingTag?.id}
                                    inputProps={{
                                        readOnly: true
                                    }}
                                    required>
                                </TextField>
                            </FormControl>

                            {/* Name */}
                            <FormControl fullWidth>
                                <TextField
                                    variant="filled"
                                    name="name"
                                    label="Name"
                                    defaultValue={updatingTag?.name}
                                    required>
                                </TextField>
                            </FormControl>

                            {/* Color */}
                            <FormControl fullWidth>
                                <TextField
                                    variant="filled"
                                    name="color"
                                    label="Color"
                                    defaultValue={updatingTag?.color}
                                    required>
                                </TextField>
                            </FormControl>

                            {/* Buttons */}
                            <DialogActions sx={{ mr: -2 }}>
                                <Button color="secondary" onClick={handleUpdateTagDialogClose}>Close</Button>
                                <Button color="success" type="submit">Update</Button>
                            </DialogActions>
                        </form>
                    </DialogContent>
                </Dialog>
            </Container>

            <Grid xs={12} sx={{ pb: 10 }}>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >
                    {totalPages === 1
                        ? <></>
                        : <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        variant="outlined"
                        color="secondary" />
                    }
                </Box>
            </Grid>

            {/* Footer */}
            <Paper
                square
                sx={{
                    marginTop: 'calc(10% + 80px)',
                    position: 'fixed',
                    bottom: 0,
                    width: '100%'
                }}
                component="footer"
            >
                <Footer />
            </Paper>
        </>
    )
}