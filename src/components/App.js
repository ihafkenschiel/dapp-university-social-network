import React, { Component } from 'react'
import Web3 from 'web3'
// Local
import './App.css'
import SocialNetwork from '../abis/SocialNetwork.json'
import Navbar from './Navbar'
import Logo from './Logo'

/**
 * 1. Create Posts
 * 2. List all the posts
 * 3. Tip post authors with cryptocurrency
 */
class App extends Component {
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      )
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    console.log('accounts :>> ', accounts)
    this.setState({ account: accounts[0] })
    // Network ID
    const networkId = await web3.eth.net.getId()
    // Address
    const networkData = SocialNetwork.networks[networkId]
    if (networkData) {
      const socialNetwork = web3.eth.Contract(
        SocialNetwork.abi,
        networkData.address
      )
      this.setState({ socialNetwork })
      const postCount = await socialNetwork.methods.postCount().call()
      this.setState({ postCount })
      // Load Posts
      for (var i = 1; i <= postCount; i++) {
        const post = await socialNetwork.methods.posts(i).call()
        this.setState({ posts: [...this.state.posts, post] })
      }
    } else {
      window.alert(
        'Social Network has not been deployed to the blockchain. See README.md'
      )
    }
    // ABI
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      socialNetwork: null,
      postCount: 0,
      posts: [],
    }
  }

  render() {
    console.log('posts :>> ', this.state.posts)

    return (
      <div>
        <Navbar account={this.state.account} />

        <div className="container-fluid mt-5">
          <div className="row">
            <main
              role="main"
              className="col-lg-12 ml-auto mr-auto"
              style={{ maxWidth: '500px' }}
            >
              <div className="content mr-auto ml-auto">
                {this.state.posts.map((post, key) => (
                  <div key={key} class="card" style={{ width: '18rem' }}>
                    <div class="card-body">
                      <h5 class="card-title">{post.content}</h5>
                      <p class="card-text">{post.author}</p>
                    </div>
                    <div class="card-body">
                      <span>1 ETH received</span>
                      <a href="#" class="card-link">
                        Tip: 0.1 ETH
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </main>
          </div>
        </div>
      </div>
    )
  }
}

export default App
