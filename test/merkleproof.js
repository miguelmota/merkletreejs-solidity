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
        const leaves = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'].map(x => keccak256(x)).sort(Buffer.compare)
        const tree = new MerkleTree(leaves, keccak256)
        const root = tree.getRoot()
        const hexroot = buf2hex(root)
        const leaf = keccak256('d')
        const hexleaf = buf2hex(keccak256('d'))
        const proof = tree.getProof(keccak256('d'))
        const hexproof = tree.getProof(keccak256('d')).map(x => buf2hex(x.data))

        verified = await contract.verify.call(hexproof, hexroot, hexleaf)
        assert.equal(verified, true)

        assert.equal(tree.verify(proof, leaf, root), true)
      })

      it('should return false for invalid merkle proof', async () => {
        const leaves = ['a', 'b', 'c', 'd'].map(x => keccak256(x)).sort(Buffer.compare)
        const tree = new MerkleTree(leaves, keccak256)
        const root = buf2hex(tree.getRoot())
        const leaf = buf2hex(keccak256('b'))

        const badLeaves = ['a', 'b', 'c', 'x'].map(x => keccak256(x)).sort(Buffer.compare)
        const badTree = new MerkleTree(badLeaves, keccak256)
        const badProof = badTree.getProof(keccak256('b')).map(x => buf2hex(x.data))

        const verified = await contract.verify.call(badProof, root, leaf)
        assert.equal(verified, false)
      })

      it('should return false for a merkle proof of invalid length', async () => {
        const leaves = ['a', 'b', 'c'].map(x => keccak256(x))
        leaves.sort(Buffer.compare)
        const tree = new MerkleTree(leaves, keccak256)
        const root = buf2hex(tree.getRoot())
        const leaf = buf2hex(keccak256('c'))
        const proof = tree.getProof(keccak256('c')).map(x => buf2hex(x.data))
        const badProof = proof.slice(0, proof.length-2)

        const verified = await contract.verify.call(badProof, root, leaf)
        assert.equal(verified, false)
      })
    })
  })
})
