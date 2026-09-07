import { pickMessage, toastMessages, type ToastKey, type ToastMessage } from "./toast"

export class Toaster {
  
  message = $state<ToastMessage | null>(null); 

  constructor () {
    $effect(() => {
      if (!this.message) return;
      const t = setTimeout(() => (this.message = null), 2000);
      return () => clearTimeout(t);
    });
  }
	
    show(key: ToastKey) {
      this.message = pickMessage(toastMessages[key])
    }
}