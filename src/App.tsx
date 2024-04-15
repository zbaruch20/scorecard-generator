import React, { useState } from "react"
import { Col, Container, Form, FormControl, FormGroup, FormLabel, FormText, Navbar, NavbarBrand, Row } from "react-bootstrap"
import Competitor from "./models/competitor"
import { navBrand } from "./styles"

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
          <NavbarBrand className="text-light h1" style={navBrand}>
            Competition Scorecard Generator
          </NavbarBrand>
        </Container>
      </Navbar>

      <Container className="mt-3">
        <Form>
          <Row className="mb-3">
            <Col xs={12} md>
              <FormLabel>Competition Name</FormLabel>
              <FormControl
                type="text"
                onChange={e => setValue(e, setCompetition)}
                placeholder={competition}
              />
              <FormText />
              {/* only include space if smaller than md */}
              <p className="d-md-none mb-3"></p> 
            </Col>

            <Col xs={12} md>
              <FormLabel>Event Name</FormLabel>
              <FormControl
                type="text"
                onChange={e => setValue(e, setEvent)}
                placeholder={event}
              />
              <FormText />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <FormLabel>Round</FormLabel>
              <FormControl
                type="number"
                onChange={e => setValue(e, setRound)}
                value={round}
                min={1}
                max={4}
              />
              <FormText />
            </Col>

            <Col>
              <FormLabel>Number of Attempts</FormLabel>
              <FormControl
                type="number"
                onChange={e => setValue(e, setNumAttempts)}
                value={numAttempts}
                min={1}
                max={5}
              />
              <FormText />
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  )
}

export default App