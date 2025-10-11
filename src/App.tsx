import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { PopUpProvider } from "./context/NotificationContext";
import { ModalProvider } from "./context/ModalContext";
import Landing from "./screen/landing";
import ActifityScreen from "./screen/activity";
import FinanceLeagueScreen from "./screen/fi-league";
import W2EScreen from "./screen/work-to-earn";
import TestSM from "./screen/testing-smartcontract";
import TestSocket from "./screen/testing-socket";
import AboutGameScreen from "./screen/about-game";
import FaQScreen from "./screen/faq";
import ContactScreen from "./screen/contact";
import FinanceLeagueGame from "./screen/fi-leaguage-game";
import { GameTransitionDataProvider } from "./context/GameTransitionDataContext";

export default function App() {

  return (
    <AuthProvider>
      <PopUpProvider>
        <ModalProvider>
          <GameTransitionDataProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Landing />} index />
                <Route path="/play" element={<ActifityScreen />} />
                <Route path="/fi-leaguage" element={<FinanceLeagueScreen />} />
                <Route path="/w2e" element={<W2EScreen />} />
                <Route path="/about" element={<AboutGameScreen />} />
                <Route path="/faq" element={<FaQScreen />} />
                <Route path="/contact" element={<ContactScreen />} />
                <Route path="/play-fisim" element={<FinanceLeagueGame />} />
                {/* debug playgorund */}
                <Route path="/test" element={<TestSM />} />
                <Route path="/test-socket" element={<TestSocket />} />
              </Routes>
            </Router>
          </GameTransitionDataProvider>
        </ModalProvider>
      </PopUpProvider>
    </AuthProvider>
  )
}