"use client";

import { Box, Paper } from "@mui/material"
import { ChatCompletionRequestMessage } from "openai"
import ReactMarkdown from "react-markdown"

export interface ChatMessageProps extends ChatCompletionRequestMessage {
    aiName?: string
}

const ChatMessage = ({ role, content, aiName }: ChatMessageProps) => {
    return (
        <Box sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            backgroundColor: role === "user" ? "#FFF" : "rgba(247,247,248)",
            borderBottom: "1px solid rgba(0,0,0,.1)"
        }}>
            <Box
                sx={{
                    display: 'flex',
                    '& > :not(style)': {
                    m: 1,
                    width: 64,
                    height: 64,
                    },
                }}
                >
                <Paper 
                    variant="outlined" 
                    square
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    { role === "user" ? "You" : aiName ?? "AI"}
                </Paper>
            </Box>
            <Box sx={{
                padding: "0.5rem",
                width: "100%",
            }}>
                <ReactMarkdown>{ content }</ReactMarkdown>
            </Box>
        </Box>
    )
}

export default ChatMessage