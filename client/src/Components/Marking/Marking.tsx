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
import { ListItemIcon } from '@mui/material'
import { Toolbar } from '@mui/material'
import { Button } from '@mui/material'
import { Dialog } from '@mui/material'
import { DialogActions } from '@mui/material'
import { DialogContent } from '@mui/material'
import { DialogTitle } from '@mui/material'
import { Divider } from '@mui/material'
import { FormControl } from '@mui/material'
import { InputLabel } from '@mui/material'
import { MenuItem } from '@mui/material'
import { Select } from '@mui/material'
import { TextField } from '@mui/material'
import { Grid } from '@mui/material'
import { AppBar } from '@mui/material'
import { ToggleButton } from '@mui/material'
import { ToggleButtonGroup } from '@mui/material'
import { Link } from '@mui/material'
import { Menu } from '@mui/material'
import { Typography } from '@mui/material'
import { formatJPY } from '../../utils'

// Icons
import MenuIcon from '@mui/icons-material/Menu'
import { MarkingData } from '../../interfaces'
import { TodoBadge } from '../Common/Badges'
import { DoingBadge } from '../Common/Badges'
import { DoneBadge } from '../Common/Badges'
import PostAddIcon from '@mui/icons-material/PostAdd'
import AnimeIcon from '@mui/icons-material/MotionPhotosAuto'
import DramaIcon from '@mui/icons-material/LiveTv';
import GameIcon from '@mui/icons-material/SportsEsports'
import GunplaIcon from '@mui/icons-material/PrecisionManufacturing'
import BookIcon from '@mui/icons-material/AutoStories'
import LessonIcon from '@mui/icons-material/Description'
import MovieIcon from '@mui/icons-material/LocalMovies'
import StationeryIcon from '@mui/icons-material/DesignServices'
import TodoIcon from '@mui/icons-material/SyncLock'
import DoingIcon from '@mui/icons-material/Sync'
import DoneIcon from '@mui/icons-material/PublishedWithChanges'
import { purple } from '@mui/material/colors'
import { colorByStatus } from '../Common/Colors'


