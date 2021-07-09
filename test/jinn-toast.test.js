import { html, fixture, expect } from '@open-wc/testing';

import '../jinn-toast.js';

describe('JinnToast', () => {
  it('has a default title "Hey there" and counter 5', async () => {
    const el = await fixture(html`<jinn-toast text="Hello"></jinn-toast>`);

    expect(el.text).to.equal('Hello');
  });

  it('reads the props', async () => {
    const el = await fixture(html`
        <jinn-toast avatar="me"
                    backgroundColor="green"
                    data-class="css"
                    close="true"
                    destination="url"
                    duration="3333"
                    destination="url"
                    oldestFirst="true"
                    position="left"
                    escapeMarkup="true"
                    gravity="top"
                    text="Hello"></jinn-toast>
    `);

    expect(el.avatar).to.equal('me');
    expect(el.backgroundColor).to.equal('green');
    expect(el.classProp).to.equal('css');
    expect(el.close).to.equal(true);
    expect(el.destination).to.equal('url');
    expect(el.duration).to.equal(3333);
    expect(el.escapeMarkup).to.equal(true);
    expect(el.gravity).to.equal('top');
    expect(el.newWindow).to.equal(false);
    expect(el.oldestFirst).to.equal(true);
    expect(el.position).to.equal('left');
    expect(el.stopOnFocus).to.equal(true);
    expect(el.text).to.equal('Hello');
  });


  it('passes the a11y audit', async () => {
    const el = await fixture(html`<jinn-toast></jinn-toast>`);

    await expect(el).shadowDom.to.be.accessible();
  });
});
