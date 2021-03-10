import ReactDOM from 'react-dom'
import React from 'react'
import axios from "axios";
import './index.css';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            wordCheckEmployed: false,
            seconds: 30,
            definitions: [],
            letterCount: 0,
            letters: [],
            playMode: "choosingLetters", // choosingLetters, ready, finished
            secondsDegrees: 90,
            computerChoicesOpen: false,
            enteredText: '',
            wordMismatch: false,
          };

          this.getVowel = this.getVowel.bind(this);
          this.getConsonant = this.getConsonant.bind(this);
          this.checkLetters = this.checkLetters.bind(this);
          this.startPlayback = this.startPlayback.bind(this);
          this.startTimer = this.startTimer.bind(this);
          this.countDown = this.countDown.bind(this);
          this.checkWord = this.checkWord.bind(this);
          this.getComputerAnagrams = this.getComputerAnagrams.bind(this);
          this.showComputerChoices = this.showComputerChoices.bind(this);
          this.checkWordInDictionary = this.checkWordInDictionary.bind(this);
          this.playAgain = this.playAgain.bind(this);          

      }

      getVowel() {
        const vowelsArray = [
          ["A", 15],
          ["E", 21],
          ["I", 13],
          ["O", 13],
          ["U", 5],
        ];
    
        // Get the total weight
        let total = 1;
        for (let i = 0; i < vowelsArray.length; ++i) {
          total += vowelsArray[i][1];
        }
    
        // console.log({ total });
    
        // Get random index
        const threshold = Math.floor(Math.random() * total);
    
        // console.log({ threshold });
    
        // Find value that meets threshold
        total = 0;
        for (let i = 0; i < vowelsArray.length; ++i) {
          // Add the weight to our running total.
          total += vowelsArray[i][1];
    
          // If this value falls within the threshold, we're done!
          if (total >= threshold) {
            const randomVowel = vowelsArray[i][0];
            this.setState(
              {
                letters: [...this.state.letters, randomVowel],
                letterCount: this.state.letterCount + 1,
              },
              () => this.checkLetters()
            );
            break;
          }
        }
      };

      getConsonant() {
        const consonantsArray = [
          ["B", 2],
          ["C", 3],
          ["D", 6],
          ["F", 2],
          ["G", 3],
          ["H", 2],
          ["J", 1],
          ["K", 1],
          ["L", 5],
          ["M", 4],
          ["N", 8],
          ["P", 4],
          ["Q", 1],
          ["R", 9],
          ["S", 9],
          ["T", 9],
          ["V", 1],
          ["W", 1],
          ["X", 1],
          ["Y", 1],
          ["Z", 1],
        ];
    
        // Get the total weight
        let total = 1;
        for (let i = 0; i < consonantsArray.length; ++i) {
          total += consonantsArray[i][1];
        }
    
        // console.log({ total });
    
        // Get random index
        const threshold = Math.floor(Math.random() * total);
    
        // Find value that meets threshold
        total = 0;
        for (let i = 0; i < consonantsArray.length; ++i) {
          // Add the weight to our running total.
          total += consonantsArray[i][1];
    
          // If this value falls within the threshold, we're done!
          if (total >= threshold) {
            const randomConsonant = consonantsArray[i][0];
            this.setState(
              {
                letters: [...this.state.letters, randomConsonant],
                letterCount: this.state.letterCount + 1,
              },
              () => this.checkLetters()
            );
            break;
          }
        }
      };

      checkLetters() {
        if (this.state.letterCount === 9) {
          this.setState({ playMode: "ready", seconds: 30 });
        }
      }
    
      startPlayback() {
        this.sound = new Audio('./assets/countdown-1.mp3');
        this.sound.load();
        console.log(this.sound.play());
        this.sound.play()
          .then(() => {
            // Audio is playing.
          })
          .catch(error => {
            console.log(error);
          });
      }

      startTimer() {
        // fetch best responses from CountDown API
        this.getComputerAnagrams(this.state.letters);
    
        // console.log(this.state.seconds);
        if (this.state.seconds && this.state.seconds > 0) {
          console.log("Code updated at 13.27pm Wed 10 March 2021");
          this.timer = setInterval(this.countDown.bind(this), 1000);
          this.startPlayback();
        }
      }

      countDown() {
        // Remove one second, set state so a re-render happens.
        // console.log("counting down the seconds ...");
    
        let countSeconds = this.state.seconds - 1;
        let secondsDegrees = this.state.secondsDegrees + 360 / 60;
        this.setState({
          seconds: countSeconds,
          secondsDegrees,
        });
    
        // Check if we're at zero.
        if (countSeconds === 0) {
          clearInterval(this.timer);
          this.setState({
            playMode: "finished"
          });
        }
      }
      getComputerAnagrams(letterArray) {
        // console.log(letterArray);
        const letterString = letterArray.join("").slice(0, 9);
        // console.log({ letterString });
    
        axios
          .get(
            `https://danielthepope-countdown-v1.p.rapidapi.com/solve/${letterString}?variance=1`,
            {
              headers: {
                "x-rapidapi-host": "danielthepope-countdown-v1.p.rapidapi.com",
                "x-rapidapi-key":
                  "5e458fcdc9msheb1cb44d935da2fp1cbb49jsnd1ef623fd51c",
              },
            }
          )
          .then((response) => {
            // console.log(response.data);
            this.setState({ computerAnagrams: response.data });
          })
          .catch((error) => {
            console.log(error);
          });
      }

      checkWord(e) {
        e.preventDefault();
        const wordToCheck = event.target['inputWord'].value.toLowerCase();
        const lettersLowerCase = this.state.letters.join('|').toLowerCase().split('|');
    
        // console.log(wordToCheck)
        // console.log(wordToCheck.split(''))
        // console.log(this.state.letters)
        
        if(wordToCheck.split('').every(letter => lettersLowerCase.includes(letter))) {
          this.setState({
            enteredText: wordToCheck,
            wordCheckEmployed: true,
            wordMismatch: false,
          }, () => this.checkWordInDictionary(wordToCheck)
          )
        } else {
          this.setState({
            enteredText: wordToCheck,
            wordCheckEmployed: true,
            wordMismatch: true,
          })
        } 
      }

      checkWordInDictionary(wordToCheck){
        this.setState({
          definitions: [],
          wordCheckEmployed: false,
        })
        let config = {
          headers: {
            "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
            "x-rapidapi-key": "5e458fcdc9msheb1cb44d935da2fp1cbb49jsnd1ef623fd51c"
          }
        }
    
        axios.get(`https://wordsapiv1.p.rapidapi.com/words/${wordToCheck}/definitions/`
        , config)
        .then((response) => {
          // console.log(response.data);
          this.setState({ 
            definitions: response.data['definitions'],
            wordCheckEmployed: true,
         });
        })
        .catch((error)=> {
          console.log(error);
        });
      }

      showComputerChoices() {
        this.setState({computerChoicesOpen: true})
      }

      playAgain() {
        this.setState({
          playMode: 'choosingLetters',
          letterCount: 0,
          letters: [],
          computerChoicesOpen: false,
          secondsDegrees: 90,
          enteredText: '',
          wordMismatch: false,
          definitions: [],
          wordCheckEmployed: false,
        })
      }

      inputHandler (e) {
        const wordToCheck = e.target.value
        this.setState({
          enteredText: wordToCheck
        })
      }
    
    render() {
        return (
          
            <div className="profile">
            <div className="headerBar"></div> 
            <div className="innerContainer">
            <div className="instructionContainer">
              <p className={this.state.playMode === "choosingLetters" ? "instructionText" : "instructionTextOff" }>
                Choose a letter
              </p>         
              </div>
    
            <div className="buttonContainer">
              <button
                className={
                  this.state.playMode === "choosingLetters" ? "button" : "buttonOff"
                }
                onClick={this.getVowel}
              >
                VOWEL
              </button>
              <button
                className={
                  this.state.playMode === "choosingLetters" ? "button" : "buttonOff"
                }
                onClick={this.getConsonant}
              >
                CONSONANT
              </button>
            </div>
    
            <div className="letterContainer">
              <div className="letterDiv">
                {this.state.letters[0] ? this.state.letters[0] : "?"}
              </div>
              <div className="letterDiv">
                {this.state.letters[1] ? this.state.letters[1] : "?"}
              </div>
              <div className="letterDiv">
                {this.state.letters[2] ? this.state.letters[2] : "?"}
              </div>
              <div className="letterDiv">
                {this.state.letters[3] ? this.state.letters[3] : "?"}
              </div>
              <div className="letterDiv">
                {this.state.letters[4] ? this.state.letters[4] : "?"}
              </div>
              <div className="letterDiv">
                {this.state.letters[5] ? this.state.letters[5] : "?"}
              </div>
              <div className="letterDiv">
                {this.state.letters[6] ? this.state.letters[6] : "?"}
              </div>
              <div className="letterDiv">
                {this.state.letters[7] ? this.state.letters[7] : "?"}
              </div>
              <div className="letterDiv">
                {this.state.letters[8] ? this.state.letters[8] : "?"}
              </div>
            </div>
    
            <div className="startGame">
              <button
                className={
                  this.state.playMode === "ready" ? "button" : "buttonOff"
                }
                onClick={this.startTimer.bind(this)}
              >
                START COUNTDOWN
              </button>
            </div>
    
            <div className="playAgainContainer">
              <button
                className={
                  this.state.playMode === "finished" ? "button" : "buttonOff"
                }
                onClick={this.playAgain.bind(this)}
              >
                PLAY AGAIN
              </button>
            </div>
    
            <div className={this.state.playMode !== "finished" ? "clock" : "clockOff" }>
              <div className="clockFace">
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "0%",
                    transformOrigin: "100%",
                    transform: `rotate(${this.state.secondsDegrees}deg)`,
                    background: "#555555",
                    height: "4px",
                    width: "50%",
                  }}
                />
              </div>
            </div>
    
            <form className={this.state.playMode === "finished" ? "form": "formOff"} name="wordToCheck" onSubmit={this.checkWord.bind(this)}>
              <div className="column">
                <input className="answer" id="wordToCheck" name="inputWord" type="text" onChange={(e)=>this.inputHandler(e)} />
    
                <button type="Submit" className="button">CHECK DICTIONARY</button>
              </div>
                <div className="wordContainer">
                  {this.state.wordCheckEmployed && this.state.wordMismatch ? `❌ '${this.state.enteredText}' - word cannot be derived from letters above!` : this.state.wordCheckEmployed && !this.state.wordMismatch && this.state.definitions.length === 0
                  ? `❌ '${this.state.enteredText}' not found in dictionary`
                  : <div>
                  <span>{this.state.wordCheckEmployed && !this.state.wordMismatch && this.state.definitions.length > 0 ? `✅ '${this.state.enteredText}' found in dictionary! Definition(s):` : ""}</span>
                  <ul> {this.state.definitions.map((result, i) => (
                    
                        <li key={i}>{result.definition}</li>
                      
                    ))}
                    </ul>
                </div>}
                    
                </div>
            </form>
    
      
            <div className={this.state.playMode === "finished" ? "listContainer": "listContainerOff"}>
              <div className={this.state.playMode === "finished" ? "computerChoices": "computerChoicesOff"}>
                {!this.state.computerAnagrams
                  ? ""
                  : `The computer found ${this.state.computerAnagrams.length} word(s). Longest word has ${this.state.computerAnagrams[0]['length']} characters.  `}
                  <a href="#" className={this.state.playMode === "finished" ? "link" : "linkOff"} onClick={this.showComputerChoices.bind(this)}>  Click here</a> to view word(s):
                  
                  <ul className={this.state.computerChoicesOpen ? "computerChoicesShown" : "computerChoicesHidden"}>
                    {!this.state.computerAnagrams
                      ? ""
                      : this.state.computerAnagrams.map((result, i) => (
                      <li key={i}>{result.word} - length {result.length}</li>
                        ))}
                  </ul>
                </div>
            </div>
            </div>
          </div>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
)