import { Container, Navbar, NavbarBrand } from "react-bootstrap"

const Home = () => {
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