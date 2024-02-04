import Stack from '@mui/material/Stack'
import CircularProgress from '@mui/material/CircularProgress'
import { Box } from '@mui/material'

export default function CircularColor() {
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100vh"
        >
            <CircularProgress color="secondary" />
        </Box>
    )
}