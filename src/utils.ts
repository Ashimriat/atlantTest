export const isInRange = (val: number, from: number, to: number) => val >= from && val <= to;

export const trackElementAppear = async (selector: string): Promise<void> => await new Promise(resolve => {
  let timerId;
  (function tracker() {
    clearTimeout(timerId);
    if (document.querySelector(selector)) {
      resolve();
    } else {
      timerId = setTimeout(tracker, 500);
    }
  })();
});
