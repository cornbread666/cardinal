import Navbar from "./components/Navbar";
import Page from "./components/Page";
import About from "./components/About";

function App() {
  return (
    <main className="max-w-full flex flex-col justify-center items-center">
      <Navbar />
      <Page
        name={ "Cardinal" }
        gif={ "src/assets/cardinal.gif" }
        desc={ "Simple and elegant daily puzzle game" }
        link= { "https://cornbread.games" }
      />
      <Page
        name={ "Pixel Fight" }
        gif={ "src/assets/pixelfight.gif" }
        desc={ "Zero-player game that uses Chart.js for dynamic data visualization" }
        link= { "https://cornbread.games/pixel-fight" }
      />
      <Page
        name={ "Tangleroot" }
        gif={ "src/assets/tangleroot.gif" }
        desc={ "Modular probability calculator designed for Old School RuneScape players" }
        link= { "https://cornbread.games/tangleroot" }
      />
      <Page
        name={ "Tumbleweed (WIP)" }
        gif={ "src/assets/tumbleweed.gif" }
        desc={ "Abstract personality quiz that matches you with a unique tumbleweed generated using p5.js" }
        link= { "https://cornbread.games/tumbleweed" }
      />
      <Page
        name={ "Cardinal: Compass Sudoku" }
        gif={ "src/assets/cardinal_app.png" }
        desc={ "iOS version of the Cardinal daily puzzle game written in Swift" }
        link= { "https://apps.apple.com/us/app/id1524115161?fbclid=IwAR1z3Z3rtt0TYrJrU0cD4M0SAxx6fFPXSZrpeHNwPI48fe448CV-tfTBhp8" }
      />
      <About />
    </main>
  );
}

export default App;