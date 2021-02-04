import {} from '@dapplets/dapplet-extension';
import EXAMPLE_IMG from './icons/ex04.png';

@Injectable
export default class TwitterFeature {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,  @typescript-eslint/explicit-module-boundary-types
  @Inject('twitter-adapter.dapplet-base.eth') public adapter: any;

  activate() {
    const { button } = this.adapter.exports;
    this.adapter.attachConfig({
      POST: (ctx) =>
        button({
          initial: 'DEFAULT',
          DEFAULT: {
            label: 'Open overlay',
            img: EXAMPLE_IMG,
            // LP:  1. Implement overlay opening on button click
            //      2. To get current overlay use `Core.overlay({ name: string, title: string })`.
            //      3. Send some data to overlay and get collback 'onClick'
            //      4. In callback increse current counter and add received message to label
            exec: async (_, me) => {
              const overlay = Core.overlay({ name: 'example-04-overlay', title: 'Example 4' });
              overlay.sendAndListen('data', 'Hello, World!', {
                onClick: (op, { message }) => {
                  ctx.counter = ctx.counter === undefined ? 1 : ctx.counter + 1;
                  me.label = `${message} ${ctx.counter}`;
                },
              });
            },
            // LP end
          },
        }),
    });
  }
}
