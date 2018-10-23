const MerkleProof = artifacts.require('./MerkleProof.sol')

module.exports = (deployer, network, accounts) => {
  deployer.then(async () => {
    await deployer.deploy(MerkleProof)
  })
}
