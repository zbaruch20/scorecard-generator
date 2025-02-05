import { Container } from "react-bootstrap";
import { copyright } from "../styles";
import { CURRENT_YEAR } from "../services/utils";

export interface CopyrightProps {
  className?: string;
}

const ScorecardGeneratorCopyright = ({ className }: CopyrightProps) => (
  <Container style={copyright} className={className}>
    <p className="my-1">
      © {CURRENT_YEAR} Zach Baruch |{" "}
      <a
        href="https://github.com/zbaruch20/scorecard-generator"
        target="_blank"
      >
        GitHub
      </a>{" "}
      |{" "}
      <a
        href="https://www.worldcubeassociation.org/persons/2017BARU01"
        target="_blank"
      >
        WCA
      </a>
    </p>
    <p className="my-1">
      Scorecard design adapted from{" "}
      <a href="https://groupifier.jonatanklosko.com/">Groupifier</a> by Jonatan
      Kłosko |{" "}
      <a href="https://github.com/jonatanklosko/groupifier" target="_blank">
        GitHub
      </a>
    </p>
  </Container>
);

export default ScorecardGeneratorCopyright;
