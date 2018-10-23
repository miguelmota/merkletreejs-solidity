const MerkleProof = artifacts.require('MerkleProof')
const MerkleTree = require('merkletreejs')
const keccak256 = require('keccak256')

const buf2hex = x => '0x'+x.toString('hex')

contract('Contracts', (accounts) => {
  let contract

  before('setup', async () => {
    contract = await MerkleProof.new()
  })

  context('MerkleProof', () => {
    describe('merkle proofs', () => {
      it('should return true for valid merkle proof', async () => {
        const leaves = ['a', 'b', 'c', 'd'].map(x => keccak256(x))
        const tree = new MerkleTree(leaves, keccak256)
        const root = buf2hex(tree.getRoot())
        const leaf = buf2hex(tree.getLeaves()[0])
        const proof = tree.getProof(leaves[0]).map(x => buf2hex(x.data))

        const verified = await contract.verify.call(proof, root, leaf)
        assert.equal(verified, true)
      })

      it('should return false for invalid merkle proof', async () => {
        const leaves = ['a', 'b', 'c', 'd'].map(x => keccak256(x))
        const tree = new MerkleTree(leaves, keccak256)
        const root = buf2hex(tree.getRoot())
        const leaf = buf2hex(tree.getLeaves()[0])

        const badLeaves = ['a', 'b', 'c', 'x'].map(x => keccak256(x))
        const badTree = new MerkleTree(badLeaves, keccak256)
        const badProof = badTree.getProof(badLeaves[0]).map(x => buf2hex(x.data))

        const verified = await contract.verify.call(badProof, root, leaf)
        assert.equal(verified, false)
      })

      it('should return false for a merkle proof of invalid length', async () => {
        const leaves = ['a', 'b', 'c'].map(x => keccak256(x))
        const tree = new MerkleTree(leaves, keccak256)
        const root = buf2hex(tree.getRoot())
        const leaf = buf2hex(tree.getLeaves()[0])
        const proof = tree.getProof(leaves[0]).map(x => buf2hex(x.data))

        const verified = await contract.verify.call(proof, root, leaf)
        assert.equal(verified, false)
      })
    })
  })
})
