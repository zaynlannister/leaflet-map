import styled from "styled-components";
import Map from "./components/Map";

const App = () => {
  return (
    <StyledMapBox>
      <Map />
    </StyledMapBox>
  );
};

const StyledMapBox = styled.div`
  width: 100%;
  height: 100vh;
`;

export default App;
