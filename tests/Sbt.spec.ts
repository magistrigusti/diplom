import {Blockchain, BlockchainSnapshot, SandboxContract, TreasuryContract} from '@ton/sandbox';
import {Cell, toNano, Address, beginCell} from '@ton/core';
import {randomAddress} from "../../utils/randomAddress";
import {SbtItemData, OperationCodes, Queries} from "./SbtItem.data";
import {SbtItem} from './SbtItem';
import "@ton/test-utils";

import { compile } from '@ton/blueprint';
import { decodeOnChainContent, encodeOnChainContent } from "../nft-content/nftContent";
import { findTransactionRequired, flattenTransaction } from '@ton/test-utils';

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
