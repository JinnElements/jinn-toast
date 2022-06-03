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
    this.escapeMarkup = (this._initVar('escapeMarkup', true)) === 'true';
    this.gravity = this._initVar('gravity', 'top');
    this.newWindow = (this._initVar('newWindow', false)) === 'true';
    this.offSet = this._initVar('offSet', {});
    this.oldestFirst = (this._initVar('oldestFirst', true)) === 'true';
    this.position = this._initVar('position', 'right');
    // this.selector = this._initVar('selector','');
    this.stopOnFocus = this._initVar('stopOnFocus', true);
    this.text = this._initVar('text', '');

    const style = `
        :host{
            display:none;
        }
    `;
    this.shadowRoot.innerHTML = `
        <style>
            ${style}
        </style>
        ${this.renderHTML}
    `;

    /**
     * trigger toast via @jinn-toast events
     */
    this.addEventListener('jinn-toast', (ev) =>{
      this.showToast(ev.detail.text);
    });

  }

  disconnectedCallback(){
    this.removeEventListener('jinn-toast',this.showToast);
  }

  showToast(text){
    new Toastify({
      avatar: this.avatar,
      // backgroundColor:this.backgroundColor,
      // callback: this.callback,
      className:this.classProp,
      close: this.close,
      destination: this.destination,
      duration: this.duration,
      escapeMarkup: this.escapeMarkup,
      gravity: this.gravity,
      newWindow: false,
      offset:this.offset,
      oldestFirst: this.oldestFirst,
      position: this.position,
      node: this.shadowRoot,
      stopOnFocus: this.stopOnFocus,
      text,
    }).showToast();

  }

  renderHTML() {
    return `
      <slot></slot>
    `;
  }

}
if (!customElements.get('jinn-toast')) {
  window.customElements.define('jinn-toast', JinnToast);
}
