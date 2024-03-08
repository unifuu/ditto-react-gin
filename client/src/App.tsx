import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Nav from './Components/Nav/Nav'
import SignIn from './Components/SignIn/SignIn'
import Blog from './Components/Blog/Blog'
import Post from './Components/Blog/Post'
import Act from './Components/Act/Act'
import Game from './Components/Game/Game'
import useToken from './useToken'

import './App.css';
import { Grid } from '@mui/material'
import Marking from './Components/Marking/Marking'

export default function App() {
  const { token, setToken } = useToken()

  if (!token) {
    return (
      <Routes>
        <Route path="/" element={<Blog authed={false} />} />
        <Route path="/act" element={<Blog authed={false} />} />
        <Route path="/blog" element={<Blog authed={false} />} />
        <Route path="/fuu" element={<SignIn setToken={setToken} />} />
        <Route path="/game" element={<Blog authed={false} />} />
        <Route path="/post" element={<Post />} />
        <Route path="/post/:postId" element={<Post />} />
      </Routes>
    )
  } else {
    return (
      <>
        <Grid xs={12} sx={{ height: 80 }}>
          <Nav />
        </Grid>

        <Routes>
          <Route path="/" element={<Blog authed={true} />} />
          <Route path="/act" element={<Act />} />
          <Route path="/blog" element={<Blog authed={true} />} />
          <Route path="/marking" element={<Marking />} />
          <Route path="/game" element={<Game />} />
          <Route path="/post" element={<Post />} />
          <Route path="/post/:postId" element={<Post />} />
        </Routes>
      </>
    )
  }
}
