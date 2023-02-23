const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('1. Main', async () => {
  beforeEach(async () => {
    // production contracts
    Main = await ethers.getContractFactory('Main');

    // mock contracts
    Cash = await ethers.getContractFactory('MockCash');

    // deployment
    cash = await Cash.deploy();
    main = await Main.deploy(cash.address);

    [admin, user] = await ethers.getSigners();
  });

  describe('1.1. constructor', async () => {
    it('1.1.1. Correct `admin` address', async () => {
      const adminAddress = await main.admin();
      expect(adminAddress).to.equal(admin.address, 'Incorrect `admin` address');
    });

    it('1.1.2. Correct `cash` address', async () => {
      const cashAddress = await main.cash();
      expect(cashAddress).to.equal(cash.address, 'Incorrect `cash` address');
    });
  });

  describe('1.2. askBalance', async () => {
    beforeEach(async () => {
      await cash.mintFor(admin.address, 1);
      await cash.mintFor(user.address, 2);
    });

    it('1.2.1. Ask balance successfully', async () => {
      const adminBalance = await main.askBalance(admin.address);
      expect(adminBalance).to.equal(ethers.utils.parseEther('1'), 'Incorrect balance');

      const userBalance = await main.askBalance(user.address);
      expect(userBalance).to.equal(ethers.utils.parseEther('2'), 'Incorrect balance');
    });

    it('1.2.2. Ask balance unsuccessfully due to the caller is not admin', async () => {
      await expect(main.connect(user).askBalance(user.address), 'Permission: Unauthorized');
    });
  });
});
