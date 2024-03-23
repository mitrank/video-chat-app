import { Route, Routes } from "react-router-dom";
import LobbyScreen from "./screens/LobbyScreen";
import RoomScreen from "./screens/RoomScreen";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LobbyScreen />} />
        <Route path="/room/:roomId" element={<RoomScreen />} />
      </Routes>
    </>
  );
}

export default App;
