import React, { useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  FormCheck,
  FormControl,
  FormLabel,
  FormText,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Row,
  Table,
} from "react-bootstrap";
import Competitor, { newCompetitor } from "./models/competitor";
import GroupFormat, { GroupFormatStrings } from "./models/group-format";
import { randomName } from "./models/sample-names";
import ScorecardGeneratorData from "./models/scorecard-generator-data";
import generateScorecards from "./services/scorecard-service";
import ScorecardGeneratorCopyright from "./components/copyright";
import ScorecardGeneratorNavbar from "./components/navbar";
import { CURRENT_YEAR, NEW_COMPETITOR } from "./services/utils";
import PaperSize, { PaperSizeStrings } from "./models/paper-sizes";

const App = () => {
  const [competition, setCompetition] = useState<string>(
    `My Competition ${CURRENT_YEAR}`
  );
  const [event, setEvent] = useState<string>("My Event");
  const [round, setRound] = useState<number>(1);
  const [numAttempts, setNumAttempts] = useState<number>(5);
  const [paperSize, setPaperSize] = useState<PaperSize>(PaperSize.Letter);

  const [hasCutoff, setHasCutoff] = useState<boolean>(false);
  const [cutoffMinutes, setCutoffMinutes] = useState<number>(0);
  const [cutoffSeconds, setCutoffSeconds] = useState<number>(0);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number>(10);
  const [timeLimitSeconds, setTimeLimitSeconds] = useState<number>(0);

  const [groupFormat, setGroupFormat] = useState<GroupFormat>(
    GroupFormat.Blank
  );
  const [numBlanksPerGroup, setNumBlanksPerGroup] = useState<number>(0);
  const [numGroups, setNumGroups] = useState<number>(1);

  const [includeIds, setIncludeIds] = useState<boolean>(false);

  const [competitorNamePlaceholder, setCompetitorNamePlaceholder] =
    useState<string>("My Competitor");
  const [currentCompetitor, setCurrentCompetitor] = useState<Competitor>(
    newCompetitor()
  );
  const [currentCompetitorIdx, setCurrentCompetitorIdx] = useState<number>(0);
  const [showBulkEntry, setShowBulkEntry] = useState<boolean>(false);
  const [bulkNames, setBulkNames] = useState<string>("");
  const [competitors, setCompetitors] = useState<Competitor[]>([]);

  const [showDeleteAll, setShowDeleteAll] = useState<boolean>(false);

  const setValue = (
    e: any,
    setFunc: React.Dispatch<React.SetStateAction<any>>
  ) => {
    setFunc(e.target.value); // e needs to be any type since React events are weird
  };

  const isManualGroups = () => GroupFormat.Manual == groupFormat;

  const competitorNameColSize = () => {
    if (!includeIds && !isManualGroups()) {
      return 10;
    } else if (
      (includeIds && !isManualGroups()) ||
      (!includeIds && isManualGroups())
    ) {
      return 9;
    } else {
      return 8;
    }
  };

  const getCompetitorNamePlaceholder = (competitors: Competitor[]) =>
    competitors.length > 0 ? randomName() : "My Competitor";

  const addCompetitor = () => {
    if (!currentCompetitor.wcaId) currentCompetitor.wcaId = NEW_COMPETITOR;
    setCompetitors((competitors) => {
      competitors[currentCompetitorIdx] = currentCompetitor;
      setCurrentCompetitorIdx(competitors.length);
      setCompetitorNamePlaceholder(randomName());
      return competitors;
    });
    setCurrentCompetitor(newCompetitor());
  };

  const addCompetitorOnEnter = (e: React.KeyboardEvent<any>) => {
    if ("Enter" == e.key && currentCompetitor.name.length > 0) {
      addCompetitor();
    }
  };

  const addBulkCompetitors = () => {
    // Split the bulk names by new lines and map each line to a competitor object
    const newCompetitors = bulkNames.split(/\n+/).map((n) => {

      // Split the line by '-' to separate name, WCA ID, and group
      const nameWcaRegAndGroup = n.split(/\s*-\s*/);
      const group = nameWcaRegAndGroup[1] || 0;

      // Split the name and WCA ID by '>' to separate registration ID
      const nameWcaAndReg = nameWcaRegAndGroup[0].split(/\s*>\s*/);
      const regId = nameWcaAndReg[1] || 0;

      // Split the name and WCA ID by '|' to separate WCA ID
      const nameAndId = nameWcaAndReg[0].split(/\s*\|\s*/);
      const wcaId = nameAndId[1] || NEW_COMPETITOR;
      return { name: nameAndId[0], wcaId, group, regId } as Competitor;
    });

    if (competitors.length === currentCompetitorIdx) {
      setCurrentCompetitorIdx((curr) => curr + newCompetitors.length);
    }

    setCompetitors((competitors) => [...competitors, ...newCompetitors]);
    setBulkNames("");
    setShowBulkEntry(false);
  };

  const deleteCompetitor = (idx: number) => {
    setCompetitors((competitors) => {
      const deleted = competitors.filter((c) => c !== competitors[idx]);
      setCompetitorNamePlaceholder(getCompetitorNamePlaceholder(deleted));
      return deleted;
    });
  };

  const OptionalCutoffForm = () => (
    <>
      {!!hasCutoff && (
        <>
          <Col xs={3}>
            <FormLabel>Cutoff Minutes</FormLabel>
            <FormControl
              type="number"
              onChange={(e) => setValue(e, setCutoffMinutes)}
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
              onChange={(e) => setValue(e, setCutoffSeconds)}
              value={cutoffSeconds}
              min={0}
              max={cutoffMinutes == timeLimitMinutes ? timeLimitSeconds : 59}
            />
            <FormText />
          </Col>
        </>
      )}
    </>
  );

  const OptionalNumGroupsForm = () => {
    return (
      <>
        {GroupFormat.Blank != groupFormat && (
          <Col xs={3}>
            <FormLabel>Number of Groups</FormLabel>
            <FormControl
              type="number"
              onChange={(e) => setValue(e, setNumGroups)}
              value={numGroups}
              min={1}
            />
            <FormText />
          </Col>
        )}
      </>
    );
  };

  return (
    <>
      <ScorecardGeneratorNavbar />

      <Container className="mt-3">
        <h3>Competition Info</h3>
        <Form>
          <Row className="mb-3">
            <Col xs={12} md>
              <FormLabel>Competition Name</FormLabel>
              <FormControl
                type="text"
                onChange={(e) => setValue(e, setCompetition)}
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
                onChange={(e) => setValue(e, setEvent)}
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
                onChange={(e) => setValue(e, setRound)}
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
                onChange={(e) => setValue(e, setNumAttempts)}
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
              onChange={(_) => setHasCutoff(true)}
            />
            <FormCheck
              inline
              type="radio"
              label="No"
              name="hasCutoff"
              checked={!hasCutoff}
              onChange={(_) => setHasCutoff(false)}
            />
          </>

          <Row className="mb-3">
            <Col xs={3}>
              <FormLabel>Time Limit Minutes</FormLabel>
              <FormControl
                type="number"
                onChange={(e) => setValue(e, setTimeLimitMinutes)}
                value={timeLimitMinutes}
                min={0}
              />
              <FormText />
            </Col>

            <Col xs={3}>
              <FormLabel>Time Limit Seconds</FormLabel>
              <FormControl
                type="number"
                onChange={(e) => setValue(e, setTimeLimitSeconds)}
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
                .filter((k) => isNaN(Number(k)))
                .map((format: string, i) => (
                  <FormCheck
                    key={i}
                    inline
                    type="radio"
                    label={format}
                    name="groupFormat"
                    checked={groupFormat == format}
                    onChange={(_) => {
                      const gf = GroupFormat[format as GroupFormatStrings];
                      setGroupFormat(gf);
                      if (GroupFormat.Blank == gf) {
                        setNumGroups(1);
                      }
                    }}
                  />
                ))}
            </Col>

            <Col xs={6}>
              <FormLabel className="mx-3">Include Registrant IDs?</FormLabel>
              <FormCheck
                inline
                type="radio"
                label="Yes"
                name="includeIds"
                onChange={(_) => setIncludeIds(true)}
              />
              <FormCheck
                inline
                type="radio"
                label="No"
                name="includeIds"
                checked={!includeIds}
                onChange={(_) => setIncludeIds(false)}
              />
            </Col>
          </Row>

          <Row>
            <Col xs={6}>
              <FormLabel className="me-3">Paper Size</FormLabel>
              {Object.keys(PaperSize)
                .filter((k) => isNaN(Number(k)))
                .map((size: string, i) => {
                  const sz = PaperSize[size as PaperSizeStrings];
                  return (
                    <FormCheck
                      key={i}
                      inline
                      type="radio"
                      label={size}
                      name="paperSize"
                      checked={paperSize == sz}
                      onChange={(_) => setPaperSize(sz)}
                    />
                  );
                })}
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={3}>
              <FormLabel>
                Number of Blank Scorecards
                {GroupFormat.Blank != groupFormat && " Per Group"}
              </FormLabel>
              <FormControl
                type="number"
                onChange={(e) => setValue(e, setNumBlanksPerGroup)}
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
            {includeIds && (
              <Col xs={1}>
                <FormLabel>ID</FormLabel>
                <FormControl
                  type="number"
                  onChange={(e) =>
                    setCurrentCompetitor((c) => ({
                      ...c,
                      regId: Number(e.target.value),
                    }))
                  }
                  value={currentCompetitor.regId}
                  min={1}
                />
              </Col>
            )}
            {isManualGroups() && (
              <Col xs={1}>
                <FormLabel>Group</FormLabel>
                <FormControl
                  type="number"
                  onChange={(e) =>
                    setCurrentCompetitor((c) => ({
                      ...c,
                      group: Number(e.target.value),
                    }))
                  }
                  value={currentCompetitor.group}
                  min={1}
                />
              </Col>
            )}
            <Col xs={2}>
              <FormLabel>WCA ID</FormLabel>
              <FormControl
                type="text"
                onChange={(e) =>
                  setCurrentCompetitor((c) => ({ ...c, wcaId: e.target.value }))
                }
                value={currentCompetitor.wcaId}
                placeholder="Leave blank if no ID"
                onKeyDown={addCompetitorOnEnter}
              />
            </Col>
            <Col xs={competitorNameColSize()}>
              <FormLabel>Competitor Name</FormLabel>
              <FormControl
                type="text"
                onChange={(e) =>
                  setCurrentCompetitor((c) => ({ ...c, name: e.target.value }))
                }
                value={currentCompetitor.name}
                placeholder={competitorNamePlaceholder}
                onKeyDown={addCompetitorOnEnter}
              />
            </Col>
          </Row>
        </Form>

        <Button
          variant="primary"
          disabled={currentCompetitor.name.length === 0}
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
        <Button
          variant="outline-danger"
          disabled={competitors.length === 0}
          onClick={() => setShowDeleteAll(true)}
        >
          Delete All Competitors
        </Button>
      </Container>

      <Container className="mt-4">
        {competitors.length > 0 && (
          <>
            <h6>{competitors.length} Competitors Assigned
            <Button
              className="mx-3"
              variant="success"
              onClick={() => {
                const data: ScorecardGeneratorData = {
                  competition,
                  event,
                  round,
                  numAttempts,
                  paperSize,
                  hasCutoff,
                  cutoffMinutes,
                  cutoffSeconds,
                  timeLimitMinutes,
                  timeLimitSeconds,
                  groupFormat,
                  numBlanksPerGroup,
                  numGroups,
                  competitors: competitors.filter((c) => !!c),
                };
                generateScorecards(data);
              }}
            >
              Generate Scorecards
            </Button>
            </h6>
            <Table striped bordered hover>
              <thead>
                <tr>
                  {includeIds && <th>ID</th>}
                  {isManualGroups() && <th>Group</th>}
                  <th>WCA ID</th>
                  <th>Competitor Name</th>
                  <th>Modify?</th>
                </tr>
              </thead>
              <tbody>
                {competitors.map((c, i) => (
                  <tr key={i}>
                    {includeIds && <td>{c.regId}</td>}
                    {isManualGroups() && <td>{c.group}</td>}
                    <td>{c.wcaId}</td>
                    <td>{c.name}</td>
                    <td>
                      <Button
                        className="me-1"
                        variant="warning"
                        size="sm"
                        onClick={() => {
                          setCurrentCompetitor(competitors[i]);
                          setCurrentCompetitorIdx(i);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          deleteCompetitor(i);
                          setCurrentCompetitorIdx((curr) => curr - 1);
                        }}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
      </Container>

      <Container>
        <Button
          variant="success"
          size="lg"
          onClick={() => {
            const data: ScorecardGeneratorData = {
              competition,
              event,
              round,
              numAttempts,
              paperSize,
              hasCutoff,
              cutoffMinutes,
              cutoffSeconds,
              timeLimitMinutes,
              timeLimitSeconds,
              groupFormat,
              numBlanksPerGroup,
              numGroups,
              competitors: competitors.filter((c) => !!c),
            };
            generateScorecards(data);
          }}
        >
          Generate Scorecards
        </Button>
      </Container>

      <ScorecardGeneratorCopyright className="mt-4" />

      <Modal show={showBulkEntry} onHide={() => setShowBulkEntry(false)}>
        <ModalHeader closeButton>
          <ModalTitle>Bulk Competitor Entry</ModalTitle>
        </ModalHeader>

        <ModalBody>
          <FormLabel>
            Enter a list of competitors, one name per line. To include WCA IDs,
            use the format <code>name | wca_id</code>. To include registration
            IDs, use the format <code>name &gt; reg_id</code> or{" "}
            <code>name | wca_id &gt; reg_id</code>.
            
            To include groups, add the group number at the end separated by
            a dash, e.g. <code>- group</code>.
          </FormLabel>
          <FormControl
            as="textarea"
            rows={4}
            placeholder="Competitor Names Here"
            value={bulkNames}
            onChange={(e) => setValue(e, setBulkNames)}
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

      <Modal show={showDeleteAll} onHide={() => setShowDeleteAll(false)}>
        <ModalBody>
          Are you sure? This will delete <strong>ALL</strong> competitors! This
          action cannot be undone.
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowDeleteAll(false)}>
            Close
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              setCompetitors([]);
              setCompetitorNamePlaceholder("My Competitor");
              setShowDeleteAll(false);
            }}
          >
            Yes, delete all competitors
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default App;
