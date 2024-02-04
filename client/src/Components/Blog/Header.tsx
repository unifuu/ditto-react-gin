import * as React from 'react'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { NavLink } from 'react-router-dom'
import useToken from '../../useToken'

interface HeaderProps {
    title: string;
}

export default function Header(props: HeaderProps) {
    const { token } = useToken()
    const { title } = props;

    return (
        <React.Fragment>
            <Toolbar sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Typography
                    component="h2"
                    variant="h5"
                    color="inherit"
                    align="center"
                    noWrap
                    sx={{ flex: 1 }}
                >
                    {
                        token ?
                            <NavLink
                                to='/'
                                style={{
                                    textDecoration: 'none',
                                    fontWeight: "bold",
                                    color: 'lavender',
                                }}
                            >
                                {title}
                            </NavLink>                        
                        :
                            <NavLink
                                to='/fuu'
                                style={{
                                    textDecoration: 'none',
                                    fontWeight: "bold",
                                    color: 'lavender',
                                }}
                            >
                                {title}
                            </NavLink>
                    }
                </Typography>
            </Toolbar>
        </React.Fragment>
    );
}