import { green } from '@mui/material/colors'
import { orange } from '@mui/material/colors'
import { pink } from '@mui/material/colors'
import { purple } from '@mui/material/colors'
import { red } from '@mui/material/colors'
import { yellow } from '@mui/material/colors'
import { blue } from '@mui/material/colors'

export function LightColorByType(typ: string) {
    switch(typ) {
        case 'All':
            return yellow[300]
        case 'Gaming':
            return pink[300]
        case 'Programming':
            return purple[300]
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
        default:
            return 'white'
    }   
}

export function colorByStatus(status: String): string {
    switch (status) {
        case 'Done':
        case 'Played':
            return '#B1B1EF'
        case 'Doing':
        case 'Playing':
            return '#50C878'
        case 'Todo':
        case 'ToPlay':
            return '#DE3163'
        default:
            return '#000000'
    }
}