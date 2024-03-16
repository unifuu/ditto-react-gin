import { FormEvent, useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { styled } from '@mui/material'
import PropTypes from 'prop-types'
import InputAdornment from '@mui/material/InputAdornment'
import Diversity1Icon from '@mui/icons-material/Diversity1'
import PasswordIcon from '@mui/icons-material/Password'
import LoginIcon from '@mui/icons-material/Login'
import './SignIn.css'
import { useNavigate } from 'react-router-dom'
import useToken from '../../useToken'

SignIn.propTypes = {
    setToken: PropTypes.func.isRequired
}

export default function SignIn({ setToken }: { setToken: any }) {
    const navigate = useNavigate()
    const { token } = useToken()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    async function login() {
        return fetch('api/user/checkAuth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password,
            })
        }).then(response => {
            if (response.ok) {
                return response.json()
            } else {
                alert("...")
                return null
            }
        })
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const userToken = await login()
        if (userToken) {
            setToken(userToken)
            navigate("/")
        }
    }

    if (token) { navigate("/") }

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <Grid
                        container
                        spacing={0}
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                        style={{ minHeight: '80vh' }}
                    >
                        <Grid item xs={3}>
                            <UsernameTextField
                                required
                                fullWidth
                                id="username"
                                name="username"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                autoFocus
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Diversity1Icon
                                                fontSize="large"
                                                sx={{ color: '#b9a3db', mr: 1 }}
                                            />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <PasswordTextField
                                required
                                fullWidth
                                name="password"
                                type="password"
                                id="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PasswordIcon
                                                fontSize="large"
                                                sx={{ color: '#b9a3db', mr: 1 }}
                                            />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="outlined"
                                size="large"
                                sx={{ mt: 1.2 }}
                                style={{
                                    textTransform: "none",
                                    padding: "15px 0px",
                                    color: '#b9a3db',
                                    borderColor: '#b9a3db'
                                }}
                            >
                                <LoginIcon />
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    )
}

const UsernameTextField = styled(TextField)(() => ({
    "& .MuiInputBase-root": {
        color: '#b9a3db'
    },
    '& fieldset': {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#b9a3db',
        },
        '&:hover fieldset': {
            borderColor: '#b9a3db',
        },
        input: {
            '&:-webkit-autofill': {
                '-webkit-box-shadow': '0 0 0 100px #121212 inset',
                '-webkit-text-fill-color': '#b9a3db'
            }
        }
    },
}))

const PasswordTextField = styled(TextField)(() => ({
    "& .MuiInputBase-root": {
        color: '#b9a3db'
    },
    '& fieldset': {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#b9a3db',
        },
        '&:hover fieldset': {
            borderColor: '#b9a3db',
        },
        input: {
            '&:-webkit-autofill': {
                '-webkit-box-shadow': '0 0 0 100px #121212 inset',
                '-webkit-text-fill-color': '#b9a3db'
            }
        }
    },
}))