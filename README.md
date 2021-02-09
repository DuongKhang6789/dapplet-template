# Example 5: Wallet

This example shows how to connect a wallet to a dapplet.

The initial code for this example is here: [ex05-wallet-exercise.](https://github.com/dapplets/dapplet-template/tree/ex05-wallet-exercise)

In `src/index.ts` declare variables to be used for transactions:

```typescript
private wallet: any;
private _currentAddress: string | null = null;
private _transferAmount = '0x1BC16D674EC80000';
```

The wallet will open when you click on the button. Use `await Core.wallet()`. The method accepts an object, with two required arguments: `type` and `network`:

```ts
exec: async (_, me) => {
  me.state = 'PENDING';

  if (!this.wallet) {
    this.wallet = await Core.wallet({ type: 'ethereum', network: 'rinkeby' });
    
    const isWalletConnected = await this.wallet.isConnected();
    if (!isWalletConnected) await this.wallet.connect();
  }

  this.wallet.sendAndListen('eth_accounts', [], {
    result: (_, { data }) => {
      this._currentAddress = data[0];
      me.state = 'CONNECTED';
    },
  });
},
```

Add states `CONNECTED`, `PENDING`, `REGECTED`, `MINING`, `COMPLETED` and `UNAVAILABLE`.

```ts
CONNECTED: {
  label: `Send ${BigInt(this._transferAmount) / BigInt(1000000000000000000)} ETH`,
  img: EXAMPLE_IMG,
  exec: async (_, me) => {
    // LP: 3. Send the necessary data to wallet and listen for the answer.
      // LP: 4. Show the state of the transaction
      // LP end
    // LP end
  },
},
PENDING: {
  label: 'Pending',
  loading: true,
},
REGECTED: {
  label: 'Rejected',
  img: EXAMPLE_IMG,
  exec: (_, me) => (me.state = 'CONNECTED'),
},
MINING: {
  label: 'Mining',
  loading: true,
},
COMPLETED: {
  label: 'Completed',
  img: EXAMPLE_IMG,
  exec: (_, me) => (me.state = 'CONNECTED'),
},
UNAVAILABLE: {
  label: 'Not available',
  img: EXAMPLE_IMG,
  exec: (_, me) => (me.state = 'CONNECTED'),
},
```

Send the necessary data to the wallet and listen for the answer.

> *In this example the sender and the recipient of the transaction are the same*

```ts
this.wallet.sendAndListen(
  'eth_sendTransaction',
  [
    {
      from: this._currentAddress,
      to: this._currentAddress,
      value: this._transferAmount,
    },
  ],
  {
    // LP: 4. Show the state of the transaction
    // LP end
  },
);
```

Show the state of the transaction: pending, mining, completed, rejected or unavailable.
Method `sendAndListen` of `wallet` listens events: `pending`, `rejected`, `result` and `mined`.
Use them to change the button state.

```ts
pending: () => (me.state = 'PENDING'),
rejected: () => (me.state = 'REGECTED'),
result: () => (me.state = 'MINING'),
mined: (_, { hash }) => (me.state = hash === 0 || hash === 0x0 ? 'UNAVAILABLE' : 'COMPLETED'),
```

Result:

```ts
import {} from '@dapplets/dapplet-extension';
import EXAMPLE_IMG from './icons/ex05.png';

@Injectable
export default class TwitterFeature {
  @Inject('twitter-adapter.dapplet-base.eth') public adapter: any;
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private wallet: any;
  private _currentAddress: string | null = null;
  private _transferAmount = '0x1BC16D674EC80000'; // 2ETH
  
  async activate(): Promise<void> {
    const { button } = this.adapter.exports;
    this.adapter.attachConfig({
      POST: async () =>
        button({
          initial: 'DEFAULT',
          DEFAULT: {
            label: 'Connect',
            img: EXAMPLE_IMG,
            exec: async (_, me) => {
              me.state = 'PENDING';

              if (!this.wallet) {
                this.wallet = await Core.wallet({ type: 'ethereum', network: 'rinkeby' });
                const isWalletConnected = await this.wallet.isConnected();
                if (!isWalletConnected) await this.wallet.connect();
              }

              this.wallet.sendAndListen('eth_accounts', [], {
                result: (_, { data }) => {
                  this._currentAddress = data[0];
                  me.state = 'CONNECTED';
                },
              });
            },
          },
          CONNECTED: {
            label: `Send ${BigInt(this._transferAmount) / BigInt(1000000000000000000)} ETH`,
            img: EXAMPLE_IMG,
            exec: async (_, me) => {
              this.wallet.sendAndListen(
                'eth_sendTransaction',
                [
                  {
                    from: this._currentAddress,
                    to: this._currentAddress,
                    value: this._transferAmount,
                  },
                ],
                {
                  pending: () => (me.state = 'PENDING'),
                  rejected: () => (me.state = 'REGECTED'),
                  result: () => (me.state = 'MINING'),
                  mined: (_, { hash }) =>
                    (me.state = hash === 0 || hash === 0x0 ? 'UNAVAILABLE' : 'COMPLETED'),
                },
              );
            },
          },
          PENDING: {
            label: 'Pending',
            loading: true,
          },
          REGECTED: {
            label: 'Rejected',
            img: EXAMPLE_IMG,
            exec: (_, me) => (me.state = 'CONNECTED'),
          },
          MINING: {
            label: 'Mining',
            loading: true,
          },
          COMPLETED: {
            label: 'Completed',
            img: EXAMPLE_IMG,
            exec: (_, me) => (me.state = 'CONNECTED'),
          },
          UNAVAILABLE: {
            label: 'Not available',
            img: EXAMPLE_IMG,
            exec: (_, me) => (me.state = 'CONNECTED'),
          },
        }),
    });
  }
}
```

Here is the result code of the example: [ex05-wallet-solution.](https://github.com/dapplets/dapplet-template/tree/ex05-wallet-solution)

Run the dapplet:

```bash
npm i
npm start
```

This page in the docs is [here.](https://docs.dapplets.org/docs/wallet)
