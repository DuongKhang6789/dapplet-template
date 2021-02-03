# Example 01: Extra button on Twitter Adapter

[![Open in Gitpod!](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/dapplets/dapplet-template/tree/ex01-add-button-exercise)

The **basic template** for `your_dapplet/src/index.ts` looks like this:

```typescript
import {} from '@dapplets/dapplet-extension';
import EXAMPLE_IMG from './icons/ex01.png';

@Injectable
export default class TwitterFeature {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,  @typescript-eslint/explicit-module-boundary-types
  @Inject('twitter-adapter.dapplet-base.eth') public adapter: any;
  
  activate() {
    // LP: 11. Use async method `Core.storage.get(serverUrl: string)` to get server url.

    // LP End
    // LP: 12. Take a connection with server. Use `Core.connect<{ param }>({ url })`.

    // LP End
    const { button } = this.adapter.exports;
    this.adapter.attachConfig({
      POST: (ctx) =>
        button({
          initial: 'DEFAULT',
          DEFAULT: {
            img: EXAMPLE_IMG,
            // LP: 1. Add label with counter for it.

            // LP end
            // LP: 2. Listen for the button click - output into console.
            //     3: Make counter incrementing on button click.
            exec: () => alert('Hello, World!'),
            // LP end
          },
        }),
    });
  }
}
```

The dapplet injects the **button** to every Tweet on a Twitter page below the main content, near the buttons *Like*, *Retweet* etc. The function passed to `POST` takes `ctx` and returns the **widget**, the **array of widgets** or **null**.

`ctx` - is an *object* that contains parameters of the current **context** where the dapplet widgets were injected. Parameters are defined by the adapter.

```typescript
POST:  (ctx) => [ button({ ... }) ] 
```

or

```typescript
POST: (ctx) => button({})
```

Before using the `button` or/and other widgets in `this.adapter.attachConfig()` it has to be received
from `this.adapter.exports`.

This button has only one state - `DEFAULT`. In this case you can choose not to set the initial state and delete this field.

```typescript
 button({
  DEFAULT: {
    img: EXAMPLE_IMG,
    exec: () => alert('Hello, World!'),
  },
})
```

When you haven't `DEFAULT` state you have to set the `initial` state as above.

```typescript
button({
  initial: 'FIRST_STATE', // or SECOND_STATE

  // First state button
  FIRST_STATE: {
    img: LIKE_IMG,
    exec: () => alert('Hello, World!'),
  },

  // Second state button
  SECOND_STATE: {
    img: DISLIKE_IMG,
    exec: () => alert('Hello, World!'),
  }
})
```

The `label`, `img` and `exec` are defined in the state. In this case `exec` takes the function that will be executed on
button click.

The whole list of **widgets** and **contexts** are defined in the adapter. The API of **twitter-adapter** you can find [here](https://docs.dapplets.org/docs/adapters-docs-list).

In the first exercise we add counter to button's label in `POST`.

## 1. Implement a counter in the dapplet

Add a label with a counter for it.

```ts
label: 0
```

Listen for the button click - output into console.

```ts
exec: async (_, me) => {
  // ctx - the argument of the function passed to POST
  console.log(ctx);
  console.log(me);
...
}
```

`me` - is a *Proxy* of the widget.

Make the counter incrementing on the button click.

```ts
me.label += 1;
```

Let's display a message in the browser alert by clicking on the widget. We will also give the opportunity to customize the message text in the dapplet settings in the extension.

The dapplet settings are as follows:

![Dapplet's User Settings](https://docs.dapplets.org/img/ex01_1.jpg)

To do this, add the following code to the dapplet's `exec`:

```ts
const message1 = await Core.storage.get('exampleString');
const message2 = await Core.storage.get('exampleHiddenString');
alert(`I wrote: ${message1}. Then wrote: ${message2}.`);
```

Here is the complete `exec` code:

```ts
exec: async (_, me) => {
  console.log(ctx);
  console.log(me);
  me.label += 1;
  const message1 = await Core.storage.get('exampleString');
  const message2 = await Core.storage.get('exampleHiddenString');
  alert(`I wrote: ${message1}. Then wrote: ${message2}.`);
}
```

In the `config/default.json` define your own defaults.

```json
{
  "main": {
    "exampleString": "some string value",
    "exampleHiddenString": "some string value"
  },
  "test": {
    "exampleString": "TEST: shown",
    "exampleHiddenString": "TEST: hidden"
  },
  "dev": {
    "exampleString": "some string value",
    "exampleHiddenString": "some string value"
  }
}
```

Run the dapplet in your terminal

```bash
npm start
```

> If you don't know how to run the dapplet in a browser, see [Get Started](https://docs.dapplets.org/docs/get-started#11-connect-the-development-server-to-dapplet-extension).

Here is the code of this part of the
example: [ex01.1-add-button-noserver-solution](https://github.com/dapplets/dapplet-template/tree/ex01.1-add-button-noserver-solution)

## 2. Implement a server counter storage

Add the storage for the counters in `server/index.js`.

```js
const counter = {};
```

Initialize the counter for the current tweet.

```js
if (!Object.prototype.hasOwnProperty.call(counter, tweetId)) {
  counter[tweetId] = {
    amount: 0,
  };
}
```

Send the counter in `params`.

```js
ws.send(
  JSON.stringify({
    jsonrpc: '2.0',
    method: subscriptionId,
    params: [{ amount: counter[tweetId].amount }],
  }),
);
```

Send the counter in a callback.

```js
ws.send(
  JSON.stringify({
    jsonrpc: '2.0',
    method: subscriptionId,
    id: currentId,
    params: [{ amount: counter[currentId].amount }],
  }),
);
```

Implement the counter increment.

```js
const [currentId] = params;
counter[currentId].amount += 1;
emitter.emit('attached', currentId);
```

Add `serverUrl` to the dapplet's config.

```json
// config/default.json
{
  ...
  "dev": {
    "serverUrl": "ws://localhost:8080/feature-1",
    "exampleString": "some string value",
    "exampleHiddenString": "some string value"
  }
}

// config/schema.json
{
  ...
  "properties": {
    "serverUrl": {
      "type": "string",
      "title": "Server URL"
    },
    ...
  }
}
```

In `src/index.ts` use asynchronous method `Core.storage.get(serverUrl: string)` to get the server url.

```ts
const serverUrl = await Core.storage.get('serverUrl');
```

Don't forget to make the **`activate`** method `async`.

Take a connection with the server. Use `Core.connect<{ param }>({ url })`.

```ts
const server = Core.connect<{ amount: string }>({ url: serverUrl });
```

The console calls and the alert are no longer needed, so you can remove them. The result is like this

```ts
import {} from '@dapplets/dapplet-extension';
import EXAMPLE_IMG from './icons/ex01.png';

@Injectable
export default class TwitterFeature {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,  @typescript-eslint/explicit-module-boundary-types
  @Inject('twitter-adapter.dapplet-base.eth') public adapter: any;

  async activate() {
    // LP: 11. Use async method `Core.storage.get(serverUrl: string)` to get server url.
    const serverUrl = await Core.storage.get('serverUrl');
    // LP End
    // LP: 12. Take a connection with server. Use `Core.connect<{ param }>({ url })`.
    const server = Core.connect<{ amount: string }>({ url: serverUrl });
    // LP End
    const { button } = this.adapter.exports;
    this.adapter.attachConfig({
      POST: (ctx) =>
        button({
          initial: 'DEFAULT',
          DEFAULT: {
            img: EXAMPLE_IMG,
            // LP: 1. Add label with counter for it.
            label: server.amount,
            // LP end
            // LP: 2. Listen for the button click - output into console.
            //     3: Make counter incrementing on button click.
            exec: () => server.send('increment', ctx.id),
            // LP end
          },
        }),
    });
  }
}
```

To run the server and the dapplet at the same time in this example we
use [Concurrently](https://www.npmjs.com/package/concurrently):

```bash
npm i -D concurrently
```

In the package.json use the following script for `"start"` and `"postinstall"`:

```json
"postinstall": "cd server && npm i",
"start": "concurrently -c \"yellow,blue\" -n \"dapplet,server\" \"rollup -w --config rollup.config.js && cd server && node .\" \"cd server && node .\"",
```

Run the dapplet in your terminal

```bash
npm start
```

Here is the result code of the
example: [ex01.2-add-button-server-solution](https://github.com/dapplets/dapplet-template/tree/ex01.2-add-button-server-solution) .

This page in the docs is [here.](https://docs.dapplets.org/docs/extra-button)

> If you don't know how to run the dapplet in a browser, see [Get Started.](https://docs.dapplets.org/docs/get-started)
