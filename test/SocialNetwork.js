const { assert } = require('chai')
const { default: Web3 } = require('web3')

const SocialNetwork = artifacts.require('./SocialNetwork.sol')

require('chai').use(require('chai-as-promised')).should()

contract('SocialNetwork', ([deployer, author, tipper]) => {
  // First three fields in Ganache accounts array
  let socialNetwork

  before(async () => {
    socialNetwork = await SocialNetwork.deployed()
  })

  describe('deployment', () => {
    it('deploys successfully', async () => {
      const address = await socialNetwork.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await socialNetwork.name()
      assert.equal(name, 'Handbook Social Network')
    })
  })

  describe('posts', async () => {
    let result, postCount

    it('creates posts', async () => {
      result = await socialNetwork.createPost('This is my first post.', {
        from: author,
      })
      postCount = await socialNetwork.postCount()
      // Success case
      assert.equal(postCount, 1)
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), postCount.toNumber(), 'id is correct')
      assert.equal(
        event.content,
        'This is my first post.',
        'content is correct'
      )
      assert.equal(event.tipAmount, '0', 'tip amount is correct')
      assert.equal(event.author, author, 'author is correct')

      // Failure case
      await socialNetwork.createPost('', { from: author }).should.be.rejected
    })

    it('lists posts', async () => {
      const post = await socialNetwork.posts(postCount)
      assert.equal(post.id.toNumber(), postCount.toNumber(), 'id is correct')
      assert.equal(post.content, 'This is my first post.', 'content is correct')
      assert.equal(post.tipAmount, '0', 'tip amount is correct')
      assert.equal(post.author, author, 'author is correct')
    })

    it('allows users to tip posts', async () => {
      // Track the author balance before purchase
      let oldAuthorBalance
      oldAuthorBalance = await web3.eth.getBalance(author)
      oldAuthorBalance = new web3.utils.BN(oldAuthorBalance) // Convert to Big Number
      // console.log('oldAuthorBalance :>> ', oldAuthorBalance.toString())

      result = await socialNetwork.tipPost(postCount, {
        from: tipper,
        value: web3.utils.toWei('1', 'Ether'),
      }) // value is in wei if you don't use the utils

      // Success case
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), postCount.toNumber(), 'id is correct')
      assert.equal(
        event.content,
        'This is my first post.',
        'content is correct'
      )
      assert.equal(
        event.tipAmount,
        '1000000000000000000',
        'tip amount is correct'
      )
      assert.equal(event.author, author, 'author is correct')

      let newAuthorBalance
      newAuthorBalance = await web3.eth.getBalance(author)
      newAuthorBalance = new web3.utils.BN(newAuthorBalance) // Convert to Big Number
      // console.log('newAuthorBalance :>> ', newAuthorBalance.toString())

      let tipAmount
      tipAmount = web3.utils.toWei('1', 'Ether')
      tipAmount = new web3.utils.BN(tipAmount)
      // console.log('tipAmount :>> ', tipAmount.toString())

      const expectedBalance = oldAuthorBalance.add(tipAmount)
      // console.log('expectedBalance :>> ', expectedBalance.toString())

      assert.equal(newAuthorBalance.toString(), expectedBalance.toString())

      // Failure: Tries to tip a post that does not exist
      await socialNetwork.tipPost(99, {
        from: tipper,
        value: web3.utils.toWei('1', 'Ether'),
      }).should.be.rejected
    })
  })
})
