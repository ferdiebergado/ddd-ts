export type Class = new (...args: any[]) => any;

export const Mixin = <Base extends Class>(base: Base): Base =>
  class extends base {};

const Mixed = Mixin(Mixin(class {}));

export type MixedInType = InstanceType<typeof Mixed>;

export default class MixedMixin extends Mixed {}
