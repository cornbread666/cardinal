import Navbar from "./components/Navbar";
import Page from "./components/Page";
import About from "./components/About";

import cardinalGIF from "./assets/cardinal.gif";
import pixelfightGIF from "./assets/pixelfight.gif";
import tanglerootGIF from "./assets/tangleroot.gif";
import tumbleweedGIF from "./assets/tumbleweed.gif";
import cardinalAppPNG from "./assets/cardinal_app.png";

function App() {
  return (
    <main className="max-w-full flex flex-col justify-center items-center">
      <Navbar />
      <Page
        name={ "Cardinal" }
        gif={ cardinalGIF }
        desc={ "Simple and elegant daily puzzle game" }
        link= { "https://cornbread.games" }
      />
      <Page
        name={ "Pixel Fight" }
        gif={ pixelfightGIF }
        desc={ "Zero-player game that uses Chart.js for dynamic data visualization" }
        link= { "https://cornbread.games/pixel-fight" }
      />
      <Page
        name={ "Tangleroot" }
        gif={ tanglerootGIF }
        desc={ "Modular probability calculator designed for Old School RuneScape players" }
        link= { "https://cornbread.games/tangleroot" }
      />
      <Page
        name={ "Tumbleweed (WIP)" }
        gif={ tumbleweedGIF }
        desc={ "Abstract personality quiz that matches you with a unique tumbleweed generated using p5.js" }
        link= { "https://cornbread.games/tumbleweed" }
      />
      <Page
        name={ "Cardinal: Compass Sudoku" }
        gif={ cardinalAppPNG }
        desc={ "iOS version of the Cardinal daily puzzle game written in Swift" }
        link= { "https://apps.apple.com/us/app/id1524115161?fbclid=IwAR1z3Z3rtt0TYrJrU0cD4M0SAxx6fFPXSZrpeHNwPI48fe448CV-tfTBhp8" }
      />
      <About />
    </main>
  );
}

export default App;