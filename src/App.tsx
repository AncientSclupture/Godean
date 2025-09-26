import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PopUpProvider } from "./context/NotificationContext";
import Landing from "./screen/landing";
import ActifityScreen from "./screen/activity";
import FinanceLeagueScreen from "./screen/fi-league";
import W2EScreen from "./screen/work-to-earn";
import TestSM from "./screen/testing-smartcontract";

export default function App() {

  return (
    <PopUpProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} index />
          <Route path="/play" element={<ActifityScreen />} />
          <Route path="/fi-leaguage" element={<FinanceLeagueScreen />} />
          <Route path="/w2e" element={<W2EScreen />} />
          <Route path="/test" element={<TestSM />} />
        </Routes>
      </Router>
    </PopUpProvider>
  )
}