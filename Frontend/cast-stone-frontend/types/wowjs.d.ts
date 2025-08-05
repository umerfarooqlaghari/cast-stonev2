declare module 'wow.js' {
  export default class WOW {
    constructor(options?: {
      boxClass?: string;
      animateClass?: string;
      offset?: number;
      mobile?: boolean;
      live?: boolean;
      scrollContainer?: string | null;
      resetAnimation?: boolean;
    });
    init(): void;
  }
}
    