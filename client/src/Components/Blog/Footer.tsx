import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'

export default function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                bgcolor: 'background.paper',
                py: 3
            }}
        >
            <Container maxWidth="lg">
                <Copyright />
            </Container>
        </Box>
    )
}

function Copyright() {
    return (
        <Typography
            variant="body2"
            color="text.secondary"
            align="center"
        >
            <Link
                color="inherit"
                style={{ textDecoration: 'none' }}
                href="https://github.com/unifuu"
            >
                {'© '} {new Date().getFullYear()} {' '} 🍁 楓
            </Link>
        </Typography>
    )
}
