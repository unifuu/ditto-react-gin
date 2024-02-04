import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'
import FirstPageIcon from '@mui/icons-material/FirstPage'
import { Fragment } from 'react'

// Icons
import { Battery, BatteryCharging, BatteryFull } from 'react-bootstrap-icons'

interface PostHeaderProps {
    title: string;
}

export default function PostHeader(props: PostHeaderProps) {
    const { title } = props;

    return (
        <Fragment>
            <Toolbar sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <IconButton
                    size="small"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <Previous />
                </IconButton>
                <Typography
                    variant="h5"
                    color="inherit"
                    align="center"
                    noWrap
                    sx={{ flex: 1, fontWeight: 'bold' }}
                >
                    {title}
                </Typography>
                <IconButton
                    size="small"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    color="inherit"
                >
                </IconButton>
            </Toolbar>
        </Fragment>
    )
}

function Previous() {
    const navigate = useNavigate();
    const goBack = () => {
        navigate('/blog')
    }
    return <FirstPageIcon
            sx={{ fontSize: 30, color: "thistle" }}
            onClick={ goBack } />
}