import { green } from '@mui/material/colors'
import { orange } from '@mui/material/colors'
import { pink } from '@mui/material/colors'
import { purple } from '@mui/material/colors'
import { red } from '@mui/material/colors'
import { yellow } from '@mui/material/colors'
import { blue } from '@mui/material/colors'

export function BaseColorByType(type: string) {
    switch(type) {
        case 'Gaming':
            return 'secondary'
        case 'Programming':
            return 'info'
        case 'Watching':
            return 'warning'
    }
}

export function LightColorByType(typ: string) {
    switch(typ) {
        case 'All':
            return yellow[300]
        case 'Gaming':
            return pink[300]
        case 'Programming':
            return purple[300]
        case 'Reading':
            return green[300]
        case 'Watching':
            return red[300]
        default:
            return 'white'
    }
}

export function DeepColorByType(type: string) {
    switch(type) {
        case 'All':
            return yellow[500]
        case 'Gaming':
            return pink[500]
        case 'Programming':
            return purple[500]
        case 'Reading':
            return green[500]
        case 'Watching':
            return red[500]
        default:
            return 'white'
    }   
}