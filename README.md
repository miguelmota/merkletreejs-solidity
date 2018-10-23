# MerkleTree.js Solidity example

> Construct merkle trees with [MerkleTree.js](https://github.com/miguelmota/merkletreejs) and verify merkle proofs in [Solidity](https://github.com/ethereum/solidity).

## Example

[`contracts/MerkleProof.sol`](./contracts/MerkleProof.sol)

```solidity
pragma solidity ^0.4.23;

contract MerkleProof {
  function verify(
    bytes32[] proof,
    bytes32 root,
    bytes32 leaf
  )
    public
    pure
    returns (bool)
  {
    bytes32 computedHash = leaf;

    for (uint256 i = 0; i < proof.length; i++) {
      bytes32 proofElement = proof[i];

      if (computedHash < proofElement) {
        computedHash = keccak256(abi.encodePacked(computedHash, proofElement));
      } else {
        computedHash = keccak256(abi.encodePacked(proofElement, computedHash));
      }
    }

    return computedHash == root;
  }
}
```

[`test/merkleproof.js`](./test/merkleproof.js)

```js
const MerkleProof = artifacts.require('MerkleProof')
const MerkleTree = require('merkletreejs')
const keccak256 = require('keccak256')

const buf2hex = x => '0x'+x.toString('hex')
cosnt contract = await MerkleProof.new()

const leaves = ['a', 'b', 'c', 'd'].map(x => keccak256(x))
const tree = new MerkleTree(leaves, keccak256)
const root = buf2hex(tree.getRoot())
const leaf = buf2hex(tree.getLeaves()[0])
const proof = tree.getProof(leaves[0]).map(x => buf2hex(x.data))

const verified = await contract.verify.call(proof, root, leaf)

console.log(verified) // true
```

## Test

```bash
make test
```

## License

MIT
