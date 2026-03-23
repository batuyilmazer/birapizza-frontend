import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function registerPlugins(): void {
  gsap.registerPlugin(ScrollTrigger);
}
