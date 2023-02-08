const hre = require("hardhat");

async function main() {
  const Simple = await hre.ethers.getContractFactory("Simple");
  const simple = await Simple.deploy();

  await simple.deployed();

  console.log(`Simple contract deployed to ${simple.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
