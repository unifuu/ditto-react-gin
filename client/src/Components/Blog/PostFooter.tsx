import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import FirstPageIcon from '@mui/icons-material/FirstPage'
import { Stack } from '@mui/material'

export default function PostFooter() {
    return (
        <Box
            component="footer"
            sx={{
                bgcolor: 'background.paper',
                py: 3
            }}
        >
            <Container maxWidth="lg">
                <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                >
                    <Link
                        color="inherit"
                        style={{ textDecoration: 'none' }}
                        href="https://unifuu.com"
                    >
                        {'<'} Back to 🍁
                    </Link>
                </Typography>
            </Container>
        </Box>
    )
}