export default function Marking() {
    // Status
    const [markings, setMarkings] = useState<MarkingData[]>([])
    const [status, setStatus] = useState("Doing")
    const [doneCnt, setDoneCnt] = useState(0)
    const [doingCnt, setDoingCnt] = useState(0)
    const [todoCnt, setTodoCnt] = useState(0)
    const [type, setType] = useState("All")
    const [editing, setEditing] = useState<MarkingData>()

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)

    const handleClick = (event: React.MouseEvent<HTMLElement>) => { setAnchorEl(event.currentTarget) }
    const handleClose = () => { setAnchorEl(null) }

    // [Handler]
    const handleTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setType(event.target.value as string);
    }

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
        fetch(`/api/marking/query?type=${type}&status=${status}`)
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
    
    const handleDeleteMarking = (id: String) => {
        fetch(`/api/marking/delete?id=${id}`, {
            method: "POST",
        })
            .then(() => {
                handleEditMarkingDialogClose()
                refresh()
            })
    }

    function refresh() {
        fetchMarkings()
        fetchBadges()
    }

    function TypeToggleButtons() {
        const handleChange = (
            event: React.MouseEvent<HTMLElement>,
            newValue: string,
        ) => {
            if (newValue === null) {
                setType("All")
            } else {
                setType(newValue)
            }
        }

        return (
            <ToggleButtonGroup
                value={type}
                exclusive
                onChange={handleChange}
            >
                <ToggleButton value="Anime"><AnimeIcon /></ToggleButton>
                <ToggleButton value="Book"><BookIcon /></ToggleButton>
                <ToggleButton value="Drama"><DramaIcon /></ToggleButton>
                <ToggleButton value="Game"><GameIcon /></ToggleButton>
                <ToggleButton value="Lesson"><LessonIcon /></ToggleButton>
                <ToggleButton value="Gunpla"><GunplaIcon /></ToggleButton>
                <ToggleButton value="Movie"><MovieIcon /></ToggleButton>
                <ToggleButton value="Stationery"><StationeryIcon /></ToggleButton>
            </ToggleButtonGroup>
        )
    }

    function StatusToggleButtons() {
        const handleChange = (
            event: React.MouseEvent<HTMLElement>,
            newValue: string,
        ) => {
            if (newValue === null) {
                return
            } else {
                setStatus(newValue)
            }
        }

        return (
            <ToggleButtonGroup
                exclusive
                value={status}
                onChange={handleChange}
            >
                <ToggleButton value="Done">
                    {DoneBadge(doneCnt)}
                </ToggleButton>
                <ToggleButton value="Doing">
                    {DoingBadge(doingCnt)}
                </ToggleButton>
                <ToggleButton value="Todo">
                    {TodoBadge(todoCnt)}
                </ToggleButton>
            </ToggleButtonGroup>
        )
    }

    function TypeIcon(type: string) {
        switch (type) {
            case "Anime":
                return <AnimeIcon style={{ color: colorByStatus(status) }}/>
            case "Book":
                return <BookIcon style={{ color: colorByStatus(status) }}/>
            case "Drama":
                return <DramaIcon style={{ color: colorByStatus(status) }}/>
            case "Game":
                return <GameIcon style={{ color: colorByStatus(status) }}/>
            case "Lesson":
                return <LessonIcon style={{ color: colorByStatus(status) }}/>
            case "Gunpla":
                return <GunplaIcon style={{ color: colorByStatus(status) }}/>
            case "Movie":
                return <MovieIcon style={{ color: colorByStatus(status) }}/>
            case "Stationery":
                return <StationeryIcon style={{ color: colorByStatus(status) }}/>
            default:
                return <></>
        }
    }

    function Row(props: { row: MarkingData }) {
        const { row } = props
        const [open, setOpen] = React.useState(false)

        return (
            <Fragment>
                <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell align="center">{TypeIcon(row.type)}</TableCell>
                    <TableCell component="th" scope="row" align="left">
                        <Link component="button" onClick={() => { fetchMarkingById(row.id) }}>
                            {row.title}
                        </Link>
                    </TableCell>
                    <TableCell align="right">{row.type}</TableCell>
                    <TableCell align="right">{row.by}</TableCell>
                    <TableCell align="right">{row.year}</TableCell>
                    <TableCell align="right">{formatJPY(row.price)}</TableCell>
                    <TableCell align="right">{row.progress}</TableCell>
                    <TableCell align="right">{row.percentage}</TableCell>
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
    }, [type, status])

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

                            <Menu
                                anchorEl={anchorEl}
                                id="account-menu"
                                open={open}
                                onClose={handleClose}
                                onClick={handleClose}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            >
                                <MenuItem onClick={handleCreateMarkingDialogOpen}>
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
                                            color: purple[100]
                                        }}
                                    >
                                        Create Marking
                                    </Typography>
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Toolbar>
                </AppBar>
            </Box>

            <AppBar position='static'>
                <Toolbar>
                    {
                        pcScreen ?
                            <Grid container>
                                <Grid item>
                                    <StatusToggleButtons />
                                </Grid>
                                <Grid item sx={{ pl: 1 }}></Grid>
                                <Grid item>
                                    <TypeToggleButtons />
                                </Grid>
                            </Grid>
                        :
                            <Grid container>
                                <Grid item sx={{ pt: 1 }} xs={12}>
                                    <StatusToggleButtons />
                                </Grid>
                                <Grid item sx={{ pt: 1, pb: 1}} xs={12}>
                                    <TypeToggleButtons />
                                </Grid>
                            </Grid>
                    }
                    
                </Toolbar>
            </AppBar>

            <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" style={{ fontWeight: 'bold' }}></TableCell>
                            <TableCell align="left" style={{ fontWeight: 'bold' }}>Title</TableCell>
                            <TableCell align="right" style={{ fontWeight: 'bold' }}>Type</TableCell>
                            <TableCell align="right" style={{ fontWeight: 'bold' }}>By</TableCell>
                            <TableCell align="right" style={{ fontWeight: 'bold' }}>Year</TableCell>
                            <TableCell align="right" style={{ fontWeight: 'bold' }}>Price</TableCell>
                            <TableCell align="right" style={{ fontWeight: 'bold' }}>Progress</TableCell>
                            <TableCell align="right" style={{ fontWeight: 'bold' }}>%</TableCell>
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
                                        <MenuItem value='Anime'>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <AnimeIcon />
                                                <div>&nbsp;Anime</div>
                                            </div>
                                        </MenuItem>

                                        <MenuItem value='Book'>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <BookIcon />
                                                <div>&nbsp;Book</div>
                                            </div>
                                        </MenuItem>

                                        <MenuItem value='Drama'>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <DramaIcon />
                                                <div>&nbsp;Drama</div>
                                            </div>
                                        </MenuItem>

                                        <MenuItem value='Game'>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <GameIcon />
                                                <div>&nbsp;Game</div>
                                            </div>
                                        </MenuItem>

                                        <MenuItem value='Gunpla'>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <GunplaIcon />
                                                <div>&nbsp;Gunpla</div>
                                            </div>
                                        </MenuItem>

                                        <MenuItem value='Lesson'>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <LessonIcon />
                                                <div>&nbsp;Lesson</div>
                                            </div>
                                        </MenuItem>

                                        <MenuItem value='Movie'>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <MovieIcon />
                                                <div>&nbsp;Movie</div>
                                            </div>
                                        </MenuItem>

                                        <MenuItem value='Stationery'>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <StationeryIcon />
                                                <div>&nbsp;Stationery</div>
                                            </div>
                                        </MenuItem>
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
                                    <MenuItem value='Anime'>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <AnimeIcon />
                                                <div>&nbsp;Anime</div>
                                            </div>
                                        </MenuItem>

                                        <MenuItem value='Book'>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <BookIcon />
                                                <div>&nbsp;Book</div>
                                            </div>
                                        </MenuItem>

                                        <MenuItem value='Drama'>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <DramaIcon />
                                                <div>&nbsp;Drama</div>
                                            </div>
                                        </MenuItem>

                                        <MenuItem value='Game'>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <GameIcon />
                                                <div>&nbsp;Game</div>
                                            </div>
                                        </MenuItem>

                                        <MenuItem value='Gunpla'>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <GunplaIcon />
                                                <div>&nbsp;Gunpla</div>
                                            </div>
                                        </MenuItem>

                                        <MenuItem value='Lesson'>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <LessonIcon />
                                                <div>&nbsp;Lesson</div>
                                            </div>
                                        </MenuItem>

                                        <MenuItem value='Movie'>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <MovieIcon />
                                                <div>&nbsp;Movie</div>
                                            </div>
                                        </MenuItem>

                                        <MenuItem value='Stationery'>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <StationeryIcon />
                                                <div>&nbsp;Stationery</div>
                                            </div>
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item sx={{ width: '2%' }} />
                            <Grid item sx={{ width: '49%' }}>
                                {/* Status */}
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="Status">Status</InputLabel>
                                    <Select name="status" label="Status" defaultValue={editing?.status} required>
                                        <MenuItem value='Done'>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <DoneIcon />
                                                <div>&nbsp;Done</div>
                                            </div>
                                        </MenuItem>
                                        <MenuItem value='Doing'>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <DoingIcon />
                                                <div>&nbsp;Doing</div>
                                            </div>
                                        </MenuItem>
                                        <MenuItem value='Todo'>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <TodoIcon />
                                                <div>&nbsp;Todo</div>
                                            </div>
                                        </MenuItem>
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

                        <DialogActions style={{ justifyContent: "space-between" }} sx={{ mt: 1, mb: -1, ml: -1, mr: -1 }}>
                            <Button color="error" onClick={e => handleDeleteMarking(editing!!.id)}>Delete</Button>
                            <Box>
                                <Button color="secondary" onClick={handleEditMarkingDialogClose}>Cancel</Button>
                                <Button type="submit" color="success">Update</Button>
                            </Box>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
        </Box>
    )
}