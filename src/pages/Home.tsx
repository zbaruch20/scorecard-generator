import { useState } from "react"
import { Container, Navbar, NavbarBrand } from "react-bootstrap"
import Competitor from "../models/competitor"

const Home = () => {
  const [competition, setCompetition] = useState<string>(`My Competition ${new Date().getFullYear}`)
  const [event, setEvent] = useState<string>('Event')
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

  return (
    <>
      <Navbar bg="primary">
        <Container>
          <NavbarBrand className="text-light h1" style={{ fontSize: '32px' }}>
            Competition Scorecard Generator
          </NavbarBrand>
        </Container>
      </Navbar>
    </>
  )
}

export default Home