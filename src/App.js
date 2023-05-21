import Header from "./component/header";
import TopBar from "./component/TopBar";
import MainGrid from "./component/MainGrid";
import "./App.css";

function App() {
  return (
    <div className="App">
      {/* This is the horizontal bar on top with the text */}
      <TopBar />

      {/* The header is currently empty */}
      <Header />

      {/* This houses everything else on the screen:
      MainBox, StatusBar, BasicTextField */}
      <MainGrid />
    </div>
  );
}

export default App;
