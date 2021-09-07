# Getting Started

[![Open in Gitpod!](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/dapplets/dapplet-template)

To run the simpliest dapplet, follow these steps.

#### 1. Clone [Dapplet Template](https://github.com/dapplets/dapplet-template) repository locally.

#### 2. Change module name from "dapplet-template.dapplet-base.eth" to yours in `package.json` file.

#### 3. Fill in fields in the manifests `package.json` and `dapplet.json`.

#### 4. Change icons to yours in `src/icons` folder.

The icon `src/icon19.png` is used for the injected button in source code `src/index.ts`.

The icon `src/icon64.png` is used for display in the store of Dapplets. The link to this icon is defined in `dapplet.json` manifest.

#### 5. Edit necessary Dapplet settings in the `config/schema.json` file.
   The default values of settings are defined in `config/default.json` file.
   The schema follows the rules defined in the http://json-schema.org/.
   The Dapplet settings UI is generated by [react-jsonschema-form](https://react-jsonschema-form.readthedocs.io/en/latest/usage/single/).

There are three environments:

- `dev` - used when a module is loaded from development server;
- `test` - used when a module is loaded from Test Dapplet Registry;
- `prod` - used when a module is loaded from Production Dapplet Registry;

#### 6. You can use another Adapter in your Dapplet.

Dependencies are defined in the `dependencies` section of the `dapplet.json` file and are injected in the dapplet's `index.ts` file.

The Twitter adapter is used by default.

The list of our adapters are available now:

- [twitter-adapter.dapplet-base.eth](https://github.com/dapplets/dapplet-modules/tree/master/packages/twitter-adapter) - site-specific adapter for [Twitter](https://twitter.com);
- [instagram-adapter.dapplet-base.eth](https://github.com/dapplets/dapplet-modules/tree/master/packages/instagram-adapter) - site-specific adapter for [Instagram](https://instagram.com);
- [identity-adapter.dapplet-base.eth](https://github.com/dapplets/dapplet-modules/tree/master/packages/identity-adapter) - virtual adapter (interface), which is an abstract of two adapters above;
- [common-adapter.dapplet-base.eth](https://github.com/dapplets/dapplet-modules/tree/master/packages/common-adapter) - viewport adapter is universal adapter which contains generic insertion points and is compatible with any web-sites.

> See for more [here.](https://github.com/dapplets/dapplet-docs/tree/master/docs/adapters-docs-list)

#### 7. Fill in `contextIds` section of the `dapplet.json` file.

`ContextId` is the identifier of a context to which your module is bound. This is usually the same as the name of an adapter you are using. It may be:

- the name of an adapter you depend on (e.g. `twitter-adapter.dapplet-base.eth`);
- the domain name of a website to which you are creting a dapplet (e.g. `twitter.com`);
- the identifier of a dynamic context (e.g. `twitter.com/1346093004537425927`).

#### 8. Specify the argument of `@Inject` decorator with chosen adapter in the `/src/index.ts` module and add method `activate()` with the simple dapplet code.

```typescript
import {} from '@dapplets/dapplet-extension';
import EXAMPLE_IMG from './icons/icon19.png';

@Injectable
export default class TwitterFeature {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,  @typescript-eslint/explicit-module-boundary-types
  @Inject('twitter-adapter.dapplet-base.eth') public adapter: any;
  
  activate() {
    const { button } = this.adapter.exports;
    this.adapter.attachConfig({
      POST: () =>
        button({
          initial: 'DEFAULT',
          DEFAULT: {
            label: 'Injected Button',
            img: EXAMPLE_IMG,
            exec: () => alert('Hello, World!'),
          },
        }),
    });
  }
}
```

#### 9. Install the Dapplet Extension for you Chrome browser (if not installed) - follow the [Installation](https://github.com/dapplets/dapplet-docs/tree/master/docs/installation) steps.

#### 10. Install dependencies and run the code:
```bash
npm i
npm start
```

You will see a message like that:

```bash
rollup v2.38.3
bundles src/index.ts → lib\index.js...
Current registry address: http://localhost:3001/dapplet.json
created lib\index.js in 783ms
[2021-02-01 13:58:36] waiting for changes...
```

The address [http://localhost:3001/dapplet.json](http://localhost:3001/dapplet.json) is a link to your dapplet manifest file. Copy it to clipboard.

#### 11. Connect the development server to Dapplet Extension.

Paste URL to Developer tab of Dapplet Extension's popup and click **Add**.

![image](https://user-images.githubusercontent.com/43613968/132354395-7121d255-0eef-4526-b550-5eed8908436a.png)

You will see your module in the list of development module. Here you can start deployment process.

![image](https://user-images.githubusercontent.com/43613968/132354513-763b3dba-b137-45e3-a44f-987a18bda655.png)

#### 12. Run your dapplet in the website.

![image](https://user-images.githubusercontent.com/43613968/132354570-3cc9d4c9-c9f0-4bb0-9825-74b9c1c66a4c.png)

#### Here is an example:

![ex00-2-master](https://user-images.githubusercontent.com/43613968/118811618-e249a280-b8b5-11eb-90f6-b66b85646a3f.gif)
