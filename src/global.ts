const getGlobalThis = () => {
	if (typeof globalThis === 'object' && globalThis) return globalThis;
	if (typeof self === 'object' && self) return self;
	if (typeof window === 'object' && window) return window;
	if (typeof this === 'object' && this) return this;
	throw new Error('Unable to locate global `this`');
};

export const globalObject: any = getGlobalThis();
