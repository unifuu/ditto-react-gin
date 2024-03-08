import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import BloggingIcon from '@mui/icons-material/Article'
import ActingIcon from '@mui/icons-material/History'
import GamingIcon from '@mui/icons-material/VideogameAsset'
import MarkingIcon from '@mui/icons-material/Bookmarks'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import Box from '@mui/material/Box'
import { ButtonGroup } from '@mui/material'
import { cyan, green, orange, pink } from '@mui/material/colors'
import { useNavigate } from 'react-router-dom'

export default function AuthNav() {
    const navigate = useNavigate()

    return (
        <AppBar position="fixed">
            <Toolbar>
                <Box sx={{ flexGrow: 1 }} />
                <ButtonGroup variant="outlined" size="medium">
                    <IconButton onClick={() => { navigate("/game") }}>
                        <GamingIcon
                            sx={{
                                fontSize: 30,
                                color: pink[300],
                                "&:hover": { color: pink[700] }
                            }}
                        />
                    </IconButton>
                    <IconButton onClick={() => { navigate("/marking") }}>
                        <MarkingIcon
                            sx={{
                                fontSize: 30,
                                color: green[300],
                                "&:hover": { color: green[700] }
                            }}
                        />
                    </IconButton>
                    <IconButton onClick={() => { navigate("/act") }}>
                        <ActingIcon
                            sx={{
                                fontSize: 30,
                                color: orange[300],
                                "&:hover": { color: orange[700] }
                            }}
                        />
                    </IconButton>
                    <IconButton onClick={() => { navigate("/blog") }}>
                        <BloggingIcon
                            sx={{
                                fontSize: 30,
                                color: cyan[300],
                                "&:hover": { color: cyan[700] }
                            }}
                        />
                    </IconButton>
                </ButtonGroup>
            </Toolbar>
        </AppBar>
    )
}
