# Example 04: Overlays

In this example we add an overlay that opens on click by button in the `POST`.

Here are two examples of the overlay:

- [Pure HTML page](https://github.com/dapplets/dapplet-overlay-bridge/tree/master/examples/pure-html-page)
- [React.js based example](https://github.com/dapplets/dapplet-overlay-bridge/tree/master/examples/react-overlay)

At first, we implement an overlay written on HTML with pure JavaScript and at second - the React based component.

The initial code for this example, including both of the above overlays, is
here: [ex04-overlays-exercise.](https://github.com/dapplets/dapplet-template/tree/ex04-overlays-exercise)

First install [Dapplet-Overlay Bridge:](https://github.com/dapplets/dapplet-overlay-bridge)

```bash
npm i @dapplets/dapplet-overlay-bridge
```

Now let's create overlays.

### HTML with JavaScript overlay

The `pure-html-page/index.html` has a `<span>` tag with a `dappletMessage` class and a button with a `ch-state-btn`
class.

```html
<div>
  Info from dapplet:
  <span class="dappletMessage"></span>
</div>
<button class="ch-state-btn">Counter +1</button>
```

In a `<script>` tag we import class **`Bridge`** from `dapplet-overlay-bridge` and create class `MyBridge`, that extends `Bridge`, with methods **`onData()`** and **`onClick()`**.

**`onData()`** increments the counter received from the dapplet and sends back.

**`onClick()`** receives boolean variable and sends *'tick'* or *'tock'* to dapplet on every click.

```js
import Bridge from 'https://unpkg.com/@dapplets/dapplet-overlay-bridge';

class MyBridge extends Bridge {
  _subId = 0;

  onData (callback) {
    this.subscribe('data', (data) => {
      callback(data);
      return (++this._subId).toString();
    });
  }
  
  onClick (tickTock) {
    this.publish(this._subId.toString(), {
      type: 'onClick',
      message: tickTock ? 'tick' : 'tock',
    });
  }
}

const bridge = new MyBridge();
bridge.onData((data) => (document.querySelector('.dappletMessage').innerText = data));
let tickTock = true;
const button = document.querySelector('.ch-state-btn');
button.addEventListener('click', () => {
  bridge.onClick(tickTock);
  tickTock = !tickTock;
});
```

There are two methods in **`Bridge`**:

1. **`this.subscribe(type, fn)`** - to get data;
2. **`this.publish(this._subId.toString(), { type, message })`** - to send data.

type = your class method's name.

### React.js based overlay

In `/overlayWithReact` we do the same.

In `/overlayWithReact/src/App.tsx`  we add variable to the state:

```tsx
tickTock: true;
```

add `tickTock` to the `State` interface:

```ts
interface State {
  data: string | null;
  tickTock: boolean; 
} 
```

add event on button click:

```tsx
handleClick = () => {
  bridge.onClick(this.state.tickTock, (tickTock) => this.setState({ tickTock }));
};
```

and add **`onClick`** attribute to the button:

```tsx
<button className="ch-state-btn" onClick={this.handleClick}>
  Counter +1
</button>
```

In `dappletBridge.ts` we add method **`onClick()`** that sends message to dapplet:

```ts
onClick(tickTock: boolean, callback: (data: any) => void) {
  callback(!tickTock);
  this.publish(this._subId.toString(), {
    type: 'onClick',
    message: tickTock ? 'tick' : 'tock',
  });
}
```

### Change the dapplet

1. Implement overlay opening on button click.

2. To get current overlay use `Core.overlay({ name: string, title: string })`.

3. Send some data to overlay and get callback **`onClick`**.

4. In callback increase current counter and add received message to `label`.

```ts
exec: async (_, me) => {
  const overlay = Core.overlay({ name: 'example-04-overlay', title: 'Example 4' });
  overlay.sendAndListen('data', 'Hello, World!', {
    onClick: (op, { message }) => {
      ctx.counter = ctx.counter === undefined ? 1 : ctx.counter + 1;
      me.label = `${message} ${ctx.counter}`;
    },
  });
},
```

Add to the `dapplet.json` manifest the following option:

```json
{
  ...
  "overlays": {
    "example-04-overlay": "http://localhost:3000"
  }
}
```

Before running install dependencies:

```bash
npm i
```

To run the dapplet with pure JS overlay, change `start` script in `package.json`:

```json
"start": "concurrently -c \"yellow,green\" -n \"dapplet,overlay\" \"rollup -w --config rollup.config.js\" \"cd pure-html-page && npx serve -l 3000\"",
```

To run the dapplet with ReactJS overlay, change `start` script to the following:

```json
"start": "concurrently -c \"yellow,blue\" -n \"dapplet,overlay\" \"rollup -w --config rollup.config.js\" \"cd overlayWithReact && npm start\"",
```

Run the dapplet

```bash
npm start
```

> **Note**
> To publish a dapplet with an overlay, you need `assets-manifest.json`. When an overlay is written in React, webpack or another module bundler builds it on its own. But when you write it in pure JS, you need to create the manifest yourself. As you can see, if you create a React based overlay from the example, the manifest will have the following structure:
> 
> ```json
> {
>   "index.html": "index.html",
>   "main.js": "main.js"
> }
> ```

Here is the result code of the example: [ex04-overlays-solution.](https://github.com/dapplets/dapplet-template/tree/ex04-overlays-solution)

This page in the docs is [here.](https://docs.dapplets.org/docs/overlays)
