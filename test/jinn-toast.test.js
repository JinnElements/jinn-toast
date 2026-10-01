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

  describe('accessibility', () => {
    const wait = ms => new Promise(r => setTimeout(r, ms));

    it('has a polite status live region before any toast is shown', async () => {
      const el = await fixture(html`<jinn-toast text="Hello"></jinn-toast>`);
      const region = el.shadowRoot.querySelector('.live-region');
      expect(region).to.exist;
      expect(region.getAttribute('role')).to.equal('status');
      expect(region.getAttribute('aria-live')).to.equal('polite');
    });

    it('uses an alert region when politeness is assertive', async () => {
      const el = await fixture(html`<jinn-toast politeness="assertive"></jinn-toast>`);
      const region = el.shadowRoot.querySelector('.live-region');
      expect(region.getAttribute('role')).to.equal('alert');
      expect(region.getAttribute('aria-live')).to.equal('assertive');
    });

    it('announces the toast text', async () => {
      const el = await fixture(html`<jinn-toast></jinn-toast>`);
      el.showToast('Saving failed');
      await wait(120);
      expect(el.shadowRoot.querySelector('.live-region').textContent).to.equal('Saving failed');
    });

    it('makes the close control a labelled, focusable button', async () => {
      const el = await fixture(
        html`<jinn-toast close="true" close-label="Schließen" duration="-1"></jinn-toast>`,
      );
      el.showToast('Sticky');
      const toastEl = [...document.querySelectorAll('.toastify')].find(t =>
        t.textContent.includes('Sticky'),
      );
      const closeEl = toastEl.querySelector('.toast-close');
      expect(closeEl.getAttribute('role')).to.equal('button');
      expect(closeEl.getAttribute('tabindex')).to.equal('0');
      expect(closeEl.getAttribute('aria-label')).to.equal('Schließen');
      closeEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      await wait(500);
      expect(toastEl.isConnected).to.be.false;
    });
  });

  describe('per-toast options', () => {
    it('overrides position, gravity and duration and adds a class', async () => {
      const el = await fixture(
        html`<jinn-toast data-class="base" gravity="bottom" position="left"></jinn-toast>`,
      );
      el.showToast('Options A', { gravity: 'top', position: 'center', className: 'extra', duration: -1 });
      const toastEl = [...document.querySelectorAll('.toastify')].find(t =>
        t.textContent.includes('Options A'),
      );
      expect(toastEl.classList.contains('base')).to.be.true;
      expect(toastEl.classList.contains('extra')).to.be.true;
      expect(toastEl.classList.contains('toastify-center')).to.be.true;
      expect(toastEl.classList.contains('toastify-top')).to.be.true;
    });

    it('passes options given in the jinn-toast event', async () => {
      const el = await fixture(html`<jinn-toast></jinn-toast>`);
      el.dispatchEvent(
        new CustomEvent('jinn-toast', {
          detail: { text: 'Options C', options: { className: 'from-event' } },
        }),
      );
      const toastEl = [...document.querySelectorAll('.toastify')].find(t =>
        t.textContent.includes('Options C'),
      );
      expect(toastEl.classList.contains('from-event')).to.be.true;
    });

    it('shows a close control when requested per toast', async () => {
      const el = await fixture(html`<jinn-toast duration="-1"></jinn-toast>`);
      el.showToast('Options B', { close: true });
      const toastEl = [...document.querySelectorAll('.toastify')].find(t =>
        t.textContent.includes('Options B'),
      );
      expect(toastEl.querySelector('.toast-close')).to.exist;
    });
  });
});
