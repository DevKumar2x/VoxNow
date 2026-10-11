import './App.css';
import Navbar from './components/Navbar'
import { Component } from 'react'
import News from './components/News';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';

export default class App extends Component {
  state = {
    progress: 0
  }

  setProgress = (progress) => {
    this.setState({progress: progress})
  }

  render() {
    return (
      <div>
        <Router>
          <Navbar />
          <LoadingBar color='#f11946' progress={this.state.progress} />
          <Routes>
            <Route path="/" element={<News setProgress={this.setProgress} key="general" pageSize={9} country="us" category="general" />} />
            <Route path="/sports" element={<News setProgress={this.setProgress} key="sports" pageSize={9} country="us" category="sports" />} />
            <Route path="/technology" element={<News setProgress={this.setProgress} key="technology" pageSize={9} country="us" category="technology" />} />
            <Route path="/health" element={<News setProgress={this.setProgress} key="health" pageSize={9} country="us" category="health" />} />
            <Route path="/science" element={<News setProgress={this.setProgress} key="science" pageSize={9} country="us" category="science" />} />
            <Route path="/business" element={<News setProgress={this.setProgress} key="business" pageSize={9} country="us" category="business" />} />
            <Route path="/entertainment" element={<News setProgress={this.setProgress} key="entertainment" pageSize={9} country="us" category="entertainment" />} />
          </Routes>
        </Router>
      </div>
    )
  }
}

