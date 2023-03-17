import { Box, Button, Container, Typography } from '@mui/material'
import React from 'react'
import Form from "react-bootstrap/esm/Form";
import SendIcon from '@mui/icons-material/Send';
import Link from 'next/link';


export interface LoginProps {}

function Login() {

	const [ email, setEmail ] = React.useState<string>('')
	const [ password, setPassword ] = React.useState<string>('')

	return (
		<Box className="h-full">
			<Typography 
				variant="h3"
				sx={{
					marginTop: "25%",
					marginBottom: "25%",
				}}
			>
				Unlock the Power of Personalized Learning.
			</Typography>

			<Container sx={{
				display: "flex",
				justifyContent: "center",
				alignSelf: "center"
			}}>
				
				<Form style={{
					width: 500
				}}>
					<Form.Group className="mb-6" controlId="email-login-input1">
						<Form.Label>Email:</Form.Label>
						<Form.Control 
							type="email" 
							placeholder="name@example.com" 
							value={email} 
							onChange={(e) => setEmail(e.target.value)}
						/>
					</Form.Group>
					<Form.Group className="mb-8" controlId="password-login-input1">
						<Form.Label>Password:</Form.Label>
						<Form.Control 
							type='password' 
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</Form.Group>
					<Link href={`/signup/xaw120`}>
						<Button sx={{
							color: "black",
							border: 1,
							width: 500
						}}
							type='submit'
							endIcon={<SendIcon />}
						>
							Login
						</Button>
					</Link>
				</Form>
			</Container>
		</Box>
	)
}

export default Login
