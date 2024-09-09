import React, { useState } from "react"
import { Button, Col, Container, Form, FormCheck, FormControl, FormGroup, FormLabel, FormText, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle, Navbar, NavbarBrand, Row, Table } from "react-bootstrap"
import Competitor, { newCompetitor } from "./models/competitor"
import { navBrand } from "./styles"
import GroupFormat, { GroupFormatStrings } from "./models/group-format"
import { randomName } from "./models/sample-names"

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

  const [includeIds, setIncludeIds] = useState<boolean>(false)

  const [competitorNamePlaceholder, setCompetitorNamePlaceholder] = useState<string>("My Competitor")
  const [currentCompetitor, setCurrentCompetitor] = useState<Competitor>(newCompetitor())
  const [currentCompetitorIdx, setCurrentCompetitorIdx] = useState<number>(0)
  const [showBulkEntry, setShowBulkEntry] = useState<boolean>(false)
  const [bulkNames, setBulkNames] = useState<string>('')
  const [competitors, setCompetitors] = useState<Competitor[]>([])

  const setValue = (e: any, setFunc: React.Dispatch<React.SetStateAction<any>>) => {
    setFunc(e.target.value) // e needs to be any type since React events are weird
  }

  const isManualGroups = () => GroupFormat.Manual == groupFormat

  const competitorNameColSize = () => {
    if (!includeIds && !isManualGroups()) {
      return 12;
    } else if ((includeIds && !isManualGroups()) || (!includeIds && isManualGroups())) {
      return 11;
    } else {
      return 10;
    }
  }

  const getCompetitorNamePlaceholder = (competitors: Competitor[]) => (
    competitors.length > 0 ? randomName() : "My Competitor"
  )

  const addCompetitor = () => {
    setCompetitors(competitors => {
      competitors[currentCompetitorIdx] = currentCompetitor
      setCurrentCompetitorIdx(competitors.length)
      setCompetitorNamePlaceholder(randomName())
      return competitors
    })
    setCurrentCompetitor(newCompetitor())
  }

  const addBulkCompetitors = () => {
    const newCompetitors = bulkNames.split(/\n/)
      .map((n) => ({name: n} as Competitor))
    setCompetitors(competitors => [...competitors, ...newCompetitors])
    setBulkNames('')
    setShowBulkEntry(false)
  }

  const deleteCompetitor = (idx: number) => {
    setCompetitors(competitors => {
      const deleted = competitors.filter(c => c !== competitors[idx])
      setCompetitorNamePlaceholder(getCompetitorNamePlaceholder(deleted))
      return deleted
    })
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
        <h3>Competition Info</h3>
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

          <>
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
          </>

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

          <Row className="me-3">
            <Col xs={6}>
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
            </Col>

            <Col xs={6}>
              <FormLabel className="mx-3">Include Competitor IDs?</FormLabel>
              <FormCheck
                inline
                type="radio"
                label="Yes"
                name="includeIds"
                onChange={_ => setIncludeIds(true)}
              />
              <FormCheck
                inline
                type="radio"
                label="No"
                name="includeIds"
                checked={!includeIds}
                onChange={_ => setIncludeIds(false)}
              />
            </Col>
          </Row>

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

          <hr />

          <h3>Competitors</h3>
          <Row className="mb-3">
            {includeIds &&
              <Col xs={1}>
                <FormLabel>ID</FormLabel>
                <FormControl
                  type="number"
                  onChange={e => setCurrentCompetitor(c => ({ ...c, id: Number(e.target.value) }))}
                  value={currentCompetitor.id}
                  min={1}
                />
              </Col>
            }
            {isManualGroups() &&
              <Col xs={1}>
                <FormLabel>Group</FormLabel>
                <FormControl
                  type="number"
                  onChange={e => setCurrentCompetitor(c => ({ ...c, group: Number(e.target.value) }))}
                  value={currentCompetitor.group}
                  min={1}
                />
              </Col>
            }
            <Col xs={competitorNameColSize()}>
              <FormLabel>Competitor Name</FormLabel>
              <FormControl
                type="text"
                onChange={e => setCurrentCompetitor(c => ({ ...c, name: e.target.value }))}
                value={currentCompetitor.name}
                placeholder={competitorNamePlaceholder}
                onKeyDown={(e) => {
                  if ("Enter" == e.key && currentCompetitor.name.length > 0) {
                    addCompetitor()
                  }
                }}
              />
            </Col>
          </Row>
        </Form>

        <Button
          variant="primary"
          disabled={currentCompetitor.name.length == 0}
          onClick={addCompetitor}
        >
          Add Competitor
        </Button>
        <Button
          className="mx-2"
          variant="outline-primary"
          onClick={() => setShowBulkEntry(true)}
        >
          Bulk Entry
        </Button>
      </Container>

      <Container className="mt-4">
        {competitors.length > 0 &&
          <Table striped bordered hover>
            <thead>
              <tr>
                {includeIds && <th>ID</th>}
                {isManualGroups() && <th>Group</th>}
                <th>Competitor Name</th>
                <th>Modify?</th>
              </tr>
            </thead>
            <tbody>
              {competitors.map((c, i) =>
                <tr key={i}>
                  {includeIds && <td>{c.id}</td>}
                  {isManualGroups() && <td>{c.group}</td>}
                  <td>{c.name}</td>
                  <td>
                    <Button
                      className="me-1"
                      variant="warning"
                      size="sm"
                      onClick={() => {
                        setCurrentCompetitor(competitors[i])
                        setCurrentCompetitorIdx(i)
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        deleteCompetitor(i)
                        setCurrentCompetitorIdx(curr => curr - 1)
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        }
      </Container>

      <Modal show={showBulkEntry} onHide={() => setShowBulkEntry(false)}>
        <ModalHeader closeButton>
          <ModalTitle>Bulk Competitor Entry</ModalTitle>
        </ModalHeader>

        <ModalBody>
          <FormLabel>Enter a list of competitors, one name per line:</FormLabel>
          <FormControl
            as="textarea"
            rows={4}
            placeholder='Competitor Names Here'
            value={bulkNames}
            onChange={e => setValue(e, setBulkNames)}
          />
        </ModalBody>

        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowBulkEntry(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={addBulkCompetitors}>
            Add Competitors
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

export default App