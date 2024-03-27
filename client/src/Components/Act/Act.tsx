import React, { FormEvent, Fragment, useEffect, useState } from "react"
import dayjs, { Dayjs } from 'dayjs'
import { AppBar, Divider, Link, ListItemIcon, Menu, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs } from '@mui/material'
import { DialogActions } from '@mui/material'
import { Tab } from '@mui/material'
import { Badge } from '@mui/material'
import { Box } from '@mui/material'
import { FormControl } from '@mui/material'
import { Grid } from '@mui/material'
import { IconButton } from '@mui/material'
import { InputLabel } from '@mui/material'
import { MenuItem } from '@mui/material'
import { Select } from '@mui/material'
import { Tooltip } from '@mui/material'
import { Toolbar } from '@mui/material'
import { Typography } from '@mui/material'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from "@mui/x-date-pickers"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { TabContext } from "@mui/lab"
import { TabPanel } from "@mui/lab"
import { DeepColorByType, LightColorByType } from "../Common/Colors"
import useMediaQuery from '@mui/material/useMediaQuery'
import { SelectChangeEvent } from '@mui/material/Select'

// Colors
import { pink } from '@mui/material/colors'
import { purple } from '@mui/material/colors'
import { green } from '@mui/material/colors'
import { blue } from '@mui/material/colors'
import { yellow } from '@mui/material/colors'
import { red } from '@mui/material/colors'

// Icons
import MenuIcon from '@mui/icons-material/Menu'
import PostAddIcon from '@mui/icons-material/PostAdd'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import CalendarWeekIcon from '@mui/icons-material/DateRange'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import CalendarYearIcon from '@mui/icons-material/EventNote'
import TimerIcon from '@mui/icons-material/Timer'
import TimelapseIcon from '@mui/icons-material/Timelapse'
import TitleIcon from '@mui/icons-material/Title'
import CheckBoxBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxCheckedIcon from '@mui/icons-material/CheckBox'
import GamingIcon from '@mui/icons-material/SportsEsports'
import ProgrammingIcon from '@mui/icons-material/Terminal'
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft'
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import StartTimeIcon from '@mui/icons-material/HourglassTop'
import EndTimeIcon from '@mui/icons-material/HourglassBottom'
import { ActData } from "../../interfaces"
import { ActSummaryData } from "../../interfaces"
import { StopwatchData } from "../../interfaces"
import { GameData } from "../../interfaces"
import { MarkingData } from "../../interfaces"
import { ProjectData } from "../../interfaces"
import { formatDuration, formatTime } from "../../utils"
import { Create } from "@mui/icons-material"

