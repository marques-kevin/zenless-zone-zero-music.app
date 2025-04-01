export class LocalstorageServiceWindow {
  getItem(key: string): string | null {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  setItem(key: string, value: string): void {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {}
  }
}
