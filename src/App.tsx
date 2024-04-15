import React, { useState } from "react"
import { Container, Form, FormControl, FormGroup, FormLabel, FormText, Navbar, NavbarBrand } from "react-bootstrap"
import Competitor from "./models/competitor"

const App = () => {
  const [competition, setCompetition] = useState<string>(`My Competition ${new Date().getFullYear()}`)
  const [event, setEvent] = useState<string>('My Event')
  const [round, setRound] = useState<number>(1)
  const [numAttempts, setNumAttempts] = useState<number>(5)
  const [hasCutoff, setHasCutoff] = useState<boolean>(false)
  const [cutoffMinutes, setCutoffMinutes] = useState<number>(0)
  const [cutoffSeconds, setCutoffSeconds] = useState<number>(0)
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number>(10)
  const [timeLimitSeconds, setTimeLimitSeconds] = useState<number>(0)
  const [numGroups, setNumGroups] = useState<number>(1)
  const [numBlanksPerGroup, setNumBlanksPerGroup] = useState<number>(4)
  const [competitors, setCompetitors] = useState<Competitor[]>([])

  const [useRandomGroups, setUseRandomGroups] = useState<boolean>(true)
  const [useCustomIds, setUseCustomIds] = useState<boolean>(false)

  const setValue = (e: any, setFunc: React.Dispatch<React.SetStateAction<any>>) => {
    setFunc(e.target.value) // e needs to be any type since React events are weird
  }

  return (
    <>
      <Navbar bg="primary">
        <Container>
          <NavbarBrand className="text-light h1" style={{ fontSize: '32px' }}>
            Competition Scorecard Generator
          </NavbarBrand>
        </Container>
      </Navbar>

      <Container style={{ marginTop: "1em" }}>
        <Form>
          <FormGroup className="mb-3">
            <FormLabel>Competition Name</FormLabel>
            <FormControl
              type="text"
              onChange={e => setValue(e, setCompetition)}
              placeholder={competition}
            />
            <FormText />
          </FormGroup>

          <FormGroup className="mb-3">
            <FormLabel>Event Name</FormLabel>
            <FormControl
              type="text"
              onChange={e => setValue(e, setEvent)}
              placeholder={event}
            />
            <FormText />
          </FormGroup>
        </Form>
      </Container>
    </>
  )
}

export default App