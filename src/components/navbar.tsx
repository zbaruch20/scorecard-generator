import { Container, Navbar, NavbarBrand } from "react-bootstrap";
import { navBrand } from "../styles";

const ScorecardGeneratorNavbar = () => (
  <Navbar bg="primary">
    <Container>
      <NavbarBrand className="text-light h1" style={navBrand}>
        Competition Scorecard Generator
      </NavbarBrand>
    </Container>
  </Navbar>
);

export default ScorecardGeneratorNavbar;
