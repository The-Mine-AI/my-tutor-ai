"use client";

import Chat from '@/app/components/Chat'
import InteractiveCurriculum from '@/app/components/InteractiveCurriculum';
import Box from '@mui/material/Box'
import { useSearchParams } from 'next/navigation';
import React from 'react'

export type TutorContextProps = {
    grade: number | string,
    curriculum?: string,
    subject: string,
    book?: string,
}

export interface TutorProps extends TutorContextProps {
    name: string,
    language: string
}

function Tutor() {


    const searchParams = useSearchParams()
    const name = searchParams.get('name')
    const grade = searchParams.get('grade')
    const curriculum = searchParams.get('curriculum')
    const language = searchParams.get('language')
    const subject = searchParams.get('subject')

    if (!name || !grade || !curriculum || !language || !subject) {
        return <div>Error...</div>
    }

    return (
        <Box className="grid grid-cols-4" sx={{ height: "94vh" }}>
            <Box className="col-span-1">
                <InteractiveCurriculum grade={grade} curriculum={curriculum === "undefined" ? undefined : curriculum} subject={subject} />
            </Box>
            <Box sx={{
                borderLeft: "1px solid #D3D3D3",
                borderRight: "1px solid #D3D3D3",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100vh"
            }} className="col-span-2">
                <Chat grade={grade} curriculum={curriculum === "undefined" ? undefined : curriculum} subject={subject} name={name} language={language} />
            </Box>
            <Box className="col-span-1">
            </Box>
        </Box>
    )
}

export default Tutor
