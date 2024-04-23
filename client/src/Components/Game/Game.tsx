import * as React from 'react'
import { styled } from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import TuneIcon from '@mui/icons-material/Tune'
import EditIcon from '@mui/icons-material/Edit'
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import { AppBar, ButtonGroup, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { Badge } from '@mui/material'
import { BadgeProps } from '@mui/material'
import { Box } from '@mui/material'
import { Button } from '@mui/material'
import { Dialog } from '@mui/material'
import { DialogActions } from '@mui/material'
import { DialogContent } from '@mui/material'
import { DialogTitle } from '@mui/material'
import { FormControl } from '@mui/material'
import { Grid } from '@mui/material'
import { InputAdornment } from '@mui/material'
import { InputLabel } from '@mui/material'
import { ListItemIcon } from '@mui/material'
import { Menu } from '@mui/material'
import { MenuItem } from '@mui/material'
import { Rating } from '@mui/material'
import { Select } from '@mui/material'
import { TextField } from '@mui/material'
import { Toolbar } from '@mui/material'
import { Tooltip } from '@mui/material'
import { Divider } from '@mui/material'
import { FormControlLabel } from '@mui/material'
import { FormGroup } from '@mui/material'
import { InputBase } from '@mui/material'
import { List } from '@mui/material'
import { ListItem } from '@mui/material'
import { ListItemText } from '@mui/material'
import { Paper } from '@mui/material'
import { Switch } from '@mui/material'
import { Tabs } from '@mui/material'
import { alpha } from '@mui/material'
import Pagination from '@mui/material/Pagination'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress'
import { Code, CodeSlash, PatchCheck, PatchExclamation, PatchQuestion } from 'react-bootstrap-icons'
import { Battery, BatteryCharging, BatteryFull } from 'react-bootstrap-icons'
import { Fragment, useEffect, useState } from 'react'
import PostAddIcon from '@mui/icons-material/PostAdd'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import SearchIcon from '@mui/icons-material/Search'
import { purple } from '@mui/material/colors'
import MenuIcon from '@mui/icons-material/Menu'
import AlarmOffIcon from '@mui/icons-material/AlarmOff'
import { GameData, IncData, StopwatchData } from '../../interfaces'
import useMediaQuery from '@mui/material/useMediaQuery'

// Icons
import { Tablet } from 'react-bootstrap-icons'
import { PcDisplay } from 'react-bootstrap-icons'
import { NintendoSwitch } from 'react-bootstrap-icons'
import { Playstation } from 'react-bootstrap-icons'
import { Xbox } from 'react-bootstrap-icons'
import { CheckSquare } from 'react-bootstrap-icons'
import { Square } from 'react-bootstrap-icons'
import { hourOfDuration, percentage } from '../../utils'
import { DoingBadge, DoneBadge, TodoBadge } from '../Common/Badges'
import useToken from '../../useToken'
import TodoIcon from '@mui/icons-material/SyncLock'
import DoingIcon from '@mui/icons-material/Sync'
import DoneIcon from '@mui/icons-material/PublishedWithChanges'

export default function Game() {
    const { token, setToken } = useToken()
    const [stopwatch, setStopwatch] = useState<StopwatchData>()

    const pcScreen = useMediaQuery('(min-width:600px)')
    function matchScreen(pc: number, mobile: number): number {
        if (pcScreen === true) {
            return pc
        } else {
            return mobile
        }
    }

    // States
    const [games, setGames] = useState<GameData[]>([])

    const [tabPlatform, setTabPlatform] = useState('All')
    const platformColor = (platform: string) => {
        switch (platform) {
            case 'All':
                return '#FFF176'
            case 'PC':
                return '#E3963E'
            case 'PlayStation':
                return '#2E6DB4'
            case 'Nintendo Switch':
                return '#E60012'
            case 'Xbox':
                return '#107C10'
            case 'Mobile':
                return '#730073'
            default:
                return 'gray'
        }
    }

    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [tabStatus, setTabStatus] = useState("Playing")

    const [searchIncKeyword, setSearchIncKeyword] = useState<string>("")
    const [searchedIncResult, setSearchedIncsResult] = useState<IncData[]>([])
    const [updatingInc, setUpdatingInc] = useState<IncData>()

    // Status counts
    const [playedCnt, setPlayedCnt] = useState(0)
    const [playingCnt, setPlayingCnt] = useState(0)
    const [toPlayCnt, setToPlayCnt] = useState(0)

    // Platform counts
    const [allCount, setAllCount] = useState(0)
    const [pcCount, setPcCount] = useState(0)
    const [psCount, setPsCount] = useState(0)
    const [nsCount, setNsCount] = useState(0)
    const [xboxCount, setXboxCount] = useState(0)
    const [mobileCount, setMobileCount] = useState(0)

    // Effects
    useEffect(() => {
        refresh()
    }, [tabStatus, tabPlatform, page])

    const SearchBar = styled('div')(({ theme }) => ({
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    }))

    const SearchIconWrapper = styled('div')(({ theme }) => ({
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }))

    const StyledInputBase = styled(InputBase)(({ theme }) => ({
        color: 'inherit',
        '& .MuiInputBase-input': {
            padding: theme.spacing(1, 0.7, 1, 0),
            // vertical padding + font size from searchIcon
            paddingLeft: `calc(1em + ${theme.spacing(4)})`,
            transition: theme.transitions.create('width'),
            width: '100%',
            [theme.breakpoints.up('sm')]: {
                width: '0ch',
                '&:focus': {
                    width: '10ch',
                },
            },
        },
    }))

    function Progressing(props: LinearProgressProps & { value: number }) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: '100%' }}>
                    {LinearProgressing(props)}
                </Box>
                <Box sx={{ minWidth: 35, pl: 1 }}>
                    {ProgressingPercentage(props.value)}
                </Box>
            </Box>
        )
    }

    function LinearProgressing(props: LinearProgressProps & { value: number }) {
        switch (props.value) {
            case -1:
                return <LinearProgress variant="determinate" color="info" {...props} />
            case 0:
                return <LinearProgress variant="determinate" color="secondary" {...props} />
            case 100:
                return <LinearProgress variant="determinate" color="inherit" {...props} />
            default:
                return <LinearProgress variant="determinate" color="success" {...props} />
        }
    }

    function ProgressingPercentage(value: number) {
        switch (value) {
            case -1:
                return <Typography variant="body2" sx={{ color: "info.main" }}>♾️</Typography>
            case 0:
                return <Typography variant="body2" sx={{ color: "secondary.main" }}>{value}%</Typography>
            case 100:
                return <Typography variant="body2" sx={{ color: "inhert.main" }}>{value}%</Typography>
            default:
                return <Typography variant="body2" sx={{ color: "success.main" }}>{value}%</Typography>
        }
    }

    // Search inc dialog
    const [openSearchIncDialog, setOpenSearchIncDialog] = useState(false);
    const handleSearchIncDialogOpen = () => { setOpenSearchIncDialog(true) };
    const handleSearchIncDialogClose = () => {
        setOpenSearchIncDialog(false);
        setSearchedIncsResult([]);
    };

    // Create inc dialog
    const [openCreateIncDialog, setOpenCreateIncDialog] = useState(false);
    const handleCreateIncDialogOpen = () => { setOpenCreateIncDialog(true) };
    const handleCreateIncDialogClose = () => { setOpenCreateIncDialog(false) };

    // Update inc dialog
    const [openUpdateIncDialog, setOpenUpdateIncDialog] = useState(false);
    const handleUpdateIncDialogOpen = () => { setOpenUpdateIncDialog(true) };
    const handleUpdateIncDialogClose = () => { setOpenUpdateIncDialog(false) };

    // Create game dialog
    const [openCreateGameDialog, setOpenCreateGameDialog] = useState(false);
    const handleCreateGameDialogOpen = () => { fetchCreateGame() }
    const handleCreateGameDialogClose = () => {
        setOpenCreateGameDialog(false)
    }

    // Update Game Dialog
    const [openUpdateGameDialog, setOpenUpdateGameDialog] = useState(false)
    const handleUpdateGameDialogOpen = (id: String) => { fetchUpdateGame(id) }
    const handleUpdateGameDialogClose = () => {
        setOpenUpdateGameDialog(false)
    }

    const [successAlertOpen, setSuccessAlertOpen] = useState(false)
    const [warningAlertOpen, setWarningAlertOpen] = useState(false)
    const [errorAlertOpen, setErrorAlertOpen] = useState(false)

    const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
        function Alert(props, ref) {
            return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
        }
    )

    const handleSuccessAlertOpen = () => { setSuccessAlertOpen(true) }
    const handleSuccessAlertClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') { return }
        setSuccessAlertOpen(false)
    }

    const handleWarningAlertOpen = () => { setWarningAlertOpen(true) }
    const handleWarningAlertClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') { return }
        setWarningAlertOpen(false)
    }

    const handleErrorAlertOpen = () => { setErrorAlertOpen(true) }
    const handleErrorAlertClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') { return }
        setErrorAlertOpen(false)
    }

    const [createGame, setCreateGame] = useState({
        developers: [],
        publishers: [],
        genres: [],
        platforms: [],
    });

    const [updateGame, setUpdateGame] = useState({
        game: {
            id: String,
            title: String,
            genre: String,
            platform: String,
            developer_id: String,
            publisher_id: String,
            status: String,
            total_time: Number,
            how_long_to_beat: Number,
            rating: String,
        },
        developers: [],
        publishers: [],
        genres: [],
        platforms: [],
        played_hour: Number,
        played_min: Number,
        hltb_hour: Number,
        hltb_min: Number,
    })

    const handleToUpdateInc = (id: string, name: string, is_dev: boolean, is_pub: boolean) => {
        setUpdatingInc({ id: id, name: name, is_dev: is_dev, is_pub: is_pub });
        handleUpdateIncDialogOpen();
    };

    // Functions
    function searchInc(keyword: String) {
        fetch(`/api/inc/search/${keyword}`, {
            method: "GET",
        })
            .then(resp => resp.json())
            .then(data => {
                if (data != null) {
                    setSearchedIncsResult(data);
                }
            });
    };

    function fetchCreateGame() {
        fetch("/api/game/create", {
            method: "GET",
        })
            .then(resp => resp.json())
            .then(data => {
                if (data != null) {
                    setCreateGame(data);
                    setOpenCreateGameDialog(true);
                }
            });
    }

    function fetchUpdateGame(id: String) {
        fetch(`/api/game/update?id=${id}`, { method: "GET" })
            .then(resp => resp.json())
            .then(data => {
                if (data != null) {
                    setUpdateGame(data)
                    setOpenUpdateGameDialog(true)
                }
            });
    }

    function fetchStopwatch() {
        fetch(`/api/act/stopwatch`, { method: "GET" })
            .then(resp => resp.json())
            .then(data => {
                if (data != null) {
                    setStopwatch(data)
                }
            })
    }

    function refresh() {
        fetchStopwatch()

        fetch(`/api/game/status/${tabStatus}/${tabPlatform}/${page}`)
            .then(resp => resp.json())
            .then(data => {
                if (data["games"] != null) {
                    setGames(data["games"]);
                } else {
                    setGames([])
                }
                setTotalPages(data["total_page"]);
            })

        fetch(`/api/game/badges?status=${tabStatus}`)
            .then(resp => resp.json())
            .then(data => {
                setPlayedCnt(data.badges["played"]);
                setPlayingCnt(data.badges["playing"]);
                setToPlayCnt(data.badges["to_play"]);

                setAllCount(data.badges["all_platform"]);
                setPcCount(data.badges["pc"]);
                setPsCount(data.badges["playstation"]);
                setNsCount(data.badges["nintendo_switch"]);
                setXboxCount(data.badges["xbox"]);
                setMobileCount(data.badges["mobile"]);
            })
    }

    const handleDeleteGame = (id: String) => {
        fetch(`/api/game/delete?id=${id}`, {
            method: "POST",
        })
            .then(() => {
                handleUpdateGameDialogClose();
                refresh()
            })
    }

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value)
    }

    const handleStatusChange = (
        event: React.MouseEvent<HTMLElement>,
        newValue: string,
    ) => {
        if (newValue === null) {
            return
        } else {
            setPage(1)
            setTabStatus(newValue)
        }
    }

    const handlePlatformChange = (event: React.SyntheticEvent, newValue: string) => {
        setPage(1)
        setTabPlatform(newValue)
    };

    const handleStartGaming = (id: string) => {
        fetch(`/api/act/stopwatch/start?type=Gaming&id=${id}`, { method: "GET" })
            .then(resp => {
                if (!resp.ok) {
                    handleErrorAlertOpen()
                } else {
                    // window.location.reload()
                    refresh()
                    handleSuccessAlertOpen()
                }
            })
    }

    const handleStopStopwatch = () => {
        fetch(`/api/act/stopwatch/stop`, { method: "GET" })
            .then(resp => {
                handleWarningAlertOpen()
                refresh()
            })
    }

    const StyledRating = styled(Rating)({
        '& .MuiRating-iconFilled': {
            color: '#ff6d75',
        },
        '& .MuiRating-iconHover': {
            color: '#ff3d47',
        },
    })

    const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
        '& .MuiBadge-badge': {
            right: -3,
            top: 2,
            border: `2px solid ${theme.palette.background.paper}`,
            padding: '0 2px',
        },
    }))

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => { setAnchorEl(null) }

    return (
        <Fragment>
            <AppBar
                sx={{ width: '25%', mr: '75%' }}
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
                        <MenuItem onClick={handleCreateGameDialogOpen}>
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
                                Create Game
                            </Typography>
                        </MenuItem>

                        <MenuItem onClick={handleSearchIncDialogOpen}>
                            <ListItemIcon>
                                <MapsHomeWorkIcon
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
                                Manage Inc
                            </Typography>
                        </MenuItem>

                        <MenuItem onClick={handleClose}>
                            <ListItemIcon>
                                <FormatListNumberedIcon
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
                                Ranking
                            </Typography>
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

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
                            value={tabStatus}
                            onChange={handleStatusChange}
                        >
                            <ToggleButton value="Played">
                                {DoneBadge(playedCnt)}
                            </ToggleButton>
                            <ToggleButton value="Playing">
                                {DoingBadge(playingCnt)}
                            </ToggleButton>
                            <ToggleButton value="ToPlay">
                                {TodoBadge(toPlayCnt)}
                            </ToggleButton>
                        </ToggleButtonGroup>

                        <Box display='flex' flexGrow={1} />

                        {/* <SearchBar>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase />
                        </SearchBar> */}
                    </Toolbar>
                </AppBar>

                <TabContext value={tabStatus}>
                    <TabPanel value={tabStatus}>
                        <Grid container spacing={2}>
                            {/* Platform Tab */}
                            <Grid
                                item
                                style={{ width: '100px' }}
                                sx={{
                                    ml: -5,
                                    borderRight: 1,
                                    borderColor: 'divider'
                                }}
                            >
                                <Tabs
                                    variant="fullWidth"
                                    orientation="vertical"
                                    TabIndicatorProps={{
                                        style: { background: platformColor(tabPlatform) }
                                    }}
                                    value={tabPlatform}
                                    onChange={handlePlatformChange}
                                >
                                    <Tab
                                        value="All"
                                        icon={
                                            <StyledBadge
                                                badgeContent={allCount}
                                                sx={{
                                                    "& .MuiBadge-badge": {
                                                        color: 'black',
                                                        backgroundColor: platformColor(tabPlatform === 'All' ? tabPlatform : '')
                                                    }
                                                }}
                                            >
                                                {tabPlatform === 'All'
                                                    ? <CheckSquare color='#FFF176' size={35} />
                                                    : <Square color='gray' size={35} />}
                                            </StyledBadge>
                                        }
                                    />

                                    <Tab
                                        value="PC"
                                        sx={{ mt: 1 }}
                                        icon={
                                            <StyledBadge
                                                badgeContent={pcCount}
                                                sx={{
                                                    "& .MuiBadge-badge": {
                                                        color: 'black',
                                                        backgroundColor: platformColor(tabPlatform === 'PC' ? tabPlatform : '')
                                                    }
                                                }}
                                            >
                                                <PcDisplay color={platformColor(tabPlatform === 'PC' ? tabPlatform : '')} size={35} />
                                            </StyledBadge>
                                        }
                                    />

                                    <Tab
                                        value="PlayStation"
                                        sx={{ mt: 1 }}
                                        icon={
                                            <StyledBadge
                                                badgeContent={psCount}
                                                sx={{
                                                    "& .MuiBadge-badge": {
                                                        color: 'black',
                                                        backgroundColor: platformColor(tabPlatform === 'PlayStation' ? tabPlatform : '')
                                                    }
                                                }}
                                            >
                                                <Playstation color={platformColor(tabPlatform === 'PlayStation' ? tabPlatform : '')} size={35} />
                                            </StyledBadge>
                                        }
                                    />

                                    <Tab
                                        value="Nintendo Switch"
                                        sx={{ mt: 1 }}
                                        icon={
                                            <StyledBadge
                                                badgeContent={nsCount}
                                                sx={{
                                                    "& .MuiBadge-badge": {
                                                        color: 'black',
                                                        backgroundColor: platformColor(tabPlatform === 'Nintendo Switch' ? tabPlatform : '')
                                                    }
                                                }}
                                            >
                                                <NintendoSwitch color={platformColor(tabPlatform === 'Nintendo Switch' ? tabPlatform : '')} size={35} />
                                            </StyledBadge>
                                        }
                                    />

                                    <Tab
                                        value="Xbox"
                                        sx={{ mt: 1 }}
                                        icon={
                                            <StyledBadge
                                                badgeContent={xboxCount}
                                                sx={{
                                                    "& .MuiBadge-badge": {
                                                        color: 'black',
                                                        backgroundColor: platformColor(tabPlatform === 'Xbox' ? tabPlatform : '')
                                                    }
                                                }}
                                            >
                                                <Xbox color={platformColor(tabPlatform === 'Xbox' ? tabPlatform : '')} size={35} />
                                            </StyledBadge>
                                        }
                                    />

                                    <Tab
                                        value="Mobile"
                                        sx={{ mt: 1 }}
                                        icon={
                                            <StyledBadge
                                                sx={{
                                                    "& .MuiBadge-badge": {
                                                        color: 'black',
                                                        backgroundColor: platformColor(tabPlatform === 'Mobile' ? tabPlatform : '')
                                                    }
                                                }}
                                                badgeContent={mobileCount}
                                            >
                                                <Tablet color={platformColor(tabPlatform === 'Mobile' ? tabPlatform : '')} size={35} />
                                            </StyledBadge>
                                        }
                                    />
                                </Tabs>
                            </Grid>

                            <Grid
                                item
                                xs={true}
                                justifyContent='center'
                                alignItems='center'
                            >
                                <Grid container spacing={3}>
                                    {games?.map((g, i) => (
                                        <Grid item>
                                            <Card
                                                sx={{
                                                    maxWidth: 250,
                                                    maxHeight: 565,
                                                }}
                                                key={g.id}
                                            >
                                                <CardMedia
                                                    component="img"
                                                    height="250"
                                                    image={"/assets/images/games/" + g.id + ".webp"}
                                                />
                                                <CardContent>
                                                    <Tooltip title="">
                                                        <Typography
                                                            variant="subtitle1"
                                                            align="center"
                                                            color="text.info"
                                                            sx={{ height: 30 }}
                                                        >
                                                            {g.title}
                                                        </Typography>
                                                    </Tooltip>
                                                </CardContent>

                                                <CardActions disableSpacing>
                                                    <Tooltip title="Property">
                                                        <IconButton onClick={() => handleUpdateGameDialogOpen(g.id)}>
                                                            <TuneIcon />
                                                        </IconButton>
                                                    </Tooltip>

                                                    {stopwatch?.target_id == g.id ?
                                                        <Tooltip sx={{ ml: -1.5 }} title="Stop">
                                                            <IconButton onClick={() => handleStopStopwatch()}>
                                                                <AlarmOffIcon color="warning" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        :
                                                        <Tooltip sx={{ ml: -1.5 }} title="Start">
                                                            <IconButton onClick={() => handleStartGaming(g.id)}>
                                                                <PlayCircleOutlineIcon color="success" />
                                                            </IconButton>
                                                        </Tooltip>}
                                                </CardActions>

                                                <CardContent sx={{ mt: -4 }}>
                                                    <Box
                                                        sx={{
                                                            mx: "auto",
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            '& > *': { m: 1 },
                                                        }}
                                                    >
                                                        <TextField
                                                            fullWidth
                                                            size="small"
                                                            sx={{ pt: 0.5 }}
                                                            inputProps={{
                                                                style: { textAlign: 'right' },
                                                                readOnly: true,
                                                            }}
                                                            value={rating(g.rating)}
                                                            InputProps={{
                                                                startAdornment: (
                                                                    <InputAdornment position="start">
                                                                        {g.platform === 'Mobile' ? <Tablet /> : <></>}
                                                                        {g.platform === 'Nintendo Switch' ? <NintendoSwitch /> : <></>}
                                                                        {g.platform === 'PC' ? <PcDisplay /> : <></>}
                                                                        {g.platform === 'PlayStation' ? <Playstation /> : <></>}
                                                                        {g.platform === 'Xbox' ? <Xbox /> : <></>}
                                                                    </InputAdornment>
                                                                )
                                                            }}
                                                        />

                                                        <TextField
                                                            fullWidth
                                                            size="small"
                                                            sx={{ pt: 0.5 }}
                                                            inputProps={{
                                                                style: { textAlign: 'right' },
                                                                readOnly: true,
                                                            }}
                                                            value={g.developer}
                                                            InputProps={{
                                                                startAdornment: (
                                                                    <InputAdornment position="start">
                                                                        <Code />
                                                                    </InputAdornment>
                                                                )
                                                            }}
                                                        />

                                                        <TextField
                                                            fullWidth
                                                            size="small"
                                                            sx={{ pt: 0.5 }}
                                                            inputProps={{ style: { textAlign: 'right' }, readOnly: true }}
                                                            value={g.publisher}
                                                            InputProps={{
                                                                startAdornment: (
                                                                    <InputAdornment position="start"><CodeSlash /></InputAdornment>
                                                                )
                                                            }}
                                                        />

                                                        <TextField
                                                            fullWidth
                                                            size="small"
                                                            sx={{ pt: 0.5 }}
                                                            inputProps={{ style: { textAlign: 'right' }, readOnly: true }}
                                                            value={hourOfDuration(g.total_time)}
                                                            InputProps={{
                                                                startAdornment: (
                                                                    <InputAdornment position="start">
                                                                        {g.status === 'Played' ? <PatchCheck /> : <></>}
                                                                        {g.status === 'Playing' ? <PatchExclamation /> : <></>}
                                                                        {g.status === 'ToPlay' ? <PatchQuestion /> : <></>}
                                                                    </InputAdornment>
                                                                ),
                                                                endAdornment: (
                                                                    <InputAdornment position="end">Hour(s)</InputAdornment>
                                                                )
                                                            }}
                                                        />

                                                        <Box sx={{ width: '100%' }}>
                                                            <Progressing value={percentage(g.total_time, g.how_long_to_beat)} />
                                                        </Box>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>

                                <Box
                                    sx={{ width: '100%', pt: 3, pb: 3 }}
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                >
                                    {totalPages > 1 ?
                                        <Pagination
                                            count={totalPages}
                                            page={page}
                                            onChange={handlePageChange}
                                            variant="outlined"
                                            color="secondary"
                                        />
                                        : <></>}
                                </Box>
                            </Grid>
                        </Grid>


                    </TabPanel>

                </TabContext>

                {/* Start Game Snackbar */}
                <Snackbar open={successAlertOpen} autoHideDuration={3000} onClose={handleSuccessAlertClose}>
                    <Alert severity="success" onClose={handleSuccessAlertClose} sx={{ width: '100%' }}>Started!</Alert>
                </Snackbar>
                <Snackbar open={warningAlertOpen} autoHideDuration={3000} onClose={handleWarningAlertClose}>
                    <Alert severity="warning" onClose={handleWarningAlertClose} sx={{ width: '100%' }}>Closed!</Alert>
                </Snackbar>
                <Snackbar open={errorAlertOpen} autoHideDuration={3000} onClose={handleErrorAlertClose}>
                    <Alert severity="error" onClose={handleErrorAlertClose} sx={{ width: '100%' }}>Failed!</Alert>
                </Snackbar>

                {/* Update Game Dialog */}
                <Dialog
                    open={openUpdateGameDialog}
                    onClose={handleUpdateGameDialogClose}
                >
                    <DialogTitle align="center">
                        Update Game
                    </DialogTitle>
                    <DialogContent>
                        <form method="post" encType="multipart/form-data" action="/api/game/update">
                            <FormControl fullWidth sx={{ mt: 1 }}>
                                <TextField
                                    name="id"
                                    label="Id"
                                    defaultValue={updateGame.game.id}
                                    inputProps={{
                                        readOnly: true
                                    }}
                                />
                            </FormControl>

                            <FormControl fullWidth sx={{ mt: 2 }}>
                                <TextField
                                    name="title"
                                    label="Title"
                                    defaultValue={updateGame.game.title}
                                >
                                </TextField>
                            </FormControl>

                            <Grid container>
                                <Grid item sx={{ width: '48%' }}>
                                    <FormControl fullWidth sx={{ mt: 2 }}>
                                        <InputLabel htmlFor="developer">Developer</InputLabel>
                                        <Select
                                            name="developer_id"
                                            label="Developer"
                                            defaultValue={updateGame.game.developer_id}
                                        >
                                            {updateGame.developers?.map((dev: any, index) => {
                                                return (
                                                    <MenuItem key={index} value={dev.id}>{dev.name}</MenuItem>
                                                )
                                            })}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item sx={{ width: '4%' }} />

                                <Grid item sx={{ width: '48%' }}>
                                    <FormControl fullWidth sx={{ mt: 2 }}>
                                        <InputLabel htmlFor="publisher">Publisher</InputLabel>
                                        <Select
                                            name="publisher_id"
                                            label="Publisher"
                                            defaultValue={updateGame.game.publisher_id}
                                        >
                                            {updateGame.publishers?.map((pub: any, index) => {
                                                return (
                                                    <MenuItem key={index} value={pub.id}>{pub.name}</MenuItem>
                                                )
                                            })}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <Grid container>
                                <Grid item sx={{ width: '48%' }}>
                                    <FormControl
                                        fullWidth
                                        sx={{ mt: 2 }}
                                    >
                                        <InputLabel htmlFor="Status">Status</InputLabel>
                                        <Select
                                            name="status"
                                            label="Status"
                                            defaultValue={updateGame.game.status}
                                        >
                                            <MenuItem key="Played" value="Played">Played</MenuItem>
                                            <MenuItem key="Playing" value="Playing">Playing</MenuItem>
                                            <MenuItem key="ToPlay" value="ToPlay">ToPlay</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item sx={{ width: '4%' }} />

                                <Grid item sx={{ width: '48%' }}>
                                    <FormControl
                                        fullWidth
                                        sx={{ mt: 2 }}
                                    >
                                        <InputLabel htmlFor="Genre">Genre</InputLabel>
                                        <Select
                                            name="genre"
                                            label="Genre"
                                            defaultValue={updateGame.game.genre}
                                        >
                                            {updateGame.genres?.map((genre: any, index) => {
                                                return (
                                                    <MenuItem key={index} value={genre}>{genre}</MenuItem>
                                                )
                                            })}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <Grid container>
                                <Grid item sx={{ width: '48%' }}>
                                    <FormControl
                                        fullWidth
                                        sx={{ mt: 2 }}
                                    >
                                        <InputLabel htmlFor="Platform">Platform</InputLabel>
                                        <Select
                                            name="platform"
                                            label="Platform"
                                            defaultValue={updateGame.game.platform}
                                        >
                                            {updateGame.platforms?.map((platform: any, index) => {
                                                return (
                                                    <MenuItem key={index} value={platform}>{platform}</MenuItem>
                                                )
                                            })}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item sx={{ width: '4%' }}></Grid>
                                <Grid item sx={{ width: '48%' }}>
                                    <FormControl fullWidth sx={{ mt: 2 }}>
                                        <InputLabel htmlFor="Rating">Rating</InputLabel>
                                        <Select
                                            name="rating"
                                            label="Rating"
                                            defaultValue={updateGame.game.rating}
                                        >
                                            <MenuItem key="10" value="10">Perfect</MenuItem>
                                            <MenuItem key="9" value="9">Excellent</MenuItem>
                                            <MenuItem key="8" value="8">Fantastic</MenuItem>
                                            <MenuItem key="7" value="7">Great</MenuItem>
                                            <MenuItem key="6" value="6">Good</MenuItem>
                                            <MenuItem key="5" value="5">Fine</MenuItem>
                                            <MenuItem key="4" value="4">Not Satisfied</MenuItem>
                                            <MenuItem key="3" value="3">Boring</MenuItem>
                                            <MenuItem key="2" value="2">Bad</MenuItem>
                                            <MenuItem key="1" value="1">Trash</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <Grid container sx={{ mt: 2 }}>
                                <Grid item sx={{ width: '30%' }}>
                                    <FormControl fullWidth>
                                        <TextField
                                            name="played_hour"
                                            type="number"
                                            label="Played Hour"
                                            defaultValue={updateGame.played_hour}
                                        >
                                        </TextField>
                                    </FormControl>
                                </Grid>
                                <Grid item sx={{ width: '1%' }}></Grid>
                                <Grid item sx={{ width: '17%' }}>
                                    <FormControl fullWidth>
                                        <TextField
                                            name="played_min"
                                            type="number"
                                            label="Min"
                                            defaultValue={updateGame.played_min}
                                        >
                                        </TextField>
                                    </FormControl>
                                </Grid>

                                <Grid item sx={{ width: '4%' }}></Grid>

                                <Grid item sx={{ width: '30%' }}>
                                    <FormControl fullWidth>
                                        <TextField
                                            name="hltb_hour"
                                            type="number"
                                            label="How Long To Beat Hour"
                                            defaultValue={updateGame.hltb_hour}
                                        >
                                        </TextField>
                                    </FormControl>
                                </Grid>

                                <Grid item sx={{ width: '1%' }}></Grid>

                                <Grid item sx={{ width: '17%' }}>
                                    <FormControl fullWidth>
                                        <TextField
                                            name="hltb_min"
                                            type="number"
                                            label="Min"
                                            defaultValue={updateGame.hltb_min}
                                        >
                                        </TextField>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <Grid container sx={{ mt: 1 }} justifyContent="flex-end">
                                <Grid item xs={12}>
                                    <FormControl >
                                        <input type="file" id="cover" name="cover" />
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <DialogActions style={{ justifyContent: "space-between" }} sx={{ mt: 1, mb: -1, ml: -1, mr: -1 }}>
                                <Button color="error" onClick={e => handleDeleteGame(updateGame.game.id.toString())}>Delete</Button>
                                <Box>
                                    <Button color="secondary" onClick={handleUpdateGameDialogClose}>Cancel</Button>
                                    <Button color="success" type="submit">Update</Button>
                                </Box>
                            </DialogActions>
                        </form>
                    </DialogContent>
                </Dialog>


                {/* Search Inc Dialog */}
                <Dialog
                    open={openSearchIncDialog}
                    onClose={handleSearchIncDialogClose}
                >
                    <DialogTitle align="center">
                        Search Inc
                        <IconButton onClick={handleCreateIncDialogOpen}>
                            <AddCircleOutlineIcon sx={{ color: "gray" }} />
                        </IconButton>
                    </DialogTitle>

                    <Divider />

                    <DialogContent>
                        <form method="post" action="/api/inc/search">
                            <Paper
                                component="form"
                                sx={{ display: 'flex', alignItems: 'center' }}
                            >
                                <InputBase
                                    sx={{ ml: 2, flex: 1 }}
                                    placeholder="Inc name"
                                    name="keyword"
                                    onChange={e => setSearchIncKeyword(e.target.value)}
                                />

                                <IconButton
                                    type="button"
                                    color="success"
                                    sx={{ p: '10px' }}
                                    aria-label="search"
                                    onClick={() => searchInc(searchIncKeyword)}
                                >
                                    <SearchIcon />
                                </IconButton>
                            </Paper>

                            <List sx={{ p: '2px 4px' }}>
                                {searchedIncResult.map((inc, index) => (
                                    <>
                                        <ListItem
                                            key={inc.id}
                                            disableGutters
                                            secondaryAction={
                                                <IconButton
                                                    edge="end"
                                                    aria-label="delete"
                                                    onClick={() => handleToUpdateInc(inc.id, inc.name, inc.is_dev, inc.is_pub)}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            }
                                        >
                                            <ListItemText primary={inc.name} />
                                        </ListItem>
                                        {index !== searchedIncResult.length - 1 ? <Divider /> : <></>}
                                    </>
                                ))}
                            </List>
                            <Divider />
                            <DialogActions sx={{ mt: 1, mb: -1, mr: -1 }}>
                                <Button color="secondary" onClick={handleSearchIncDialogClose}>Close</Button>
                            </DialogActions>
                        </form>
                    </DialogContent>
                </Dialog>


                {/* Create Inc Dialog */}
                <Dialog
                    open={openCreateIncDialog}
                    onClose={handleCreateIncDialogClose}
                >
                    <DialogTitle align="center">Create Inc</DialogTitle>
                    <Divider />
                    <DialogContent>
                        <form method="post" action="/api/inc/create">
                            <FormControl fullWidth sx={{ mt: 1, minWidth: 250 }}>
                                <TextField name="name" label="Name" required>
                                </TextField>
                            </FormControl>

                            <FormControl fullWidth sx={{ mt: 1 }} component="fieldset" variant="standard">
                                <FormGroup>
                                    <FormControlLabel control={<Switch value="1" name="is_developer" />} label="Developer" />
                                    <FormControlLabel control={<Switch value="1" name="is_publisher" />} label="Publisher" />
                                </FormGroup>
                            </FormControl>

                            <DialogActions sx={{ mt: 1, mb: -1, mr: -1 }}>
                                <Button color="secondary" onClick={handleCreateIncDialogClose}>Cancel</Button>
                                <Button color="success" type="submit">Create</Button>
                            </DialogActions>
                        </form>
                    </DialogContent>
                </Dialog>


                {/* Update Inc Dialog */}
                <Dialog
                    open={openUpdateIncDialog}
                    onClose={handleUpdateIncDialogClose}
                >
                    <DialogTitle align="center">Update Inc</DialogTitle>
                    <Divider />
                    <DialogContent>
                        <form method="post" action="/api/inc/update">
                            <FormControl fullWidth sx={{ mt: 1, minWidth: 250 }}>
                                {/* <input type='hidden' name="id" value="" { ...props } /> */}
                                <TextField
                                    name="id"
                                    label="ID"
                                    defaultValue={updatingInc?.id}
                                    inputProps={{
                                        readOnly: true
                                    }}
                                />
                            </FormControl>

                            <FormControl fullWidth sx={{ mt: 1, minWidth: 250 }}>
                                <TextField
                                    name="name"
                                    label="Name"
                                    defaultValue={updatingInc?.name}
                                    required></TextField>
                            </FormControl>

                            <FormControl fullWidth sx={{ mt: 1 }} component="fieldset" variant="standard">
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Switch value="1" name="is_dev" defaultChecked={updatingInc?.is_dev} />
                                        }
                                        label="Developer" />

                                    <FormControlLabel
                                        control={
                                            <Switch value="1" name="is_pub" defaultChecked={updatingInc?.is_pub} />
                                        }
                                        label="Publisher" />
                                </FormGroup>
                            </FormControl>

                            <DialogActions sx={{ mt: 1, mb: -1, mr: -1 }}>
                                <Button color="secondary" onClick={handleUpdateIncDialogClose}>Cancel</Button>
                                <Button color="success" type="submit">Update</Button>
                            </DialogActions>
                        </form>
                    </DialogContent>
                </Dialog>

            </Box>

            <Dialog
                open={openCreateGameDialog}
                onClose={handleCreateGameDialogClose}
            >
                <DialogTitle align="center">Create Game</DialogTitle>
                <DialogContent>
                    <form method="post" action="/api/game/create">
                        <FormControl fullWidth sx={{ mt: 1 }}>
                            <TextField name="title" label="Title" required />
                        </FormControl>

                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel htmlFor="developer">Developer</InputLabel>
                            <Select name="developer_id" label="Developer" required>
                                {createGame.developers?.map((dev: any, index) => {
                                    return (<MenuItem key={index} value={dev.id}>{dev.name}</MenuItem>)
                                })}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel htmlFor="publisher">Publisher</InputLabel>
                            <Select name="publisher_id" label="Publisher" required>
                                {createGame.publishers?.map((pub: any, index) => {
                                    return (<MenuItem key={index} value={pub.id}>{pub.name}</MenuItem>)
                                })}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel htmlFor="Genre">Genre</InputLabel>
                            <Select name="genre" label="Genre" required>
                                {createGame.genres?.map((genre: any, index) => {
                                    return (<MenuItem key={index} value={genre}>{genre}</MenuItem>)
                                })}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel htmlFor="Platform">Platform</InputLabel>
                            <Select name="platform" label="Platform" required>
                                {createGame.platforms?.map((platform: any, index) => {
                                    return (
                                        <MenuItem key={index} value={platform}>{platform}</MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>

                        <DialogActions sx={{ mt: 1, mb: -1, mr: -1 }}>
                            <Button color="secondary" onClick={handleCreateGameDialogClose}>Cancel</Button>
                            <Button color="success" type="submit">Create</Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
        </Fragment>

    )
}

interface ExpandMoreProps extends IconButtonProps { expand: boolean }

const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

function rating(num: string): string {
    switch (num) {
        case '10':
            return '10: Perfect'
        case '9':
            return '9: Excellent'
        case '8':
            return '8: Fantastic'
        case '7':
            return '7: Great'
        case '6':
            return '6: Good'
        case '5':
            return '5: Fine'
        case '4':
            return '4: Not Satisfied'
        case '3':
            return '3: Boring'
        case '2':
            return '2: Bad'
        case '1':
            return '1: Trash'
        default:
            return ''
    }
}