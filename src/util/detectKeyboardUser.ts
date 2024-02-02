function dkuHandlePointer() {
  document.documentElement.classList.add('pointer-user');
  document.documentElement.classList.remove('keyboard-user');
  window.removeEventListener('mousedown', dkuHandlePointer, true);
  window.removeEventListener('touchstart', dkuHandlePointer, true);
  window.addEventListener('keydown', dkuHandleKeyboard, true);
}

function dkuHandleKeyboard(e: KeyboardEvent | TouchEvent) {
  if (e instanceof KeyboardEvent && e.key === 'Tab') {
    document.documentElement.classList.add('keyboard-user');
    document.documentElement.classList.remove('pointer-user');
    window.removeEventListener('keydown', dkuHandleKeyboard, true);
    window.addEventListener('mousedown', dkuHandlePointer, true);
    window.addEventListener('touchstart', dkuHandlePointer, true);
  }
}

export class DetectKeyboardUser {
  constructor() {
    this.init();
  }

  init() {
    document.documentElement.classList.add('pointer-user');
    window.addEventListener('touchstart', dkuHandleKeyboard, true);
    window.addEventListener('keydown', dkuHandleKeyboard, true);
  }

  destroy() {
    document.documentElement.classList.remove('pointer-user');
    document.documentElement.classList.remove('keyboard-user');
  }

  refresh() {
    this.destroy();
    this.init();
  }
}
