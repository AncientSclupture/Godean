import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { PopUpProvider } from "./context/NotificationContext";
import { ModalProvider } from "./context/ModalContext";
import { GameTransitionDataProvider } from "./context/GameTransitionDataContext";

import Landing from "./screen/landing";
import ActifityScreen from "./screen/activity";
import FinanceLeagueScreen from "./screen/fi-league";
import W2EScreen from "./screen/work-to-earn";

import TestSM from "./screen/testing-smartcontract";
import TestSocket from "./screen/testing-socket";

import AboutGameScreen from "./screen/about-game";
import FaQScreen from "./screen/faq";
import ContactScreen from "./screen/contact";

import PeacefullVillageGameScreen from "./screen/game-screen/peacefull-village-game";
import AdventureSurivivalGameScreen from "./screen/game-screen/adventure-surivival-game";
import HideAndSeekGameScreen from "./screen/game-screen/hidenseek-game";
import FinanceLeagueGameScreen from "./screen/game-screen/fi-leaguage-game";
import FinanceLeagueDoIKnowInvestmentGameScreen from "./screen/game-screen/fi-leaguage-diki";
import FinanceLeagueWhoIsFraudGameScreen from "./screen/game-screen/fi-league-wif-game";

export default function App() {

  return (
    <AuthProvider>
      <PopUpProvider>
        <ModalProvider>
          <GameTransitionDataProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Landing />} index />
                <Route path="/about" element={<AboutGameScreen />} />
                <Route path="/faq" element={<FaQScreen />} />
                <Route path="/contact" element={<ContactScreen />} />
                
                <Route path="/play" element={<ActifityScreen />} />
                <Route path="/fi-leaguage" element={<FinanceLeagueScreen />} />
                <Route path="/w2e" element={<W2EScreen />} />

                {/* games and scene setup */}
                <Route path="/play-fisim-whoisfraud" element={<FinanceLeagueWhoIsFraudGameScreen />} />
                <Route path="/play-fisim-doiknow" element={<FinanceLeagueDoIKnowInvestmentGameScreen />} />
                <Route path="/play-fisim-realinvestment" element={<FinanceLeagueGameScreen />} />
                
                <Route path="/play-peacefull-village" element={<PeacefullVillageGameScreen />} />
                <Route path="/play-adventure-survival" element={<AdventureSurivivalGameScreen />} />
                <Route path="/play-hideandseek" element={<HideAndSeekGameScreen />} />
                
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