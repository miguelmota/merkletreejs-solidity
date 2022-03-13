const MerkleProof = artifacts.require('MerkleProof')
const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')
const { soliditySha3 } = require('web3-utils')

const buf2hex = x => '0x'+x.toString('hex')

contract('Contracts', (accounts) => {
  let contract

  before('setup', async () => {
    contract = await MerkleProof.new()
  })

  context('MerkleProof', () => {
    describe('merkle proofs', () => {
      it('should return true for valid merkle proof', async () => {
        const leaves = accounts.map((account, i) => soliditySha3(
          { type: 'address', value: account },
          { type: 'uint256', value: i+1 } // simulate amount
        ))
        const tree = new MerkleTree(leaves, keccak256, { sort: true })
        const root = tree.getHexRoot()

        const amount = 1
        const leaf = soliditySha3(
          { type: 'address', value: accounts[0] },
          { type: 'uint256', value: amount }
        )
        const proof = tree.getHexProof(leaf)

        const verified = await contract.verify.call(root, amount, proof)
        assert.equal(verified, true)
      })
    })
  })
})
