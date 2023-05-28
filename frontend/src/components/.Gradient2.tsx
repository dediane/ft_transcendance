import { normalizeColor } from ''; // Import the library for color normalization

class Gradient {
  private el: HTMLElement;
  private minigl: any; // Replace with the appropriate type for the MiniGl library
  private computedCanvasStyle: CSSStyleDeclaration | null;
  private cssVarRetries: number;
  private maxCssVarRetries: number;
  private sectionColors: number[];
  private activeColors: number[];
  private freqX: number;
  private freqY: number;
    shaderFiles: {} | undefined;
    conf: {} | undefined;
  // Declare other class properties here

  constructor(el: HTMLElement) {
    this.el = el;
    this.minigl = null;
    this.computedCanvasStyle = null;
    this.cssVarRetries = 0;
    this.maxCssVarRetries = 5;
    this.sectionColors = [];
    this.activeColors = [];
    this.freqX = 0;
    this.freqY = 0;

    // Bind methods
    this.waitForCssVars = this.waitForCssVars.bind(this);
    this.addIsLoadedClass = this.addIsLoadedClass.bind(this);

    this.connect();
  }

  private connect() {
    this.shaderFiles = {
      // Shader code here
    };

    this.conf = {
      // Configuration options here
    };

    if (typeof window !== 'undefined') {
      // Check if gradient colors are available in CSS variables
      this.computedCanvasStyle = getComputedStyle(this.el);
      if (this.computedCanvasStyle.getPropertyValue("--gradient-color-1").indexOf("#") !== -1) {
        this.init();
        this.addIsLoadedClass();
      } else {
        if (this.cssVarRetries > this.maxCssVarRetries) {
          // Use default colors if CSS variables are not available
          this.sectionColors = [16711680, 16711680, 16711935, 65280, 255];
          this.init();
          return;
        }
        this.cssVarRetries += 1;
        requestAnimationFrame(this.waitForCssVars);
      }
    }
  }

  private waitForCssVars() {
    if (typeof window !== 'undefined') {
      this.computedCanvasStyle = getComputedStyle(this.el);
      if (this.computedCanvasStyle.getPropertyValue("--gradient-color-1").indexOf("#") !== -1) {
        this.init();
        this.addIsLoadedClass();
      } else {
        if (this.cssVarRetries > this.maxCssVarRetries) {
          this.sectionColors = [16711680, 16711680, 16711935, 65280, 255];
          this.init();
          return;
        }
        this.cssVarRetries += 1;
        requestAnimationFrame(this.waitForCssVars);
      }
    }
  }

  private addIsLoadedClass() {
    // TODO: Implement the addIsLoadedClass method
  }

  private initGradientColors() {
    this.sectionColors = ["--gradient-color-1", "--gradient-color-2", "--gradient-color-3", "--gradient-color-4"].map(cssPropertyName => {
      let hex = this.computedCanvasStyle!.getPropertyValue(cssPropertyName).trim();
      // Check if shorthand hex value was used and double the length so the conversion in normalizeColor will work.
      if (hex.length === 4) {
        const hexTemp = hex.substr(1).split("").map(hexTemp => hexTemp + hexTemp).join("");
        hex = `#${hexTemp}`;
      }
      return hex && `0x${hex.substr(1)}`;
    }).filter(Boolean).map(normalizeColor);
  }

  private init() {
    this.initGradientColors();
    // TODO: Implement the rest of the initialization logic
  }
}

export { Gradient };