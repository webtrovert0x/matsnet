import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;

describe("MezoDomains", function () {
  let mezoDomains;
  let owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const MezoDomains = await ethers.getContractFactory("MezoDomains");
    mezoDomains = await MezoDomains.deploy();
    await mezoDomains.waitForDeployment();
  });

  it("Should set the right owner", async function () {
    expect(await mezoDomains.owner()).to.equal(owner.address);
  });

  it("Should register a domain successfully", async function () {
    const fee = await mezoDomains.registrationFee();
    await mezoDomains.connect(addr1).registerDomain("alice.poor", { value: fee });
    
    expect(await mezoDomains.getDomainOwner("alice.poor")).to.equal(addr1.address);
    expect(await mezoDomains.ownerOf(1)).to.equal(addr1.address);
  });

  it("Should fail if fee is not enough", async function () {
    const fee = await mezoDomains.registrationFee();
    await expect(
      mezoDomains.connect(addr1).registerDomain("alice.poor", { value: fee - 1n })
    ).to.be.revertedWith("Insufficient fee provided");
  });

  it("Should fail to register an existing domain", async function () {
    const fee = await mezoDomains.registrationFee();
    await mezoDomains.connect(addr1).registerDomain("alice.poor", { value: fee });

    await expect(
      mezoDomains.connect(addr2).registerDomain("alice.poor", { value: fee })
    ).to.be.revertedWith("Domain already registered");
  });

  it("Should allow the owner to change the registration fee", async function () {
    const newFee = ethers.parseEther("0.0005");
    await mezoDomains.connect(owner).setRegistrationFee(newFee);
    expect(await mezoDomains.registrationFee()).to.equal(newFee);
  });
});
