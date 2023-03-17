"use client";

import { Box, Container } from "@mui/material";
import React from "react";
import Login from "../components/Login";
import Image from "next/image";


export default function Home() {
  return (
      <Box
        sx={styles.container}
      >
        <Box sx={styles.login} className="p-10">
            <Login />
        </Box>
        <Box sx={styles.details}>
          <Image 
            src={'/landing2xmin.png'}
            width={0}
            height={0}
            sizes="100vw"
            className="h-full w-full"
            alt="Landing"
          />
        </Box>
    </Box>
  )
}

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    border: 20,
    overflow: 'hidden',
    overflowX: 'hidden',
  },
  login: {
    bgcolor: 'white'
  },
  details: {
    bgcolor: 'white',
    display: { xs: "none", sm: 'none', md: 'block' }
  }
}
