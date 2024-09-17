import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type SbtConfig = {};

export function sbtConfigToCell(config: SbtConfig): Cell {
    return beginCell().endCell();
}

export class Sbt implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Sbt(address);
    }

    static createFromConfig(config: SbtConfig, code: Cell, workchain = 0) {
        const data = sbtConfigToCell(config);
        const init = { code, data };
        return new Sbt(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
