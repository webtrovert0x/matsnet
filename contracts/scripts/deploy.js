import hre from "hardhat";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const MezoDomains = await hre.ethers.getContractFactory("MezoDomains");
  const mezoDomains = await MezoDomains.deploy();

  await mezoDomains.waitForDeployment();

  const address = await mezoDomains.getAddress();
  console.log("MezoDomains deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
