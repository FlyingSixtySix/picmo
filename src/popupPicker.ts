import { EmojiPicker } from './views/EmojiPicker';
import { PickerOptions } from './types';
import { ExternalEvent, ExternalEvents } from './ExternalEvents';

import { EventCallback } from './events';
import { createEmojiPicker } from './createPicker';
import { setPosition, PositionCleanup } from './positioning';
import { prefersReducedMotion } from './util';

const SHOW_HIDE_DURATION = 150;

export class PopupPickerController {
  picker: EmojiPicker;
  isOpen = false;

  private autoHide: boolean;
  private rootElement: HTMLElement;
  private popupEl: HTMLElement;
  private positionCleanup: PositionCleanup;
  private options: Required<PickerOptions>;
  private externalEvents = new ExternalEvents();

  constructor(options: Required<PickerOptions>) {
    this.popupEl = document.createElement('div');
    this.rootElement = options.rootElement || document.body;

    this.autoHide = options.autoHide ?? true;

    this.options = {
      ...options,
      rootElement: this.popupEl
    };

    this.picker = createEmojiPicker(this.options);

    if (this.autoHide) {
      this.picker.on('emoji:select', () => {
        this.close();
      });
    }

    this.onDocumentClick = this.onDocumentClick.bind(this);
    document.addEventListener('click', this.onDocumentClick);

    this.handleKeydown = this.handleKeydown.bind(this);
    this.popupEl.addEventListener('keydown', this.handleKeydown);
  }

  /**
   * Listens for a picker event.
   *
   * @param event The event to listen for
   * @param callback The callback to call when the event is triggered
   */
  on(event: ExternalEvent, callback: EventCallback) {
    this.externalEvents.on(event, callback);
    this.picker.on(event, callback);
  }

  /**
   * Destroys the picker when it is no longer needed.
   * After calling this method, the picker will no longer be usable.
   *
   * If this is called while the picker is open, it will be closed first.
   *
   * @returns a Promise that resolves when the close/destroy is complete.
   */
  async destroy() {
    if (this.isOpen) {
      await this.close();
    }

    document.removeEventListener('click', this.onDocumentClick);

    this.picker.destroy();
    this.externalEvents.removeAll();
  }

  /**
   * Toggles the visible state of the picker
   * If the picker is currently open, it will be closed, and if it si currently closed, it will be opened.
   *
   * @returns a Promise that resolves when the visibility state change is complete
   */
  toggle(): Promise<void> {
    return this.isOpen ? this.close() : this.open();
  }

  /**
   * Opens the picker.
   *
   * @returns a Promise that resolves when the picker is finished opening
   */
  async open(): Promise<void> {
    if (this.isOpen) {
      return;
    }

    await this.initiateOpenStateChange(true);
    this.rootElement.appendChild(this.popupEl);
    this.setPosition();
    this.picker.initializePickerView();

    await this.animateOpenStateChange(true);
    this.picker.initializePickerView();
    this.picker.setInitialFocus();
    this.externalEvents.emit('picker:open');
  }

  /**
   * Closes the picker
   *
   * @returns a Promise that resolves when the picker is finished closing
   */
  async close(): Promise<void> {
    if (!this.isOpen) {
      return;
    }

    await this.initiateOpenStateChange(false);
    await this.animateOpenStateChange(false);

    this.popupEl.remove();
    this.picker.reset();
    this.positionCleanup();
  }

  private handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.close();
    }
  }

  /**
   * Handles a click on the document, so that the picker is closed
   * if the mouse is clicked outside of it.
   *
   * The picker will only be closed if:
   * - The picker is currently open
   * - The click target is not the trigger element or any of its children
   * - The click target is not the picker or any of its children
   *
   * @param event The MouseEvent that was dispatched.
   */
  private onDocumentClick(event: MouseEvent) {
    const clickedNode = event.target as Node;

    const isClickOnTrigger = this.options.triggerElement?.contains(clickedNode);

    if (this.isOpen && !this.picker.isPickerClick(event) && !isClickOnTrigger) {
      this.close();
    }
  }

  /**
   * Finds any pending (running) animations on the picker element.
   *
   * @returns an array of Animation objects that are in the 'running' state.
   */
  private getRunningAnimations(): Animation[] {
    return this.picker.el.getAnimations().filter(animation => animation.playState === 'running');
  }

  /**
   * Sets up the picker positioning.
   */
  private setPosition() {
    this.positionCleanup?.();
    this.positionCleanup = setPosition(this.popupEl, this.options.referenceElement, this.options.position);
  }

  /**
   * Waits for all pending animations on the picker element to finish.
   *
   * @returns a Promise that resolves when all animations have finished
   */
  private awaitPendingAnimations(): Promise<Animation[]> {
    return Promise.all(this.getRunningAnimations().map(animation => animation.finished));
  }

  /**
   * Initiates an animation either for opening or closing the picker using the Web Animations API.
   * If animations are not enabled or supported, the picker will be immediately opened or closed.
   *
   * @param openState The desired open state of the picker
   * @returns The Animation object that is running
   */
  private async animateOpenStateChange(openState: boolean): Promise<Animation | void> {
    return this.picker.el.animate?.(
      {
        opacity: [0, 1],
        transform: ['scale(0.9)', 'scale(1)']
      },
      {
        duration: prefersReducedMotion() ? 0 : SHOW_HIDE_DURATION,
        id: openState ? 'show-picker' : 'hide-picker',
        fill: 'both',
        easing: 'ease-in-out',
        direction: openState ? 'normal' : 'reverse'
      }
    ).finished;
  }

  /**
   * Prepares for an animation either for opening or closing the picker.
   * If other animations are still running (this will happen when toggled rapidly), this will wait for them to finish.
   *
   * It will mark the new open state immediately then wait for pending animations to finish.
   *
   * @param openState The desired open state
   */
  private async initiateOpenStateChange(openState: boolean) {
    this.isOpen = openState;
    await this.awaitPendingAnimations();
  }
}