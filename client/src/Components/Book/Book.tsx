import * as React from 'react'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Fragment, useEffect, useState } from 'react'
import { DatePicker, TabContext, TabPanel } from '@mui/lab'
import { Tabs, Tab, Badge, Toolbar, Tooltip, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, InputLabel, MenuItem, Select, TextField, Grid, AppBar, ToggleButton, styled, ToggleButtonGroup, ButtonGroup, Link, BadgeProps } from '@mui/material'
import dayjs from 'dayjs'

// Icons
import { Battery, BatteryCharging, BatteryFull } from 'react-bootstrap-icons'
import CreateBookIcon from '@mui/icons-material/PostAdd'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { BookData } from '../../interfaces'
import EditModeIcon from '@mui/icons-material/DriveFileRenameOutline'
import EditIcon from '@mui/icons-material/Edit'
import { formatDuration } from '../../utils'


export default function Book() {
    // Status
    const [books, setBooks] = useState<BookData[]>([])
    const [status, setStatus] = useState("Reading")
    const [readCnt, setReadCnt] = useState(0)
    const [readingCnt, setReadingCnt] = useState(0)
    const [toReadCnt, setToReadCnt] = useState(0)
    const [editMode, setEditMode] = useState(false)
    const [editing, setEditing] = useState<BookData>()

    // [Styled Component]
    const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
        '& .MuiBadge-badge': {
            right: 1,
            top: 1,
            border: `1px solid ${theme.palette.background.paper}`,
            padding: '0 2px',
        },
    }))

    // [Dialog]
    const [openCreateBook, setOpenCreateBook] = useState(false)
    const handleCreateBookDialogOpen = () => { setOpenCreateBook(true) }
    const handleCreateBookDialogClose = () => { setOpenCreateBook(false) }

    const [openEditBook, setOpenEditBook] = useState(false)
    const handleEditBookDialogOpen = (id: string) => {
        fetchBookById(id)
        setOpenEditBook(true)
    }
    const handleEditBookDialogClose = () => {
        setOpenEditBook(false)

    }

    // [Handler]
    const handleEditButtonClick = () => {
        setEditMode(!editMode)
    }

    // [Fetcher]
    const fetchBookById = (id: string) => {
        fetch(`/api/book/update?id=${id}`, { method: "GET" })
            .then(resp => resp.json())
            .then(data => {
                if (data != null) {
                    setEditing(data['book'])
                    setOpenEditBook(true)
                }
            })
    }

    function fetchBooks() {
        fetch(`/api/book?status=${status}`)
            .then(resp => resp.json())
            .then(data => {
                setBooks(data["books"])
            })
    }

    function fetchStopwatch() {
        fetch(`/api/act/stopwatch`, { method: "GET" })
            .then(resp => resp.json())
            .then(data => {
                if (data != null) {
                }
            })
    }

    function fetchBadges() {
        fetch(`/api/book/badge`)
            .then(resp => resp.json())
            .then(data => {
                setReadCnt(data.badge["read"]);
                setReadingCnt(data.badge["reading"]);
                setToReadCnt(data.badge["to_read"]);
            })
    }

    function refresh() {
        fetchBooks()
        fetchBadges()
    }

    function Row(props: { row: BookData }) {
        const { row } = props
        const [open, setOpen] = React.useState(false)

        return (
            <Fragment>
                <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                    {
                        row.logs !== null ?
                            <TableCell>
                                <IconButton
                                    aria-label="expand row"
                                    size="small"
                                    onClick={() => setOpen(!open)}
                                >
                                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                </IconButton>
                            </TableCell>
                            : <TableCell></TableCell>
                    }
                    <TableCell component="th" scope="row" align="left">
                        {
                            editMode ?
                            <Link
                                component="button"
                                onClick={ () => {
                                    fetchBookById(row.id)
                                }}
                            >
                                {row.title}
                            </Link> :
                            <>{row.title}</>
                        }
                    </TableCell>
                    <TableCell align="right">{row.author}</TableCell>
                    <TableCell align="right">{row.publisher}</TableCell>
                    <TableCell align="right">{row.pub_year}</TableCell>
                    <TableCell align="right">{row.genre}</TableCell>
                    <TableCell align="right">{row.cur_page}</TableCell>
                    <TableCell align="right">{row.total_page}</TableCell>
                    <TableCell align="right">{row.page_percentage}</TableCell>
                    <TableCell align="right">{ formatDuration(row.total_time) }</TableCell>
                </TableRow>
                {
                    row.logs !== null
                        ? <TableRow>
                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                <Collapse in={open} timeout="auto" unmountOnExit>
                                    <Box sx={{ margin: 1 }}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Date</TableCell>
                                                    <TableCell align="right">Start</TableCell>
                                                    <TableCell align="right">End</TableCell>
                                                    <TableCell align="right">Page</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {row.logs.map((log) => (
                                                    <TableRow>
                                                        <TableCell component="th" scope="row">
                                                            {log.date}
                                                        </TableCell>
                                                        <TableCell align="right">{log.start}</TableCell>
                                                        <TableCell align="right">{log.end}</TableCell>
                                                        <TableCell align="right">{log.cur_page}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </Box>
                                </Collapse>
                            </TableCell>
                        </TableRow>
                        : <></>
                }
            </Fragment>
        );
    }

    const pcScreen = useMediaQuery('(min-width:600px)')
    function matchScreen(pc: number, mobile: number): number {
        if (pcScreen === true) {
            return pc
        } else {
            return mobile
        }
    }

    useEffect(() => {
        refresh()
    }, [status])

    return (
        <Box
            sx={{
                ml: matchScreen(4, 1),
                mr: matchScreen(4, 1),
                p: 1,
                border: 2,
                borderRadius: 1,
                borderColor: 'divider'
            }}
        >
            <AppBar position='static'>
                {/* Toolbar */}
                <Toolbar>
                    <ToggleButtonGroup
                        exclusive
                        sx={{ mt: 1, mb: 1 }}
                        value={status}
                        onChange={(event: React.MouseEvent<HTMLElement, MouseEvent>, value: any) => {
                            setStatus(value)
                        }}
                    >
                        <ToggleButton value="Read">
                            <StyledBadge
                                badgeContent={readCnt}
                                sx={{ "& .MuiBadge-badge": {
                                    color: 'black',
                                    backgroundColor: 'white' } 
                                }}
                            >
                                <BatteryFull fontSize="25" color="white" />
                            </StyledBadge>
                        </ToggleButton>
                        <ToggleButton value="Reading">
                            <StyledBadge
                                badgeContent={readingCnt}
                                sx={{ "& .MuiBadge-badge": {
                                    color: 'black',
                                    backgroundColor: 'green' } 
                                }}
                            >
                                <BatteryCharging fontSize="25" color="green" />
                            </StyledBadge>
                        </ToggleButton>
                        <ToggleButton value="ToRead">
                            <StyledBadge
                                badgeContent={toReadCnt}
                                sx={{ "& .MuiBadge-badge": {
                                    color: 'black',
                                    backgroundColor: 'red' } 
                                }}
                            >
                                <Battery fontSize="25" color="red" />
                            </StyledBadge>
                        </ToggleButton>
                    </ToggleButtonGroup>
                    <Box display='flex' flexGrow={1} />
                    <ButtonGroup variant="outlined" aria-label="outlined button group">
                        <IconButton
                            sx={{ color: editMode ? 'skyblue' : 'white' }}
                            onClick={handleEditButtonClick}
                        >
                            <EditModeIcon />
                        </IconButton>
                        <IconButton onClick={handleCreateBookDialogOpen}>
                            <CreateBookIcon />
                        </IconButton>
                    </ButtonGroup>
                        
                </Toolbar>
            </AppBar>

            <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            {/* { editMode ? <TableCell /> : <></> } */}
                            <TableCell align="left">Title</TableCell>
                            <TableCell align="right">Author</TableCell>
                            <TableCell align="right">Publisher</TableCell>
                            <TableCell align="right">Year</TableCell>
                            <TableCell align="right">Genre</TableCell>
                            <TableCell align="right">Current</TableCell>
                            <TableCell align="right">Total</TableCell>
                            <TableCell align="right">Progress</TableCell>
                            <TableCell align="right">Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {books?.map((row) => (
                            <Row key={row.id} row={row} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Create Book Dialog */}
            <Dialog
                open={openCreateBook}
                onClose={handleCreateBookDialogClose}
            >
                <DialogTitle align="center">Create Book</DialogTitle>
                <Divider />
                <DialogContent>
                    <form method="post" action="/api/book/create">
                        {/* Title */}
                        <FormControl fullWidth sx={{ mt: 1 }}>
                            <TextField name="title" label="Title" required />
                        </FormControl>

                        {/* Author */}
                        <FormControl fullWidth sx={{ mt: 1 }}>
                            <TextField name="author" label="Author" required />
                        </FormControl>

                        <Grid container sx={{ mt: 1 }}>
                            <Grid item sx={{ width: '55%' }}>
                                {/* Publisher */}
                                <FormControl fullWidth>
                                    <TextField name="publisher" label="Publisher" required />
                                </FormControl>
                            </Grid>
                            <Grid item sx={{ width: '2%' }}></Grid>
                            <Grid item sx={{ width: '43%' }}>
                                {/* Publication Year */}
                                <FormControl fullWidth>
                                    <TextField name="pub_year" label="Publication Year" type="number" required />
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Grid container sx={{ mt: 2 }}>
                            <Grid item sx={{ width: '55%' }}>
                                {/* Genre */}
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="Genre">Genre</InputLabel>
                                    <Select name="genre" label="Genre" required>
                                        <MenuItem value='Fiction'>Fiction</MenuItem>
                                        <MenuItem value='Non-Fiction'>Non-Fiction</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item sx={{ width: '2%' }}></Grid>
                            <Grid item sx={{ width: '43%' }}>
                                {/* Total Page */}
                                <FormControl fullWidth>
                                    <TextField
                                        name="total_page"
                                        label="Total Page"
                                        type="number"
                                        InputProps={{ inputProps: { min: 1 } }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>

                        <DialogActions sx={{ mt: 1, mb: -1, mr: -1 }}>
                            <Button color="secondary" onClick={handleCreateBookDialogClose}>Cancel</Button>
                            <Button type="submit" color="success">Create</Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Book Dialog */}
            <Dialog
                open={openEditBook}
                onClose={handleEditBookDialogClose}
            >
                <DialogTitle align="center">Edit Book</DialogTitle>
                <Divider />
                <DialogContent>
                    <form method="post" action="/api/book/update">
                        {/* ID */}
                        <FormControl fullWidth>
                            <TextField
                                required
                                name="id"
                                label="ID"
                                defaultValue={editing?.id}
                                inputProps={{
                                    readOnly: true
                                }}
                            />
                        </FormControl>

                        {/* Title */}
                        <FormControl fullWidth sx={{ mt: 1.3 }}>
                            <TextField
                                name="title"
                                label="Title"
                                defaultValue={editing?.title}
                                required />
                        </FormControl>

                        {/* Author */}
                        <FormControl fullWidth sx={{ mt: 1.3 }}>
                            <TextField
                                name="author"
                                label="Author"
                                defaultValue={editing?.author}
                                required />
                        </FormControl>

                        <Grid container sx={{ mt: 1.3 }}>
                            <Grid item sx={{ width: '49%' }}>
                                {/* Publisher */}
                                <FormControl fullWidth>
                                    <TextField
                                        name="publisher"
                                        label="Publisher"
                                        defaultValue={editing?.publisher}
                                        required />
                                </FormControl>
                            </Grid>
                            <Grid item sx={{ width: '2%' }} />
                            <Grid item sx={{ width: '49%' }}>
                                {/* Publication Year */}
                                <FormControl fullWidth>
                                    <TextField
                                        name="pub_year"
                                        label="Publication Year"
                                        defaultValue={editing?.pub_year}
                                        type="number"
                                        required />
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Grid container sx={{ mt: 1.3 }}>
                            <Grid item sx={{ width: '49%' }}>
                                {/* Genre */}
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="Genre">Genre</InputLabel>
                                    <Select name="genre" label="Genre" defaultValue={editing?.genre} required>
                                        <MenuItem value='Fiction'>Fiction</MenuItem>
                                        <MenuItem value='Non-Fiction'>Non-Fiction</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item sx={{ width: '2%' }} />
                            <Grid item sx={{ width: '49%' }}>
                                {/* Status */}
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="Status">Status</InputLabel>
                                    <Select name="status" label="Status" defaultValue={editing?.status} required>
                                        <MenuItem value='Read'>Read</MenuItem>
                                        <MenuItem value='Reading'>Reading</MenuItem>
                                        <MenuItem value='ToRead'>ToRead</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Grid container sx={{ mt: 1.3 }}>
                            <Grid item sx={{ width: '49%' }}>
                                {/* Current Page */}
                                <FormControl fullWidth>
                                    <TextField
                                        name="cur_page"
                                        label="Current Page"
                                        defaultValue={editing?.cur_page}
                                        type="number"
                                        InputProps={{ inputProps: { min: 0 } }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item sx={{ width: '2%' }} />
                            <Grid item sx={{ width: '49%' }}>
                                {/* Total Page */}
                                <FormControl fullWidth>
                                    <TextField
                                        name="total_page"
                                        label="Total Page"
                                        defaultValue={editing?.total_page}
                                        type="number"
                                        InputProps={{ inputProps: { min: 1 } }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>

                        <DialogActions sx={{ mt: 1, mb: -1, mr: -1 }}>
                            <Button color="secondary" onClick={handleEditBookDialogClose}>Cancel</Button>
                            <Button type="submit" color="success">Update</Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
        </Box>
    )
}