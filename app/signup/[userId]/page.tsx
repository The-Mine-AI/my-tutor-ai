"use client";

import Container from '@mui/material/Container'
import StepWizard, { StepWizardChildProps } from "react-step-wizard";

import React from 'react'
import { Form } from 'react-bootstrap';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { SupportedCurriculums, SupportedGrades, SupportedLanguages, SupportedSubjects } from '@/constants/schema';
import Link from 'next/link';

const Steps = [
  "Name",
  "Curriculum",
  "Grade",
  "Language",
  "Subject"
  // "School"
]

const StepQuestions = [
  "Let's start! What is your Name?",
  "What curriculum are you in?",
  "What class do you study in?",
  "What’s your preferred language of Studying?",
  "What subject would you like to study?"
]

type StepData = {
  name: string,
  curriculum: string,
  grade: string,
  language: string,
  subject: string,

  setVal: React.Dispatch<React.SetStateAction<string>>
}

function Step(props: StepWizardChildProps<StepData>) {

  const { currentStep } = props
  const { name, curriculum, grade, language, subject } = props
  const { setVal } = props


  let buttonComponent = (
    <Button sx={{
      color: "black",
      border: 1,
      marginLeft: "5%"
      }}
      type={currentStep === Steps.length ? "submit" : "button"}
      onClick={() => currentStep === Steps.length ? null : props.nextStep()}
      >
      {currentStep === Steps.length ? "Finish" : "Next"}
    </Button>
  )
  

  let selectOptions: (string | number)[] = []
  switch (currentStep) {
    case 2:
      selectOptions = SupportedCurriculums
      break
    case 3:
      selectOptions = SupportedGrades
      break
    case 4:
      selectOptions = SupportedLanguages
      break
    case 5:
      selectOptions = SupportedSubjects
      buttonComponent = (
        <Link href={`/tutor?name=${name}&curriculum=${curriculum}&grade=${grade}&language=${language}&subject=${subject}`}>
          {buttonComponent}
        </Link>
      )
      break

  }

  return (
    <Container>
      <Typography 
				variant="h3"
				sx={{
					marginBottom: "5%",
				}}
			>
				{ `${currentStep}. ${StepQuestions[currentStep - 1]}` }
			</Typography>
      
      <Box className='flex flex-row items-between'>
        {
        currentStep === 1 ? <Form.Control 
          type="input" 
          style={{ width: "90%" }}
          onChange={(e) => setVal(e.target.value)}
        /> : (
          <Form.Select 
            aria-label="select" 
            style={{ width: "90%" }}
            onChange={(e) => setVal(e.target.value)}
          >
            { selectOptions.map((option, index) => <option key={index} value={option}>{option === "undefined" ? "No specific curriculum" : option}</option>) }
          </Form.Select>
        )
        }
        {buttonComponent}
      </Box>
    </Container>
  )
}


function Page() {

  const [name, setName] = React.useState<string>('')
  const [curriculum, setCurriculum] = React.useState<string>(SupportedCurriculums[0])
  const [grade, setGrade] = React.useState<string>(SupportedGrades[0])
  const [language, setLanguage] = React.useState<string>(SupportedLanguages[0])
  const [subject, setSubject] = React.useState<string>(SupportedSubjects[0])

  return (
    <Box className="flex justify-center" style={{ height: "100vh" }}>
    <StepWizard className="mt-60">
      { Steps.map((step, index) => <Step 
        key={index} 
        stepName={step} 
        name={name} 
        curriculum={curriculum}
        grade={grade}
        language={language}
        subject={subject}
        setVal={index === 0 ? setName : index === 1 ? setCurriculum : index === 2 ? setGrade : index === 3 ? setLanguage : setSubject}
        />) }
    </StepWizard>
    </Box>
  )
}

export default Page
