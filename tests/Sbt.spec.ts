import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { Sbt } from '../wrappers/Sbt';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('Sbt', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Sbt');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let sbt: SandboxContract<Sbt>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        sbt = blockchain.openContract(Sbt.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await sbt.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: sbt.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and sbt are ready to use
    });
});
