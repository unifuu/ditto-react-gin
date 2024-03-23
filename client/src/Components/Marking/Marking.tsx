import * as React from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Fragment, useEffect, useState } from 'react'
import { Tabs, Tab, Badge, Toolbar, Tooltip, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, InputLabel, MenuItem, Select, TextField, Grid, AppBar, ToggleButton, styled, ToggleButtonGroup, ButtonGroup, Link, BadgeProps } from '@mui/material'
import dayjs from 'dayjs'
import { formatJPY } from '../../utils'

// Icons
import CreateMarkingIcon from '@mui/icons-material/PostAdd'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { MarkingData } from '../../interfaces'
import EditModeIcon from '@mui/icons-material/DriveFileRenameOutline'
import EditIcon from '@mui/icons-material/Edit'
import { TodoBadge } from '../Common/Badges'
import { DoingBadge } from '../Common/Badges'
import { DoneBadge } from '../Common/Badges'


export default function Marking() {
    // Status
    const [markings, setMarkings] = useState<MarkingData[]>([])
    const [status, setStatus] = useState("0")
    const [doneCnt, setDoneCnt] = useState(0)
    const [doingCnt, setDoingCnt] = useState(0)
    const [todoCnt, setTodoCnt] = useState(0)
    const [editMode, setEditMode] = useState(false)
    const [editing, setEditing] = useState<MarkingData>()

    // [Dialog]
    const [openCreateMarking, setOpenCreateMarking] = useState(false)
    const handleCreateMarkingDialogOpen = () => { setOpenCreateMarking(true) }
    const handleCreateMarkingDialogClose = () => { setOpenCreateMarking(false) }

    const [openEditMarking, setOpenEditMarking] = useState(false)
    const handleEditMarkingDialogOpen = (id: string) => {
        fetchMarkingById(id)
        setOpenEditMarking(true)
    }
    const handleEditMarkingDialogClose = () => {
        setOpenEditMarking(false)
    }

    // [Handler]
    const handleEditButtonClick = () => {
        setEditMode(!editMode)
    }

    // [Fetcher]
    const fetchMarkingById = (id: string) => {
        fetch(`/api/marking/update?id=${id}`, { method: "GET" })
            .then(resp => resp.json())
            .then(data => {
                if (data != null) {
                    setEditing(data['marking'])
                    setOpenEditMarking(true)
                }
            })
    }

    function fetchMarkings() {
        fetch(`/api/marking/query?status=${status}`)
            .then(resp => resp.json())
            .then(data => {
                setMarkings(data["markings"])
            })
    }

    function fetchBadges() {
        fetch(`/api/marking/badge`)
            .then(resp => resp.json())
            .then(data => {
                setDoneCnt(data.badge["done"]);
                setDoingCnt(data.badge["doing"]);
                setTodoCnt(data.badge["todo"]);
            })
    }

    function refresh() {
        fetchMarkings()
        fetchBadges()
    }

    function Row(props: { row: MarkingData }) {
        const { row } = props
        const [open, setOpen] = React.useState(false)

        return (
            <Fragment>
                <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                    <TableCell align="left">{row.percentage}</TableCell>
                    <TableCell component="th" scope="row" align="left">
                        {editMode ?
                            <Link component="button" onClick={() => { fetchMarkingById(row.id) }}>
                                {row.title}
                            </Link> : <>{row.title}</>
                        }
                    </TableCell>
                    <TableCell align="right">{row.by}</TableCell>
                    <TableCell align="right">{row.type}</TableCell>
                    <TableCell align="right">{row.year}</TableCell>
                    <TableCell align="right">{formatJPY(row.price)}</TableCell>
                    <TableCell align="right">{row.current}</TableCell>
                    <TableCell align="right">{row.total}</TableCell>
                    <TableCell align="right">{row.progress}</TableCell>
                </TableRow>
            </Fragment>
        )
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
                <Toolbar>
                    <ToggleButtonGroup
                        exclusive
                        sx={{ mt: 1, mb: 1 }}
                        value={status}
                        onChange={(event: React.MouseEvent<HTMLElement, MouseEvent>, value: any) => {
                            setStatus(value)
                        }}
                    >
                        <ToggleButton value="1">
                            {DoneBadge(doneCnt)}
                        </ToggleButton>
                        <ToggleButton value="0">
                            {DoingBadge(doingCnt)}
                        </ToggleButton>
                        <ToggleButton value="-1">
                            {TodoBadge(todoCnt)}
                        </ToggleButton>
                    </ToggleButtonGroup>
                    <Box display='flex' flexGrow={1} />
                    <ButtonGroup variant="outlined">
                        <IconButton
                            sx={{ color: editMode ? 'skyblue' : 'white' }}
                            onClick={handleEditButtonClick}
                        >
                            <EditModeIcon />
                        </IconButton>
                        <IconButton onClick={handleCreateMarkingDialogOpen}>
                            <CreateMarkingIcon />
                        </IconButton>
                    </ButtonGroup>
                </Toolbar>
            </AppBar>

            <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left" style={{ fontWeight: 'bold' }}>%</TableCell>
                            <TableCell align="left" style={{ fontWeight: 'bold' }}>Title</TableCell>
                            <TableCell align="right" style={{ fontWeight: 'bold' }}>By</TableCell>
                            <TableCell align="right" style={{ fontWeight: 'bold' }}>Type</TableCell>
                            <TableCell align="right" style={{ fontWeight: 'bold' }}>Year</TableCell>
                            <TableCell align="right" style={{ fontWeight: 'bold' }}>Price</TableCell>
                            <TableCell align="right" style={{ fontWeight: 'bold' }}>Current</TableCell>
                            <TableCell align="right" style={{ fontWeight: 'bold' }}>Total</TableCell>
                            <TableCell align="right" style={{ fontWeight: 'bold' }}>Progress</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {markings?.map((row) => (
                            <Row key={row.id} row={row} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* [Create Marking Dialog] */}
            <Dialog
                open={openCreateMarking}
                onClose={handleCreateMarkingDialogClose}
            >
                <DialogTitle align="center">Create Marking</DialogTitle>
                <Divider />
                <DialogContent>
                    <form method="post" action="/api/marking/create">
                        {/* Title */}
                        <FormControl fullWidth sx={{ mt: 1 }}>
                            <TextField name="title" label="Title" required />
                        </FormControl>

                        <Grid container sx={{ mt: 1 }}>
                            <Grid item sx={{ width: '55%' }}>
                                {/* By */}
                                <FormControl fullWidth>
                                    <TextField name="by" label="By" required />
                                </FormControl>
                            </Grid>
                            <Grid item sx={{ width: '2%' }}></Grid>
                            <Grid item sx={{ width: '43%' }}>
                                {/* Year */}
                                <FormControl fullWidth>
                                    <TextField name="year" label="Year" type="number" required />
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Grid container sx={{ mt: 2 }}>
                            <Grid item sx={{ width: '55%' }}>
                                {/* Type */}
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="Type">Type</InputLabel>
                                    <Select name="type" label="Type" required>
                                        <MenuItem value='Anime'>Anime</MenuItem>
                                        <MenuItem value='Game'>Game</MenuItem>
                                        <MenuItem value='Gunpla'>Gunpla</MenuItem>
                                        <MenuItem value='Book'>Book</MenuItem>
                                        <MenuItem value='Lesson'>Lesson</MenuItem>
                                        <MenuItem value='Movie'>Movie</MenuItem>
                                        <MenuItem value='Stationery'>Stationery</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item sx={{ width: '2%' }}></Grid>
                            <Grid item sx={{ width: '43%' }}>
                                {/* Total */}
                                <FormControl fullWidth>
                                    <TextField
                                        name="total"
                                        label="Total"
                                        type="number"
                                        InputProps={{ inputProps: { min: 1 } }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>

                        <DialogActions sx={{ mt: 1, mb: -1, mr: -1 }}>
                            <Button color="secondary" onClick={handleCreateMarkingDialogClose}>Cancel</Button>
                            <Button type="submit" color="success">Create</Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
            
            {/* [Edit Marking Dialog] */}
            <Dialog
                open={openEditMarking}
                onClose={handleEditMarkingDialogClose}
            >
                <DialogTitle align="center">Edit Marking</DialogTitle>
                <Divider />
                <DialogContent>
                    <form method="post" action="/api/marking/update">
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

                        <Grid container sx={{ mt: 1.3 }}>
                            <Grid item sx={{ width: '49%' }}>
                                {/* By */}
                                <FormControl fullWidth>
                                    <TextField
                                        name="by"
                                        label="By"
                                        defaultValue={editing?.by}
                                        required />
                                </FormControl>
                            </Grid>
                            <Grid item sx={{ width: '2%' }} />
                            <Grid item sx={{ width: '49%' }}>
                                {/* Year */}
                                <FormControl fullWidth>
                                    <TextField
                                        name="year"
                                        label="Year"
                                        defaultValue={editing?.year}
                                        type="number"
                                        required />
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Grid container sx={{ mt: 1.3 }}>
                            <Grid item sx={{ width: '49%' }}>
                                {/* Type */}
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="Type">Type</InputLabel>
                                    <Select name="type" label="Type" defaultValue={editing?.type} required>
                                        <MenuItem value='Anime'>Anime</MenuItem>
                                        <MenuItem value='Game'>Game</MenuItem>
                                        <MenuItem value='Gunpla'>Gunpla</MenuItem>
                                        <MenuItem value='Book'>Book</MenuItem>
                                        <MenuItem value='Lesson'>Lesson</MenuItem>
                                        <MenuItem value='Movie'>Movie</MenuItem>
                                        <MenuItem value='Stationery'>Stationery</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item sx={{ width: '2%' }} />
                            <Grid item sx={{ width: '49%' }}>
                                {/* Status */}
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="Status">Status</InputLabel>
                                    <Select name="status" label="Status" defaultValue={editing?.status} required>
                                        <MenuItem value='1'>Done</MenuItem>
                                        <MenuItem value='0'>Doing</MenuItem>
                                        <MenuItem value='-1'>Todo</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Grid container sx={{ mt: 1.3 }}>
                            <Grid item sx={{ width: '24%' }}>
                                {/* Current */}
                                <FormControl fullWidth>
                                    <TextField
                                        name="current"
                                        label="Current"
                                        defaultValue={editing?.current}
                                        type="number"
                                        InputProps={{ inputProps: { min: 0 } }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item sx={{ width: '1%' }}></Grid>
                            <Grid item sx={{ width: '24%' }}>
                                {/* Total */}
                                <FormControl fullWidth>
                                    <TextField
                                        name="total"
                                        label="Total"
                                        defaultValue={editing?.total}
                                        type="number"
                                        InputProps={{ inputProps: { min: 1 } }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item sx={{ width: '2%' }} />
                            <Grid item sx={{ width: '49%' }}>
                                {/* Price */}
                                <FormControl fullWidth>
                                    <TextField
                                        name="price"
                                        label="Price"
                                        defaultValue={editing?.price}
                                        type="number"
                                        InputProps={{ inputProps: { min: 0 } }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>

                        <DialogActions sx={{ mt: 1, mb: -1, mr: -1 }}>
                            <Button color="secondary" onClick={handleEditMarkingDialogClose}>Cancel</Button>
                            <Button type="submit" color="success">Update</Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
        </Box>
    )
}