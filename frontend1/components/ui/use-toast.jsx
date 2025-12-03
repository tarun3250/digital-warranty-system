export function toast(message) {
    if (typeof window !== "undefined") {
      window.alert(message);
    }
  }
  