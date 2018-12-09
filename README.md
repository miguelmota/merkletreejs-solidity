# MerkleTree.js Solidity example

> Construct merkle trees with [MerkleTree.js](https://github.com/miguelmota/merkletreejs) and verify merkle proofs in [Solidity](https://github.com/ethereum/solidity).

## Example

[`contracts/MerkleProof.sol`](./contracts/MerkleProof.sol)

```solidity
pragma solidity ^0.4.23;

contract MerkleProof {
  function verify(
    bytes32 root,
    bytes32 leaf,
    bytes32[] proof,
    uint256 []positions
  )
    public
    pure
    returns (bool)
  {
    bytes32 computedHash = leaf;

    for (uint256 i = 0; i < proof.length; i++) {
      bytes32 proofElement = proof[i];

      if (positions[i] == 1) {
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
const contract = await MerkleProof.new()

const leaves = ['a', 'b', 'c', 'd'].map(x => keccak256(x)).sort(Buffer.compare)
const tree = new MerkleTree(leaves, keccak256)
const root = buf2hex(tree.getRoot())
const leaf = buf2hex(keccak256('a'))
const proof = tree.getProof(keccak256('a')).map(x => buf2hex(x.data))
const positions = tree.getProof(keccak256('a')).map(x => x.position === 'right' ? 1 : 0)

const verified = await contract.verify.call(root, leaf, proof, positions)

console.log(verified) // true
```

## Test

```bash
make test
```

## License

MIT
