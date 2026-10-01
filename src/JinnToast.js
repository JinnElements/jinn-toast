import Toastify from 'toastify-js/src/toastify-es';

/**
 *
 * Wrapper component for toastify-js - https://github.com/apvarun/toastify-js
 *
 * @event jinn-toast - will show the toast with text passed in event
 */
export class JinnToast extends HTMLElement {

  static get properties() {
    return {
      avatar: {type: String},
      backgroundColor: {type: String},
      callback: {type: String},
      classProp: {type: String},
      close: {type: Boolean},
      destination: {type: String},
      duration: {type: Number},
      escapeMarkup: {type: Boolean},
      gravity: {type: String},
      newWindow: {type: Boolean},
      oldestFirst: {type: Boolean},
      politeness: {type: String},
      closeLabel: {type: String},
      position: {type: String},
      selector: {type: String},
      stopOnFocus: {type: Boolean},
      text: {type: String}
    };
  }

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
  }

  _initVar(name, defaultVal) {
    return this.hasAttribute(name) ? this.getAttribute(name) : defaultVal;
  }

  connectedCallback() {
    this.avatar = this._initVar('avatar', '');
    this.backgroundColor = this._initVar('backgroundColor', '');
    this.callback = this._initVar('callback', {});
    this.classProp = this._initVar('data-class', '');
    this.close = (this._initVar('close', false)) === 'true';
    this.destination = this._initVar('destination', undefined);
    this.duration = Number(this._initVar('duration', 3000));
    this.escapeMarkup = (this._initVar('escapeMarkup', 'true')) === 'true';
    this.gravity = this._initVar('gravity', 'top');
    this.newWindow = (this._initVar('newWindow', 'false')) === 'true';
    this.offSet = this._initVar('offSet', {});
    this.oldestFirst = (this._initVar('oldestFirst', 'true')) === 'true';
    this.politeness = this._initVar('politeness', 'polite') === 'assertive' ? 'assertive' : 'polite';
    this.closeLabel = this._initVar('close-label', 'Close');
    this.position = this._initVar('position', 'right');
    // this.selector = this._initVar('selector','');
    this.stopOnFocus = (this._initVar('stopOnFocus', 'true')) === 'true';
    this.text = this._initVar('text', '');

    const style = `
        /* visually hidden, but (unlike display:none) still part of the accessibility tree so that
           the live region inside can announce */
        :host{
            position:absolute;
            width:1px;
            height:1px;
            margin:-1px;
            overflow:hidden;
            clip:rect(0 0 0 0);
            white-space:nowrap;
        }
    `;
    this.shadowRoot.innerHTML = `
        <style>
            ${style}
        </style>
        ${this.renderHTML()}
    `;
    this._liveRegion = this.shadowRoot.querySelector('.live-region');

    /**
     * trigger toast via @jinn-toast events
     */
    this.addEventListener('jinn-toast', (ev) =>{
      this.showToast(ev.detail.text, ev.detail.options);
    });

  }

  disconnectedCallback(){
    this.removeEventListener('jinn-toast',this.showToast);
  }

  /**
   * Announces the text to assistive technology via a live region. The region is created up front
   * (it must exist before its content changes) and is visually hidden.
   */
  _announce(text) {
    const region = this._liveRegion;
    if (!region) return;
    const plain = this.escapeMarkup ? text : String(text).replace(/<[^>]*>/g, ' ');
    // clear first so that an identical message is announced again
    region.textContent = '';
    window.setTimeout(() => {
      region.textContent = plain;
    }, 50);
  }

  /**
   * Makes the close control of a toast operable and named: a focusable button.
   */
  _enhanceClose(toastElement) {
    const closeEl = toastElement?.querySelector('.toast-close');
    if (!closeEl) return;
    closeEl.setAttribute('role', 'button');
    closeEl.setAttribute('tabindex', '0');
    closeEl.setAttribute('aria-label', this.closeLabel);
    closeEl.addEventListener('keydown', ev => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        closeEl.click();
      }
    });
  }

  /**
   * Shows a toast.
   *
   * @param {string} text the message
   * @param {{gravity?: string, position?: string, className?: string, duration?: number, close?: boolean}} [options]
   *   per-toast overrides of the element's attributes. `className` is added to the element's
   *   `data-class`, it does not replace it.
   */
  showToast(text, options = {}){
    this._announce(text);
    const className = [this.classProp, options.className].filter(Boolean).join(' ');
    const toast = new Toastify({
      avatar: this.avatar,
      // backgroundColor:this.backgroundColor,
      // callback: this.callback,
      className,
      close: options.close ?? this.close,
      destination: this.destination,
      duration: options.duration ?? this.duration,
      escapeMarkup: this.escapeMarkup,
      gravity: options.gravity ?? this.gravity,
      newWindow: false,
      offset:this.offset,
      oldestFirst: this.oldestFirst,
      position: options.position ?? this.position,
      node: this.shadowRoot,
      stopOnFocus: this.stopOnFocus,
      text,
    });
    toast.showToast();
    this._enhanceClose(toast.toastElement);
  }

  renderHTML() {
    const role = this.politeness === 'assertive' ? 'alert' : 'status';
    return `
      <div class="live-region" role="${role}" aria-live="${this.politeness}" aria-atomic="true"></div>
      <slot></slot>
    `;
  }

}
if (!customElements.get('jinn-toast')) {
  window.customElements.define('jinn-toast', JinnToast);
}
