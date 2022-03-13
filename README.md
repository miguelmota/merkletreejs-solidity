# MerkleTree.js Solidity example

> Construct merkle trees with [MerkleTree.js](https://github.com/miguelmota/merkletreejs) and verify merkle proofs in [Solidity](https://github.com/ethereum/solidity).

## Example

[`contracts/MerkleProof.sol`](./contracts/MerkleProof.sol)

```solidity
pragma solidity ^0.5.2;

contract MerkleProof {
  function verify(
    bytes32 root,
    uint256 amount,
    bytes32[] memory proof
  )
    public
    view
    returns (bool)
  {
    bytes32 computedHash = keccak256(abi.encodePacked(msg.sender, amount));

    for (uint256 i = 0; i < proof.length; i++) {
      bytes32 proofElement = proof[i];

      if (computedHash <= proofElement) {
        // Hash(current computed hash + current element of the proof)
        computedHash = keccak256(abi.encodePacked(computedHash, proofElement));
      } else {
        // Hash(current element of the proof + current computed hash)
        computedHash = keccak256(abi.encodePacked(proofElement, computedHash));
      }
    }

    // Check if the computed hash (root) is equal to the provided root
    return computedHash == root;
  }
}
```

[`test/merkleproof.js`](./test/merkleproof.js)

```js
const MerkleProof = artifacts.require('MerkleProof')
const MerkleTree = require('merkletreejs')
const keccak256 = require('keccak256')
const { soliditySha3 } = require('web3-utils')

const contract = await MerkleProof.new()

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
console.log(await contract.verify.call(root, amount, proof)) // true

```

## Test

```bash
make test
```

## License

MIT