export default function Act() {
    // [State]
    const [acts, setActs] = useState<ActData[]>([])
    const [actSummary, setActSummary] = useState<ActSummaryData[]>([])
    const [gaming, setGaming] = useState<GameData[]>([])
    const [programming, setProgramming] = useState<ProjectData[]>([])
    const [stopwatching, setStopwatching] = useState<StopwatchData>()

    // Activity Duration Tabs: ['Day', 'Week', 'Month', 'Year']
    const [tabDuration, setTabDuration] = useState("Day")
    const changeTabActDuration = (event: React.SyntheticEvent, dur: string) => {
        setTabDuration(dur)
    }

    const weekdays = (): string => {
        dayjs.locale('en')
        const today = dayjs(date)
        const startOfWeek = today.startOf('week').add(1, 'day').format('MMM D')
        const endOfWeek = today.endOf('week').add(1, 'day').format('MMM D')
        return startOfWeek + " ~ " + endOfWeek + ", " + today.format('YYYY')
    }

    // Activity Type Tabs: ['All', 'Gaming', 'programming']
    const [tabType, setTabType] = useState("All")
    const changeTabActType = (event: React.SyntheticEvent, typ: string) => {
        setTabType(typ)
    }

    // Activity Data Style Tabs: ['Grid', 'Timeline', 'Pie', 'Stack']
    const [tabDataStyle, setTabDataStyle] = useState("Grid")
    const changeTabDataStyle = (event: React.SyntheticEvent, style: string) => {
        setTabDataStyle(style)
    }

    const pcScreen = useMediaQuery('(min-width:600px)')
    function matchScreen(pc: number, mobile: number): number {
        if (pcScreen === true) {
            return pc
        } else {
            return mobile
        }
    }

    const [dialogTargetId, setDialogTargetId] = useState("")
    const [dialogTargetValue, setDialogTargetValue] = useState("")

    const handleDialogTargetIdChange = (event: SelectChangeEvent<unknown>) => {
        const id = event.target.value as string
        setDialogTargetId(id)
    }

    const handleDialogTargetValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDialogTargetValue(event.target.value)
    }

    const [date, setDate] = useState<Dayjs | null>(dayjs(new Date()))
    const [toDelAct, setToDelAct] = useState<ActData>()
    const [tempDate, setTempDate] = useState<Dayjs | null>(date)

    const [createActDate, setCreateActDate] = useState<Dayjs | null>(dayjs(new Date()))
    const [createActStartTime, setCreateActStartTime] = useState<Dayjs | null>(dayjs(new Date()))
    const [createActEndTime, setCreateActEndTime] = useState<Dayjs | null>(dayjs(new Date()))

    const handleChangeTempDate = (newValue: Dayjs | null) => { setTempDate(newValue) }
    const handleChangeTempDateSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setDate(tempDate)
        setOpenCalendar(false)
    }

    // New act dialog
    const [openCreateActDialog, setOpenCreateActDialog] = useState(false)
    const handleCreateActDialogOpen = () => {
        fetchTitles()
        setOpenCreateActDialog(true)
    }
    const handleCreateActDialogClose = () => {
        setOpenCreateActDialog(false)
        setDialogFormType("Gaming")
    }

    function fetchTitles() {
        fetch("/api/act/titles", { method: "GET", })
            .then(resp => resp.json())
            .then(data => {
                if (data != null) {
                    setGaming(data["gaming"])
                    setProgramming(data["programming"])
                }
            })
    }

    // Calender Dialog
    const [openCalendar, setOpenCalendar] = useState(false)
    const handleCalendarOpen = () => { setOpenCalendar(true) }
    const handleCalendarClose = () => { setOpenCalendar(false) }

    // Stopwatch Dialog
    const [dialogFormType, setDialogFormType] = useState("Gaming")
    const [stopwatch, setStopwatch] = useState<Dayjs | null>(dayjs(new Date()))
    const [openStopwatch, setOpenStopwatch] = useState(false)
    const handleStopwatchOpen = () => {
        fetchTitles()
        setOpenStopwatch(true)
    }
    const handleStopwatchClose = () => {
        fetchData()
        setStopwatch(stopwatch)
        setOpenStopwatch(false)
        setDialogFormType('Gaming')
        setDialogTargetId('')
        setDialogTargetValue('')
    }

    // Delete act dialog
    const [openDeleteAct, setOpenDeleteAct] = useState(false)
    const handleDeleteActOpen = (act: ActData) => {
        setToDelAct(act)
        setOpenDeleteAct(true)
    }

    // Functions
    const handleDeleteActClose = () => { setOpenDeleteAct(false) }

    const previousDay = () => { setDate(dayjs(date).add(-1, 'day')) }
    const nextDay = () => { setDate(dayjs(date).add(1, 'day')) }
    const previousWeek = () => { setDate(dayjs(date).add(-1, 'week')) }
    const nextWeek = () => { setDate(dayjs(date).add(1, 'week')) }
    const previousMonth = () => { setDate(dayjs(date).add(-1, 'month')) }
    const nextMonth = () => { setDate(dayjs(date).add(1, 'month')) }
    const previousYear = () => { setDate(dayjs(date).add(-1, 'year')) }
    const nextYear = () => { setDate(dayjs(date).add(1, 'year')) }

    const handleTerminateStopwatch = () => {
        fetch(`/api/act/stopwatch/terminate`, {
            method: "POST",
        }).then(() => {
            handleStopwatchClose()
        })
    }

    const handleStopStopwatchSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        fetch("/api/act/stopwatch/stop", {
            method: "POST",
        })
            .then(resp => resp.json())
            .then(data => {
                handleStopwatchClose()
            })
    }

    function fetchData() {
        fetchActs()
        fetchTitles()
    }

    function fetchActs() {
        fetch(`/api/act/query?date=${dayjs(date).format('YYYYMMDD')}&type=${tabType}&duration=${tabDuration}`)
            .then(resp => resp.json())
            .then(data => {
                setActs(data['acts'])
                setActSummary(data['summary'])
                setStopwatching(data['stopwatching'])
            })
    }

    function reset() {
        setTempDate(dayjs(new Date()))
    }

    const handleDeleteActSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        fetch("/api/act/delete", {
            method: "POST",
            credentials: 'same-origin',
            body: JSON.stringify(toDelAct),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(() => {
                handleDeleteActClose()
                fetchData()
                reset()
            })
            .catch(error => console.error("Error:", error))
    }

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)
    const handleClick = (event: React.MouseEvent<HTMLElement>) => { setAnchorEl(event.currentTarget) }
    const handleClose = () => { setAnchorEl(null) }

    // Temp
    const [value, setValue] = React.useState('one')
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue)
    }

    useEffect(() => {
        fetchData()
    }, [date, tabDuration, tabType])

    return (
        <Box
            sx={{
                ml: matchScreen(4, 1),
                mr: matchScreen(4, 1),
                p: 1,
                mb: 2,
                border: 2,
                borderRadius: 1,
                borderColor: 'divider'
            }}
        >
            {/* Top Menu */}
            <Grid container sx={{ width: '50%' }}>
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
                                        <Badge color="success" variant="dot" invisible={stopwatching === null}>
                                            <MenuIcon
                                                sx={{
                                                    fontSize: 32,
                                                    color: purple[100],
                                                    "&:hover": { color: purple[200], fontSize: 35 }
                                                }}
                                            />
                                        </Badge>
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
                                    <MenuItem onClick={handleCreateActDialogOpen}>
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
                                            Create Activity
                                        </Typography>
                                    </MenuItem>
                                    <MenuItem onClick={handleStopwatchOpen}>
                                        <ListItemIcon>
                                            <Badge color="success" badgeContent={1} invisible={stopwatching === null}>
                                                <TimerIcon
                                                    sx={{
                                                        fontSize: 28,
                                                        color: purple[100],
                                                        "&:hover": { color: purple[200] }
                                                    }}
                                                />
                                            </Badge>
                                        </ListItemIcon>
                                        <Typography
                                            sx={{
                                                pl: 1,
                                                color: purple[100]
                                            }}
                                        >
                                            Stopwatch
                                        </Typography>
                                    </MenuItem>
                                </Menu>
                            </Toolbar>
                        </AppBar>
                    </Box>
                </Grid>
            </Grid>

            <TabContext value={tabDuration}>
                {/* Duration Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        indicatorColor="secondary"
                        value={tabDuration}
                        onChange={changeTabActDuration}
                        centered
                    >
                        <Tab icon={<CalendarTodayIcon sx={{ fontSize: 30 }} />} value="Day" />
                        <Tab icon={<CalendarWeekIcon sx={{ fontSize: 30 }} />} value="Week" />
                        <Tab icon={<CalendarMonthIcon sx={{ fontSize: 30 }} />} value="Month" />
                        <Tab icon={<CalendarYearIcon sx={{ fontSize: 30 }} />} value="Year" />
                    </Tabs>
                </Box>

                <Grid container spacing={2}>
                    {/* Act Type Tabs */}
                    {pcScreen === true ?
                        <Grid
                            item
                            style={{ width: '100px' }}
                            sx={{ ml: -2, mt: 5, borderRight: 1, borderColor: 'divider' }}
                        >
                            <Tabs
                                variant="fullWidth"
                                orientation="vertical"
                                TabIndicatorProps={{
                                    style: { background: LightColorByType(tabType) }
                                }}
                                value={tabType}
                                onChange={changeTabActType}
                            >
                                <Tab
                                    value="All"
                                    icon={
                                        tabType === 'All'
                                            ? <CheckBoxCheckedIcon sx={{ fontSize: 30, color: LightColorByType('All') }} />
                                            : <CheckBoxBlankIcon sx={{ fontSize: 30 }} />
                                    }
                                />
                                <Tab
                                    value="Gaming"
                                    icon={<GamingIcon sx={{ fontSize: 30, color: tabType === 'Gaming' ? LightColorByType('Gaming') : 'disabled' }} />}
                                />
                                <Tab
                                    value="Programming"
                                    icon={<ProgrammingIcon sx={{ fontSize: 30, color: tabType === 'Programming' ? LightColorByType('Programming') : 'disabled' }} />}

                                />
                            </Tabs>
                        </Grid>
                        : <></>
                    }

                    <Grid item xs={matchScreen(10, 12)}>
                        <TabPanel value="Day">
                            {/* Act Data */}
                            <Grid
                                sx={{
                                    ml: pcScreen === true ? 3 : 0,
                                    mr: pcScreen === true ? 3 : 0
                                }}
                                display="flex"
                                justifyContent="center"
                            >
                                <TableContainer>
                                    <Toolbar>
                                        <Tooltip title="Previous">
                                            <IconButton onClick={previousDay}>
                                                <ArrowCircleLeftIcon />
                                            </IconButton>
                                        </Tooltip>

                                        <Grid container display="flex" justifyContent="center" alignItems="center">
                                            <Link href="#" variant="body1" underline="hover" onClick={handleCalendarOpen}>
                                                {dayjs(date).format('MMMM DD (ddd) YYYY')}
                                            </Link>
                                        </Grid>

                                        <Tooltip title="Next">
                                            <IconButton onClick={nextDay}>
                                                <ArrowCircleRightIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Toolbar>

                                    <Table size="small">
                                        <TableHead>
                                            <TableRow sx={{ borderTop: 1 }}>
                                                <TableCell><FormatListBulletedIcon style={{ verticalAlign: 'middle' }} /></TableCell>
                                                <TableCell><StartTimeIcon style={{ verticalAlign: 'middle' }} /></TableCell>
                                                <TableCell><EndTimeIcon style={{ verticalAlign: 'middle' }} /></TableCell>
                                                <TableCell><TimelapseIcon style={{ verticalAlign: 'middle' }} /></TableCell>
                                                <TableCell><TitleIcon style={{ verticalAlign: 'middle' }} /></TableCell>
                                            </TableRow>
                                        </TableHead>

                                        <TableBody>
                                            {(acts)?.map(
                                                (act: ActData) => {
                                                    return (
                                                        <TableRow key={act.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                            <TableCell>
                                                                {DetailTypeIcon(act)}
                                                            </TableCell>

                                                            <TableCell align="left">
                                                                <Typography
                                                                    style={{ verticalAlign: 'middle' }}
                                                                    color={LightColorByType(act.type)}
                                                                >
                                                                    {formatTime(act.start)}
                                                                </Typography>
                                                            </TableCell>

                                                            <TableCell align="left">
                                                                <Typography
                                                                    style={{ verticalAlign: 'middle' }}
                                                                    color={LightColorByType(act.type)}
                                                                >
                                                                    {formatTime(act.end)}
                                                                </Typography>
                                                            </TableCell>

                                                            <TableCell align="left">
                                                                <Typography
                                                                    style={{ verticalAlign: 'middle' }}
                                                                    color={LightColorByType(act.type)}
                                                                >
                                                                    {formatDuration(act.duration)}
                                                                </Typography>
                                                            </TableCell>

                                                            <TableCell align="left">
                                                                <Typography
                                                                    style={{ verticalAlign: 'middle' }}
                                                                    color={LightColorByType(act.type)}
                                                                >
                                                                    {act.title}
                                                                </Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                }
                                            )}

                                            {(actSummary)?.map(
                                                (summ: ActSummaryData) => {
                                                    return (
                                                        <TableRow>
                                                            <TableCell colSpan={4} align="right">
                                                                {SummaryTypeIcon(summ.type)}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography
                                                                    sx={{ fontWeight: 'bold' }}
                                                                    style={{ verticalAlign: 'middle' }}
                                                                    color={DeepColorByType(summ.type)}
                                                                >
                                                                    {summ.hour === 0 ? '' : summ.hour + 'h '}
                                                                    {summ.min === 0 ? '' : summ.min + 'm'}
                                                                </Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </TabPanel>

                        {/* Week Tab */}
                        <TabPanel value="Week">
                            <Grid display="flex" justifyContent="center">
                                <TableContainer>
                                    <Toolbar>
                                        <Tooltip title="Previous week">
                                            <IconButton onClick={previousWeek}>
                                                <ArrowCircleLeftIcon />
                                            </IconButton>
                                        </Tooltip>

                                        <Grid
                                            container
                                            spacing={0}
                                            direction="row"
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <Grid item>
                                                <Grid container direction="row" alignItems="center">
                                                    <Link href="#" variant="body1" underline="hover" onClick={handleCalendarOpen}>
                                                        {weekdays()}
                                                    </Link>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <Tooltip title="Next week">
                                            <IconButton onClick={nextWeek}>
                                                <ArrowCircleRightIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Toolbar>

                                    <Table size="small">
                                        <TableHead>
                                            <TableRow sx={{ borderTop: 1 }}>
                                                <TableCell>
                                                    <FormatListBulletedIcon style={{ verticalAlign: 'middle' }} />
                                                </TableCell>
                                                <TableCell>
                                                    <TimelapseIcon style={{ verticalAlign: 'middle' }} />
                                                </TableCell>
                                                <TableCell>
                                                    <TitleIcon style={{ verticalAlign: 'middle' }} />
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>

                                        <TableBody>
                                            {(acts)?.map(
                                                (act: ActData) => {
                                                    return (
                                                        <TableRow
                                                            key={act.id}
                                                            sx={{ '&:last-child td, &:last-child th': { border: 0, fontSize: 15 } }}
                                                        >
                                                            <TableCell>
                                                                {DetailTypeIcon(act)}
                                                            </TableCell>

                                                            <TableCell>
                                                                <Typography style={{ verticalAlign: 'middle' }} color={LightColorByType(act.type)}>
                                                                    {formatDuration(act.duration)}
                                                                </Typography>
                                                            </TableCell>

                                                            <TableCell>
                                                                <Typography style={{ verticalAlign: 'middle' }} color={LightColorByType(act.type)}>
                                                                    {act.title}
                                                                </Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                }
                                            )}

                                            {(actSummary)?.map(
                                                (summ: ActSummaryData) => {
                                                    return (
                                                        <TableRow>
                                                            <TableCell colSpan={2} align="right">
                                                                {SummaryTypeIcon(summ.type)}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography
                                                                    sx={{ fontWeight: 'bold' }}
                                                                    style={{ verticalAlign: 'middle' }}
                                                                    color={DeepColorByType(summ.type)}
                                                                >
                                                                    {summ.hour === 0 ? '' : summ.hour + 'h '}
                                                                    {summ.min === 0 ? '' : summ.min + 'm'}
                                                                </Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                }
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </TabPanel>

                        {/* Month Tab */}
                        <TabPanel value="Month">
                            <Grid
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                            >
                                <TableContainer>
                                    <Toolbar>
                                        <Tooltip title="Previous month">
                                            <IconButton onClick={previousMonth}>
                                                <ArrowCircleLeftIcon />
                                            </IconButton>
                                        </Tooltip>

                                        <Grid
                                            container
                                            spacing={0}
                                            direction="row"
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <Grid item>
                                                <Grid container direction="row" alignItems="center">
                                                    <Link href="#" variant="body1" underline="hover" onClick={handleCalendarOpen}>
                                                        {dayjs(date).format('MMMM YYYY')}
                                                    </Link>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <Tooltip title="Next month">
                                            <IconButton onClick={nextMonth}>
                                                <ArrowCircleRightIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Toolbar>

                                    <Table size="small">
                                        <TableHead>
                                            <TableRow sx={{ borderTop: 1 }}>
                                                <TableCell>
                                                    <FormatListBulletedIcon style={{ verticalAlign: 'middle' }} />
                                                </TableCell>
                                                <TableCell>
                                                    <TimelapseIcon style={{ verticalAlign: 'middle' }} />
                                                </TableCell>
                                                <TableCell>
                                                    <TitleIcon style={{ verticalAlign: 'middle' }} />
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>

                                        <TableBody>
                                            {(acts)?.map(
                                                (act: ActData) => {
                                                    return (
                                                        <TableRow
                                                            key={act.id}
                                                            sx={{ '&:last-child td, &:last-child th': { border: 0, fontSize: 15 } }}
                                                        >
                                                            <TableCell>
                                                                {DetailTypeIcon(act)}
                                                            </TableCell>

                                                            <TableCell>
                                                                <Typography style={{ verticalAlign: 'middle' }} color={LightColorByType(act.type)}>
                                                                    {formatDuration(act.duration)}
                                                                </Typography>
                                                            </TableCell>

                                                            <TableCell>
                                                                <Typography style={{ verticalAlign: 'middle' }} color={LightColorByType(act.type)}>
                                                                    {act.title}
                                                                </Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                }
                                            )}

                                            {(actSummary)?.map(
                                                (summ: ActSummaryData) => {
                                                    return (
                                                        <TableRow>
                                                            <TableCell colSpan={2} align="right">
                                                                {SummaryTypeIcon(summ.type)}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography
                                                                    sx={{ fontWeight: 'bold' }}
                                                                    style={{ verticalAlign: 'middle' }}
                                                                    color={DeepColorByType(summ.type)}
                                                                >
                                                                    {summ.hour === 0 ? '' : summ.hour + 'h '}
                                                                    {summ.min === 0 ? '' : summ.min + 'm'}
                                                                </Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                }
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </TabPanel>

                        {/* Year Tab */}
                        <TabPanel value="Year">
                            <Grid
                                display="flex"
                                justifyContent="center"
                            >
                                <TableContainer>
                                    <Toolbar>
                                        <Tooltip title="Previous year">
                                            <IconButton onClick={previousYear}>
                                                <ArrowCircleLeftIcon />
                                            </IconButton>
                                        </Tooltip>

                                        <Grid
                                            container
                                            spacing={0}
                                            direction="row"
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <Grid item>
                                                <Grid container direction="row" alignItems="center">
                                                    <Link href="#" variant="body1" underline="hover" onClick={handleCalendarOpen}>
                                                        {dayjs(date).format('YYYY')}
                                                    </Link>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <Tooltip title="Next year">
                                            <IconButton onClick={nextYear}>
                                                <ArrowCircleRightIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Toolbar>

                                    <Table size="small">
                                        <TableHead>
                                            <TableRow sx={{ borderTop: 1 }}>
                                                <TableCell>
                                                    <FormatListBulletedIcon style={{ verticalAlign: 'middle' }} />
                                                </TableCell>
                                                <TableCell>
                                                    <TimelapseIcon style={{ verticalAlign: 'middle' }} />
                                                </TableCell>
                                                <TableCell>
                                                    <TitleIcon style={{ verticalAlign: 'middle' }} />
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>

                                        <TableBody>
                                            {(acts)?.map(
                                                (act: ActData) => {
                                                    return (
                                                        <TableRow
                                                            key={act.id}
                                                            sx={{ '&:last-child td, &:last-child th': { border: 0, fontSize: 15 } }}
                                                        >
                                                            <TableCell>
                                                                {DetailTypeIcon(act)}
                                                            </TableCell>

                                                            <TableCell>
                                                                <Typography style={{ verticalAlign: 'middle' }} color={LightColorByType(act.type)}>
                                                                    {formatDuration(act.duration)}
                                                                </Typography>
                                                            </TableCell>

                                                            <TableCell>
                                                                <Typography style={{ verticalAlign: 'middle' }} color={LightColorByType(act.type)}>
                                                                    {act.title}
                                                                </Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                }
                                            )}

                                            {(actSummary)?.map(
                                                (detail: any) => {
                                                    return (
                                                        <TableRow>
                                                            <TableCell colSpan={2} align="right">
                                                                {SummaryTypeIcon(detail.type)}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography
                                                                    sx={{ fontWeight: 'bold' }}
                                                                    style={{ verticalAlign: 'middle' }}
                                                                    color={DeepColorByType(detail.type)}
                                                                >
                                                                    {detail.hour === 0 ? '' : detail.hour + 'h '}
                                                                    {detail.min === 0 ? '' : detail.min + 'm'}
                                                                </Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                }
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </TabPanel>
                    </Grid>

                    {pcScreen === true ?
                        <Grid item xs={1}>
                            {/* TODO Act Data Style Tabs */}
                            {/* <Grid item xs={1} sx={{ ml: -3, borderRight: 1, borderColor: 'divider' }}>
                                    <JoyTabs
                                        variant="outlined"
                                        orientation='vertical'
                                        aria-label="Placement indicator tabs"
                                        defaultValue="a"
                                        sx={{
                                            gridColumn: '1/-1',
                                            height: 180,
                                            flexDirection: 'row-reverse',
                                        }}
                                    >
                                        <JoyTabList underlinePlacement='left'>
                                            <JoyTab indicatorPlacement='left' value="a">
                                                Tab A
                                            </JoyTab>
                                            <JoyTab indicatorPlacement='left' value="b">
                                                Tab B
                                            </JoyTab>
                                            <JoyTab indicatorPlacement='left' value="c">
                                                Tab C
                                            </JoyTab>
                                        </JoyTabList>
                                        <TabPanel value="a">Content of Tab A</TabPanel>
                                        <TabPanel value="b">Content of Tab B</TabPanel>
                                        <TabPanel value="c">Content of Tab C</TabPanel>
                                    </JoyTabs>
                                </Grid> */}
                        </Grid>
                        : <></>
                    }

                </Grid>
            </TabContext>

            {/* [Pick Date Dialog] */}
            <Dialog
                open={openCalendar}
                onClose={handleCalendarClose}
            >
                <DialogTitle>Select a date</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleChangeTempDateSubmit}>
                        <FormControl>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DesktopDatePicker
                                    inputFormat={"MM/DD/YYYY"}
                                    value={tempDate}
                                    onChange={handleChangeTempDate}
                                    renderInput={(params) =>
                                        <TextField {...params} />
                                    }
                                />
                            </LocalizationProvider>

                            <DialogActions sx={{ mt: 1, mb: -1, mr: -1 }}>
                                <Button color="secondary" onClick={handleCalendarClose}>Cancel</Button>
                                <Button type="submit" color="success">Select</Button>
                            </DialogActions>
                        </FormControl>
                    </form>
                </DialogContent>
            </Dialog>

            {/* [Create Act Dialog] */}
            <Dialog
                maxWidth="sm"
                open={openCreateActDialog}
                onClose={handleCreateActDialogClose}
            >
                <DialogTitle align="center">Create an Activity</DialogTitle>
                <Divider />
                <DialogContent>
                    <form method="post" action="/api/act/create">
                        <FormControl fullWidth sx={{ mt: 1 }}>
                            <InputLabel>Type</InputLabel>
                            <Select
                                required
                                name="type"
                                label="Type"
                                value={dialogFormType}
                                onChange={(e) => setDialogFormType(e.target.value)}
                            >
                                <MenuItem value='Gaming'>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <GamingIcon />
                                        <div>&nbsp;Gaming</div>
                                    </div>
                                </MenuItem>
                                <MenuItem value='Programming'>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <ProgrammingIcon />
                                        <div>&nbsp;Programming</div>
                                    </div>
                                </MenuItem>
                            </Select>
                        </FormControl>

                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'jp'}>
                            <FormControl fullWidth sx={{ mt: 1 }}>
                                <DatePicker
                                    label="Date"
                                    inputFormat={"MM/DD/YYYY"}
                                    value={createActDate}
                                    onChange={(newValue) => setCreateActDate(newValue)}
                                    renderInput={(params) => <TextField name="date" {...params} />}
                                />
                            </FormControl>

                            <Grid container sx={{ mt: 1 }}>
                                <Grid item sx={{ width: '49%' }}>
                                    <FormControl fullWidth>
                                        <TimePicker
                                            label="From"
                                            inputFormat={"HH:mm"}
                                            ampm={false}
                                            value={createActStartTime}
                                            onChange={(newValue) => setCreateActStartTime(newValue)}
                                            renderInput={(params) => <TextField name="start" {...params} />}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item sx={{ width: '2%' }} />
                                <Grid item sx={{ width: '49%' }}>
                                    <FormControl fullWidth>
                                        <TimePicker
                                            label="To"
                                            inputFormat={"HH:mm"}
                                            ampm={false}
                                            value={createActEndTime}
                                            onChange={(newValue) => setCreateActEndTime(newValue)}
                                            renderInput={(params) => <TextField name="end" {...params} />}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </LocalizationProvider>

                        {TargetTitles(dialogFormType, true)}

                        <DialogActions sx={{ mt: 1, mb: -1, mr: -1 }}>
                            <Button color="secondary" onClick={handleCreateActDialogClose}>Cancel</Button>
                            <Button type="submit" color="success">Create</Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>

            {/* [Delete Act Dialog] */}
            <Dialog open={openDeleteAct} onClose={handleDeleteActClose}>
                <DialogTitle align="center">Delete Activity</DialogTitle>
                <DialogContent>
                    <form style={{ width: 300 }} onSubmit={handleDeleteActSubmit}>
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <TextField label="ID" value={toDelAct?.id} disabled></TextField>
                        </FormControl>

                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <TextField label="Type" value={toDelAct?.type} disabled></TextField>
                        </FormControl>

                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <TextField label="Duration" value={toDelAct?.duration} disabled></TextField>
                        </FormControl>

                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <TextField label="Title" value={toDelAct?.title} disabled></TextField>
                        </FormControl>

                        <DialogActions sx={{ mt: 1, mb: -1, mr: -2 }}>
                            <Button color="secondary" onClick={handleDeleteActClose}>Cancel</Button>
                            <Button type="submit" color="error">Delete</Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>

            {/* [Stopwatch Dialog] */}
            <Dialog
                open={openStopwatch}
                onClose={handleStopwatchClose}
                PaperProps={{
                    sx: {
                        width: "100%",
                        maxWidth: "400px",
                    },
                }}
            >
                <DialogTitle align="center">Stopwatch</DialogTitle>
                <DialogContent>
                    {
                        stopwatching === null ?
                            <form method="post" action="/api/act/stopwatch/start">
                                <FormControl fullWidth sx={{ mt: 1 }}>
                                    <InputLabel>Type</InputLabel>
                                    <Select
                                        required
                                        name="type"
                                        label="Type"
                                        value={dialogFormType}
                                        onChange={(e) => setDialogFormType(e.target.value)}
                                    >
                                        <MenuItem value='Gaming'>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <GamingIcon />
                                                <div>&nbsp;Gaming</div>
                                            </div>
                                        </MenuItem>
                                        <MenuItem value='Programming'>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <ProgrammingIcon />
                                                <div>&nbsp;Programming</div>
                                            </div>
                                        </MenuItem>
                                    </Select>
                                </FormControl>

                                {TargetTitles(dialogFormType, false)}

                                <DialogActions sx={{ mt: 1, mb: -1, mr: -2 }}>
                                    <Button color="secondary" onClick={handleStopwatchClose}>Cancel</Button>
                                    <Button color="success" type="submit">Start</Button>
                                </DialogActions>
                            </form>
                            :
                            <form method='post' action='/api/act/stopwatch/stop'>
                                <FormControl fullWidth sx={{ mt: 1 }}>
                                    <TextField label="Started At" value={dayjs(stopwatching?.start_time).format('YYYY/MM/DD HH:mm:ss')} disabled></TextField>
                                </FormControl>

                                <FormControl fullWidth sx={{ mt: 2 }}>
                                    <TextField label="Type" value={stopwatching?.type} disabled></TextField>
                                </FormControl>

                                <FormControl fullWidth sx={{ mt: 2 }}>
                                    <TextField label="Title" value={stopwatching?.target_title} disabled></TextField>
                                </FormControl>

                                <DialogActions style={{ justifyContent: "space-between" }} sx={{ mt: 1, mb: -1, ml: -1, mr: -1 }}>
                                    <Button color="error" onClick={handleTerminateStopwatch}>Terminate</Button>
                                    <Box>
                                        <Button color="secondary" onClick={handleStopwatchClose}>Cancel</Button>
                                        <Button type="submit" color="error">Stop</Button>
                                    </Box>
                                </DialogActions>
                            </form>
                    }
                </DialogContent>
            </Dialog>
        </Box>
    )

    function DetailTypeIcon(act: ActData) {
        switch (act.type) {
            case 'Gaming':
                return <>
                    <GamingIcon
                        style={{ verticalAlign: 'middle' }}
                        sx={{ color: LightColorByType(act.type) }}
                        onClick={() => handleDeleteActOpen(act)}
                    />
                </>
            case 'Programming':
                return <>
                    <ProgrammingIcon
                        style={{ verticalAlign: 'middle' }}
                        sx={{ color: LightColorByType(act.type) }}
                        onClick={() => handleDeleteActOpen(act)}
                    />
                </>
        }
    }

    function SummaryTypeIcon(type: string) {
        switch (type) {
            case 'Gaming':
                return <>
                    <GamingIcon
                        style={{ verticalAlign: 'middle' }}
                        sx={{ color: DeepColorByType(type) }}
                    />
                </>
            case 'Programming':
                return <>
                    <ProgrammingIcon
                        style={{ verticalAlign: 'middle' }}
                        sx={{ color: DeepColorByType(type) }}
                    />
                </>
        }
    }

    function TargetTitles(type: string, createMode: boolean) {
        switch (type) {
            case 'Gaming':
                return <>
                    <FormControl fullWidth sx={{ mt: 1 }}>
                        <InputLabel htmlFor="type">Game</InputLabel>
                        <Select
                            name="targetId"
                            label="Game"
                            defaultValue={dialogTargetId}
                            onChange={handleDialogTargetIdChange}
                        >
                            {gaming?.map((g: GameData, index) => {
                                return (
                                    <MenuItem key={index} value={g.id}>{g.title}</MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                </>
            case 'Programming':
                return <>
                    <FormControl fullWidth sx={{ mt: 1 }}>
                        <InputLabel htmlFor="type">Project</InputLabel>
                        <Select
                            name="targetId"
                            label="Project"
                            value={dialogTargetId}
                            onChange={handleDialogTargetIdChange}
                        >
                            {programming?.map((proj: any, index) => {
                                return (
                                    <MenuItem key={index} value={proj.id}>{proj.title}</MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                </>
        }
    }
}