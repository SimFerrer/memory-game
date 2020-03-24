import React, { Component } from 'react'
import shuffle from 'lodash.shuffle'
import Card from './Card/Card'
import GuessCount from './GuessCount/GuessCount'
import HallOfFame, { FAKE_HOF } from './HallOfFame/HallOfFame'
import HighScoreInput from './HighScoreInput/HighScoreInput'
import './App.css'

const VISUAL_PAUSE_MSECS = 750
const SIDE = 6
const SYMBOLS = '😀🎉💖🎩🐶🐱🦄🐬🌍🌛🌞💫🍎🍌🍓🍐🍟🍿'

class App extends React.Component {

  state = {
    cards: this.generateCards(),
    currentPair: [],
    guesses: 0,
    hallOfFame: null,
    matchedCardIndices: [],
  }


  displayHallOfFame = (hallOfFame) => {
    this.setState({ hallOfFame })
  }
  generateCards() {
    const result = []
    const size = SIDE * SIDE
    const candidates = shuffle(SYMBOLS)
    while (result.length < size) {
      const card = candidates.pop()
      result.push(card, card)
    }
    return shuffle(result)
  }

  // Arrow fx for binding
  handleCardClick = (index) => {
    const { currentPair } = this.state

    if (currentPair.length === 2) {
      return
    }

    if (currentPair.length === 0) {
      this.setState({ currentPair: [index] })
      return
    }

    this.handleNewPairClosedBy(index)
  }

  handleNewPairClosedBy(index) {
    const { cards, currentPair, guesses, matchedCardIndices } = this.state

    const newPair = [currentPair[0], index]
    const newGuesses = guesses + 1
    const matched = cards[newPair[0]] === cards[newPair[1]]
    this.setState({ currentPair: newPair, guesses: newGuesses })
    if (matched) {
      this.setState({ matchedCardIndices: [...matchedCardIndices, ...newPair] })
    }
    setTimeout(() => this.setState({ currentPair: [] }), VISUAL_PAUSE_MSECS)
  }
  newGame = () => {
    
    this.setState({ cards: this.generateCards(), currentPair: [], guesses: 0, matchedCardIndices: [],hallOfFame:null })
  }

  getFeedbackForCard(index) {
    const { currentPair, matchedCardIndices } = this.state
    const indexMatched = matchedCardIndices.includes(index)

    if (currentPair.length < 2) {
      return indexMatched || index === currentPair[0] ? 'visible' : 'hidden'
    }

    if (currentPair.includes(index)) {
      return indexMatched ? 'justMatched' : 'justMismatched'
    }

    return indexMatched ? 'visible' : 'hidden'
  }

  render() {
    const { cards, guesses, matchedCardIndices, hallOfFame } = this.state
    const won = matchedCardIndices.length === cards.length
    return (
      <div className="memory">
        <div className="header">
          <h1 className="title">Memory </h1>
          <button className="btn btn-info" onClick={this.newGame}>Nouvelle partie</button>
        </div>
        <GuessCount guesses={guesses} />
        {cards.map((card, index) => (
          <Card
            card={card}
            feedback={this.getFeedbackForCard(index)}
            index={index}
            key={index}
            onClick={this.handleCardClick}
          />
        ))}

        
        {
          won && (hallOfFame ? (<HallOfFame entries={hallOfFame} />) : (<HighScoreInput guesses={guesses} onStored={this.displayHallOfFame} />))
        }
      </div>
    )
  }
}

export default App