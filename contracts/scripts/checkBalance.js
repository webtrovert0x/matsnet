import hre from "hardhat";

async function main() {
  const address = "0x825AaB493A07FE7dBe29c4DE1431deBA84BF14eb";
  const balance = await hre.ethers.provider.getBalance(address);
  console.log(`Balance of ${address}: ${hre.ethers.formatEther(balance)} BTC`);
}

main().catch(console.error);
