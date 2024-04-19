import React, { useState } from "react"
import { Col, Container, Form, FormCheck, FormControl, FormGroup, FormLabel, FormText, Navbar, NavbarBrand, Row } from "react-bootstrap"
import Competitor from "./models/competitor"
import { navBrand } from "./styles"
import GroupFormat, { GroupFormatStrings } from "./models/group-format"

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

  const [groupFormat, setGroupFormat] = useState<GroupFormat>(GroupFormat.Blank)
  const [numBlanksPerGroup, setNumBlanksPerGroup] = useState<number>(0)
  const [numGroups, setNumGroups] = useState<number>(1)

  const [competitors, setCompetitors] = useState<Competitor[]>([])

  const setValue = (e: any, setFunc: React.Dispatch<React.SetStateAction<any>>) => {
    setFunc(e.target.value) // e needs to be any type since React events are weird
  }

  const OptionalCutoffForm = () => (
    <>
      {!!hasCutoff && <>
        <Col xs={3}>
          <FormLabel>Cutoff Minutes</FormLabel>
          <FormControl
            type="number"
            onChange={e => setValue(e, setCutoffMinutes)}
            value={cutoffMinutes}
            min={0}
            max={timeLimitMinutes}
          />
          <FormText />
        </Col>

        <Col xs={3}>
          <FormLabel>Cutoff Seconds</FormLabel>
          <FormControl
            type="number"
            onChange={e => setValue(e, setCutoffSeconds)}
            value={cutoffSeconds}
            min={0}
            max={cutoffMinutes == timeLimitMinutes ? timeLimitSeconds : 59}
          />
          <FormText />
        </Col>
      </>
      }
    </>
  )

  const OptionalNumGroupsForm = () => {
    return <>
      {(GroupFormat.Random == groupFormat) &&
        <Col xs={3}>
          <FormLabel>Number of Groups</FormLabel>
          <FormControl
            type="number"
            onChange={e => setValue(e, setNumGroups)}
            value={numGroups}
            min={1}
          />
          <FormText />
        </Col>}
    </>
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

          <div>
            <FormLabel className="pe-3">Include Cutoff?</FormLabel>
            <FormCheck
              inline
              type="radio"
              label="Yes"
              name="hasCutoff"
              onChange={_ => setHasCutoff(true)}
            />
            <FormCheck
              inline
              type="radio"
              label="No"
              name="hasCutoff"
              checked={!hasCutoff}
              onChange={_ => setHasCutoff(false)}
            />
          </div>

          <Row className="mb-3">
            <Col xs={3}>
              <FormLabel>Time Limit Minutes</FormLabel>
              <FormControl
                type="number"
                onChange={e => setValue(e, setTimeLimitMinutes)}
                value={timeLimitMinutes}
                min={0}
              />
              <FormText />
            </Col>

            <Col xs={3}>
              <FormLabel>Time Limit Seconds</FormLabel>
              <FormControl
                type="number"
                onChange={e => setValue(e, setTimeLimitSeconds)}
                value={timeLimitSeconds}
                min={0}
                max={59}
              />
              <FormText />
            </Col>

            <OptionalCutoffForm />
          </Row>

          <div>
            <FormLabel className="me-3">Group Format</FormLabel>
            {Object.keys(GroupFormat)
              .filter(k => isNaN(Number(k)))
              .map((format: string, i) =>
                <FormCheck
                  key={i}
                  inline
                  type="radio"
                  label={format}
                  name="groupFormat"
                  checked={groupFormat == format}
                  onChange={_ => setGroupFormat(GroupFormat[format as GroupFormatStrings])}
                />
              )}
          </div>

          <Row className="mb-3">
            <Col xs={3}>
              <FormLabel>Number of Blank Scorecards{GroupFormat.Blank != groupFormat && " Per Group"}</FormLabel>
              <FormControl
                type="number"
                onChange={e => setValue(e, setNumBlanksPerGroup)}
                value={numBlanksPerGroup}
                min={0}
              />
              <FormText />
            </Col>

            <OptionalNumGroupsForm />
          </Row>
        </Form>
      </Container>
    </>
  )
}

export default App