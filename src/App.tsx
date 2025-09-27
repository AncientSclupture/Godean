import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PopUpProvider } from "./context/NotificationContext";
import Landing from "./screen/landing";
import ActifityScreen from "./screen/activity";
import FinanceLeagueScreen from "./screen/fi-league";
import W2EScreen from "./screen/work-to-earn";
import TestSM from "./screen/testing-smartcontract";
import TestSocket from "./screen/testing-socket";
import { AuthProvider } from "./context/AuthContext";

export default function App() {

  return (
    <AuthProvider>
      <PopUpProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} index />
            <Route path="/play" element={<ActifityScreen />} />
            <Route path="/fi-leaguage" element={<FinanceLeagueScreen />} />
            <Route path="/w2e" element={<W2EScreen />} />
            {/* debug playgorund */}
            <Route path="/test" element={<TestSM />} />
            <Route path="/test-socket" element={<TestSocket />} />
          </Routes>
        </Router>
      </PopUpProvider>
    </AuthProvider>
  )
}