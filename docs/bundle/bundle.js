
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function (exports) {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.2' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    function quartOut(t) {
        return Math.pow(t - 1.0, 3.0) * (1.0 - t) + 1.0;
    }

    function is_date(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    function get_interpolator(a, b) {
        if (a === b || a !== a)
            return () => a;
        const type = typeof a;
        if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
            throw new Error('Cannot interpolate values of different type');
        }
        if (Array.isArray(a)) {
            const arr = b.map((bi, i) => {
                return get_interpolator(a[i], bi);
            });
            return t => arr.map(fn => fn(t));
        }
        if (type === 'object') {
            if (!a || !b)
                throw new Error('Object cannot be null');
            if (is_date(a) && is_date(b)) {
                a = a.getTime();
                b = b.getTime();
                const delta = b - a;
                return t => new Date(a + t * delta);
            }
            const keys = Object.keys(b);
            const interpolators = {};
            keys.forEach(key => {
                interpolators[key] = get_interpolator(a[key], b[key]);
            });
            return t => {
                const result = {};
                keys.forEach(key => {
                    result[key] = interpolators[key](t);
                });
                return result;
            };
        }
        if (type === 'number') {
            const delta = b - a;
            return t => a + t * delta;
        }
        throw new Error(`Cannot interpolate ${type} values`);
    }
    function tweened(value, defaults = {}) {
        const store = writable(value);
        let task;
        let target_value = value;
        function set(new_value, opts) {
            if (value == null) {
                store.set(value = new_value);
                return Promise.resolve();
            }
            target_value = new_value;
            let previous_task = task;
            let started = false;
            let { delay = 0, duration = 400, easing = identity, interpolate = get_interpolator } = assign(assign({}, defaults), opts);
            if (duration === 0) {
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                store.set(value = target_value);
                return Promise.resolve();
            }
            const start = now() + delay;
            let fn;
            task = loop(now => {
                if (now < start)
                    return true;
                if (!started) {
                    fn = interpolate(value, new_value);
                    if (typeof duration === 'function')
                        duration = duration(value, new_value);
                    started = true;
                }
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                const elapsed = now - start;
                if (elapsed > duration) {
                    store.set(value = new_value);
                    return false;
                }
                // @ts-ignore
                store.set(value = fn(easing(elapsed / duration)));
                return true;
            });
            return task.promise;
        }
        return {
            set,
            update: (fn, opts) => set(fn(target_value, value), opts),
            subscribe: store.subscribe
        };
    }

    /* src\component\ThemeButton.svelte generated by Svelte v3.46.2 */
    const file$1 = "src\\component\\ThemeButton.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let span;
    	let t_value = (/*darkMode*/ ctx[0] ? "dark_mode" : "light_mode") + "";
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "material-icons svelte-1161gb5");
    			toggle_class(span, "dark", /*darkMode*/ ctx[0]);
    			toggle_class(span, "light", !/*darkMode*/ ctx[0]);
    			add_location(span, file$1, 13, 1, 248);
    			attr_dev(div, "class", "svelte-1161gb5");
    			add_location(div, file$1, 12, 0, 214);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(span, t);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*toggleDarkMode*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*darkMode*/ 1 && t_value !== (t_value = (/*darkMode*/ ctx[0] ? "dark_mode" : "light_mode") + "")) set_data_dev(t, t_value);

    			if (dirty & /*darkMode*/ 1) {
    				toggle_class(span, "dark", /*darkMode*/ ctx[0]);
    			}

    			if (dirty & /*darkMode*/ 1) {
    				toggle_class(span, "light", !/*darkMode*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ThemeButton', slots, []);
    	let { darkMode } = $$props;

    	function toggleDarkMode() {
    		$$invalidate(0, darkMode = !darkMode);
    		localStorage.setItem("dark_mode", darkMode);
    		applyTheme();
    	}

    	const writable_props = ['darkMode'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ThemeButton> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('darkMode' in $$props) $$invalidate(0, darkMode = $$props.darkMode);
    	};

    	$$self.$capture_state = () => ({ applyTheme, darkMode, toggleDarkMode });

    	$$self.$inject_state = $$props => {
    		if ('darkMode' in $$props) $$invalidate(0, darkMode = $$props.darkMode);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [darkMode, toggleDarkMode];
    }

    class ThemeButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { darkMode: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ThemeButton",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*darkMode*/ ctx[0] === undefined && !('darkMode' in props)) {
    			console.warn("<ThemeButton> was created without expected prop 'darkMode'");
    		}
    	}

    	get darkMode() {
    		throw new Error("<ThemeButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set darkMode(value) {
    		throw new Error("<ThemeButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.46.2 */

    const { Object: Object_1 } = globals;
    const file = "src\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[36] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[39] = list[i];
    	child_ctx[41] = i;
    	return child_ctx;
    }

    // (149:7) {#each over_strength_values as _, i}
    function create_each_block_1(ctx) {
    	let option;
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(/*i*/ ctx[41]);
    			option.__value = `${/*i*/ ctx[41]}`;
    			option.value = option.__value;
    			add_location(option, file, 149, 8, 4060);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(149:7) {#each over_strength_values as _, i}",
    		ctx
    	});

    	return block;
    }

    // (199:7) {#each Object.keys(skill_data) as id}
    function create_each_block(ctx) {
    	let option;
    	let t_value = /*skill_data*/ ctx[10][/*id*/ ctx[36]].name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*id*/ ctx[36];
    			option.value = option.__value;
    			add_location(option, file, 199, 8, 5853);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*skill_data*/ 1024 && t_value !== (t_value = /*skill_data*/ ctx[10][/*id*/ ctx[36]].name + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*skill_data*/ 1024 && option_value_value !== (option_value_value = /*id*/ ctx[36])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(199:7) {#each Object.keys(skill_data) as id}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let div9;
    	let h1;
    	let t1;
    	let div2;
    	let div0;
    	let h40;
    	let t3;
    	let span0;
    	let t4_value = /*$normalResult*/ ctx[13].toFixed(2) + "";
    	let t4;
    	let t5;
    	let div1;
    	let h41;
    	let t7;
    	let span1;
    	let t8_value = /*$criticalResult*/ ctx[14].toFixed(2) + "";
    	let t8;
    	let t9;
    	let div8;
    	let div4;
    	let h20;
    	let t11;
    	let section0;
    	let label0;
    	let t13;
    	let input0;
    	let t14;
    	let section1;
    	let label1;
    	let t16;
    	let input1;
    	let t17;
    	let section2;
    	let label2;
    	let t19;
    	let input2;
    	let t20;
    	let section3;
    	let label3;
    	let t22;
    	let input3;
    	let t23;
    	let section4;
    	let label4;
    	let t25;
    	let input4;
    	let t26;
    	let section5;
    	let span2;
    	let t28;
    	let div3;
    	let select0;
    	let t29;
    	let input5;
    	let t30;
    	let div7;
    	let div5;
    	let h21;
    	let t32;
    	let section6;
    	let label5;
    	let t34;
    	let select1;
    	let option0;
    	let option1;
    	let option2;
    	let option3;
    	let t39;
    	let section7;
    	let input6;
    	let t40;
    	let label6;
    	let t42;
    	let section8;
    	let input7;
    	let t43;
    	let label7;
    	let t45;
    	let section9;
    	let input8;
    	let t46;
    	let label8;
    	let t48;
    	let section10;
    	let input9;
    	let t49;
    	let label9;
    	let t51;
    	let section11;
    	let input10;
    	let t52;
    	let label10;
    	let t54;
    	let section12;
    	let input11;
    	let t55;
    	let label11;
    	let t57;
    	let div6;
    	let h22;
    	let t59;
    	let section13;
    	let label12;
    	let t61;
    	let select2;
    	let t62;
    	let section14;
    	let label13;
    	let t64;
    	let input12;
    	let t65;
    	let p;
    	let t67;
    	let themebutton;
    	let updating_darkMode;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*over_strength_values*/ ctx[11];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = Object.keys(/*skill_data*/ ctx[10]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	function themebutton_darkMode_binding(value) {
    		/*themebutton_darkMode_binding*/ ctx[33](value);
    	}

    	let themebutton_props = {};

    	if (/*darkMode*/ ctx[9] !== void 0) {
    		themebutton_props.darkMode = /*darkMode*/ ctx[9];
    	}

    	themebutton = new ThemeButton({ props: themebutton_props, $$inline: true });
    	binding_callbacks.push(() => bind(themebutton, 'darkMode', themebutton_darkMode_binding));

    	const block = {
    		c: function create() {
    			main = element("main");
    			div9 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Thelowダメージ計算";
    			t1 = space();
    			div2 = element("div");
    			div0 = element("div");
    			h40 = element("h4");
    			h40.textContent = "通常";
    			t3 = space();
    			span0 = element("span");
    			t4 = text(t4_value);
    			t5 = space();
    			div1 = element("div");
    			h41 = element("h4");
    			h41.textContent = "クリティカル";
    			t7 = space();
    			span1 = element("span");
    			t8 = text(t8_value);
    			t9 = space();
    			div8 = element("div");
    			div4 = element("div");
    			h20 = element("h2");
    			h20.textContent = "基本ダメージ";
    			t11 = space();
    			section0 = element("section");
    			label0 = element("label");
    			label0.textContent = "武器の素ダメージ";
    			t13 = space();
    			input0 = element("input");
    			t14 = space();
    			section1 = element("section");
    			label1 = element("label");
    			label1.textContent = "特攻値";
    			t16 = space();
    			input1 = element("input");
    			t17 = space();
    			section2 = element("section");
    			label2 = element("label");
    			label2.textContent = "職業補正(%)";
    			t19 = space();
    			input2 = element("input");
    			t20 = space();
    			section3 = element("section");
    			label3 = element("label");
    			label3.textContent = "装備補正(%)";
    			t22 = space();
    			input3 = element("input");
    			t23 = space();
    			section4 = element("section");
    			label4 = element("label");
    			label4.textContent = "パーク(%)";
    			t25 = space();
    			input4 = element("input");
    			t26 = space();
    			section5 = element("section");
    			span2 = element("span");
    			span2.textContent = "オーバーストレンジ";
    			t28 = space();
    			div3 = element("div");
    			select0 = element("select");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t29 = space();
    			input5 = element("input");
    			t30 = space();
    			div7 = element("div");
    			div5 = element("div");
    			h21 = element("h2");
    			h21.textContent = "魔法石";
    			t32 = space();
    			section6 = element("section");
    			label5 = element("label");
    			label5.textContent = "レジェンド魔法石個数";
    			t34 = space();
    			select1 = element("select");
    			option0 = element("option");
    			option0.textContent = "0個";
    			option1 = element("option");
    			option1.textContent = "1個";
    			option2 = element("option");
    			option2.textContent = "2個";
    			option3 = element("option");
    			option3.textContent = "3個";
    			t39 = space();
    			section7 = element("section");
    			input6 = element("input");
    			t40 = space();
    			label6 = element("label");
    			label6.textContent = "特攻魔法石Level1";
    			t42 = space();
    			section8 = element("section");
    			input7 = element("input");
    			t43 = space();
    			label7 = element("label");
    			label7.textContent = "特攻魔法石Level2";
    			t45 = space();
    			section9 = element("section");
    			input8 = element("input");
    			t46 = space();
    			label8 = element("label");
    			label8.textContent = "特攻魔法石Level3";
    			t48 = space();
    			section10 = element("section");
    			input9 = element("input");
    			t49 = space();
    			label9 = element("label");
    			label9.textContent = "特攻魔法石Level4";
    			t51 = space();
    			section11 = element("section");
    			input10 = element("input");
    			t52 = space();
    			label10 = element("label");
    			label10.textContent = "特攻魔法石Level4.5";
    			t54 = space();
    			section12 = element("section");
    			input11 = element("input");
    			t55 = space();
    			label11 = element("label");
    			label11.textContent = "特攻魔法石Level5 or Legend";
    			t57 = space();
    			div6 = element("div");
    			h22 = element("h2");
    			h22.textContent = "その他";
    			t59 = space();
    			section13 = element("section");
    			label12 = element("label");
    			label12.textContent = "スキル";
    			t61 = space();
    			select2 = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t62 = space();
    			section14 = element("section");
    			label13 = element("label");
    			label13.textContent = "攻撃力上昇エフェクトLv";
    			t64 = space();
    			input12 = element("input");
    			t65 = space();
    			p = element("p");
    			p.textContent = "※特攻値の乗らないスキル(ショックストーンなど)は、特攻値を除いて計算しています。";
    			t67 = space();
    			create_component(themebutton.$$.fragment);
    			add_location(h1, file, 110, 2, 2706);
    			add_location(h40, file, 113, 4, 2788);
    			attr_dev(span0, "class", "text-big");
    			add_location(span0, file, 114, 4, 2805);
    			attr_dev(div0, "class", "vbox");
    			add_location(div0, file, 112, 3, 2764);
    			add_location(h41, file, 117, 4, 2901);
    			attr_dev(span1, "class", "text-big");
    			add_location(span1, file, 118, 4, 2922);
    			attr_dev(div1, "class", "vbox");
    			add_location(div1, file, 116, 3, 2877);
    			attr_dev(div2, "class", "result padding svelte-13yd3sg");
    			add_location(div2, file, 111, 2, 2731);
    			add_location(h20, file, 123, 4, 3088);
    			attr_dev(label0, "for", "weaponDamageInput");
    			add_location(label0, file, 125, 5, 3125);
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "placeholder", "例:300");
    			add_location(input0, file, 126, 5, 3179);
    			attr_dev(section0, "class", "svelte-13yd3sg");
    			add_location(section0, file, 124, 4, 3109);
    			attr_dev(label1, "for", "specialDamageInput");
    			add_location(label1, file, 129, 5, 3286);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "placeholder", "例:50");
    			add_location(input1, file, 130, 5, 3336);
    			attr_dev(section1, "class", "svelte-13yd3sg");
    			add_location(section1, file, 128, 4, 3270);
    			attr_dev(label2, "for", "jobGainInput");
    			add_location(label2, file, 133, 5, 3443);
    			attr_dev(input2, "type", "number");
    			attr_dev(input2, "placeholder", "例:10");
    			add_location(input2, file, 134, 5, 3491);
    			attr_dev(section2, "class", "svelte-13yd3sg");
    			add_location(section2, file, 132, 4, 3427);
    			attr_dev(label3, "for", "equipGainInput");
    			add_location(label3, file, 137, 5, 3592);
    			attr_dev(input3, "type", "number");
    			attr_dev(input3, "placeholder", "例:10");
    			add_location(input3, file, 138, 5, 3642);
    			attr_dev(section3, "class", "svelte-13yd3sg");
    			add_location(section3, file, 136, 4, 3576);
    			attr_dev(label4, "for", "parkGainInput");
    			add_location(label4, file, 141, 5, 3745);
    			attr_dev(input4, "type", "number");
    			attr_dev(input4, "placeholder", "例:140");
    			add_location(input4, file, 142, 5, 3793);
    			attr_dev(section4, "class", "svelte-13yd3sg");
    			add_location(section4, file, 140, 4, 3729);
    			add_location(span2, file, 145, 5, 3896);
    			attr_dev(select0, "class", "flex-grow-3");
    			if (/*overStrength*/ ctx[12] === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[23].call(select0));
    			add_location(select0, file, 147, 6, 3951);
    			attr_dev(input5, "class", "flex-grow-1");
    			attr_dev(input5, "type", "button");
    			input5.value = "OS値適用";
    			add_location(input5, file, 152, 6, 4136);
    			attr_dev(div3, "class", "hbox");
    			add_location(div3, file, 146, 5, 3925);
    			attr_dev(section5, "class", "svelte-13yd3sg");
    			add_location(section5, file, 144, 4, 3880);
    			attr_dev(div4, "class", "basicdamage panel padding svelte-13yd3sg");
    			add_location(div4, file, 122, 3, 3043);
    			add_location(h21, file, 158, 5, 4341);
    			attr_dev(label5, "for", "legendValueSelector");
    			add_location(label5, file, 160, 6, 4403);
    			option0.__value = "0";
    			option0.value = option0.__value;
    			add_location(option0, file, 162, 7, 4507);
    			option1.__value = "1";
    			option1.value = option1.__value;
    			add_location(option1, file, 163, 7, 4545);
    			option2.__value = "2";
    			option2.value = option2.__value;
    			add_location(option2, file, 164, 7, 4583);
    			option3.__value = "3";
    			option3.value = option3.__value;
    			add_location(option3, file, 165, 7, 4621);
    			if (/*numLegendStone*/ ctx[5] === void 0) add_render_callback(() => /*select1_change_handler*/ ctx[24].call(select1));
    			add_location(select1, file, 161, 6, 4462);
    			attr_dev(section6, "class", "vbox margin-1/2em");
    			add_location(section6, file, 159, 5, 4360);
    			attr_dev(input6, "id", "ms1");
    			attr_dev(input6, "type", "checkbox");
    			add_location(input6, file, 169, 6, 4708);
    			attr_dev(label6, "for", "ms1");
    			add_location(label6, file, 170, 6, 4787);
    			add_location(section7, file, 168, 5, 4691);
    			attr_dev(input7, "id", "ms2");
    			attr_dev(input7, "type", "checkbox");
    			add_location(input7, file, 173, 6, 4864);
    			attr_dev(label7, "for", "ms2");
    			add_location(label7, file, 174, 6, 4943);
    			add_location(section8, file, 172, 5, 4847);
    			attr_dev(input8, "id", "ms3");
    			attr_dev(input8, "type", "checkbox");
    			add_location(input8, file, 177, 6, 5020);
    			attr_dev(label8, "for", "ms3");
    			add_location(label8, file, 178, 6, 5099);
    			add_location(section9, file, 176, 5, 5003);
    			attr_dev(input9, "id", "ms4");
    			attr_dev(input9, "type", "checkbox");
    			add_location(input9, file, 181, 6, 5176);
    			attr_dev(label9, "for", "ms4");
    			add_location(label9, file, 182, 6, 5255);
    			add_location(section10, file, 180, 5, 5159);
    			attr_dev(input10, "id", "ms4.5");
    			attr_dev(input10, "type", "checkbox");
    			add_location(input10, file, 185, 6, 5332);
    			attr_dev(label10, "for", "ms4.5");
    			add_location(label10, file, 186, 6, 5415);
    			add_location(section11, file, 184, 5, 5315);
    			attr_dev(input11, "id", "ms5");
    			attr_dev(input11, "type", "checkbox");
    			add_location(input11, file, 189, 6, 5496);
    			attr_dev(label11, "for", "ms5");
    			add_location(label11, file, 190, 6, 5575);
    			add_location(section12, file, 188, 5, 5479);
    			attr_dev(div5, "class", "magicstone padding vbox");
    			add_location(div5, file, 157, 4, 4297);
    			add_location(h22, file, 194, 5, 5688);
    			attr_dev(label12, "for", "skillSelector");
    			add_location(label12, file, 196, 6, 5724);
    			if (/*skill*/ ctx[7] === void 0) add_render_callback(() => /*select2_change_handler*/ ctx[31].call(select2));
    			add_location(select2, file, 197, 6, 5770);
    			attr_dev(section13, "class", "svelte-13yd3sg");
    			add_location(section13, file, 195, 5, 5707);
    			attr_dev(label13, "for", "strengthEffectInput");
    			add_location(label13, file, 204, 6, 5976);
    			attr_dev(input12, "type", "number");
    			attr_dev(input12, "placeholder", "例:5");
    			add_location(input12, file, 205, 6, 6037);
    			attr_dev(section14, "class", "svelte-13yd3sg");
    			add_location(section14, file, 203, 5, 5959);
    			attr_dev(div6, "class", "othereffect svelte-13yd3sg");
    			add_location(div6, file, 193, 4, 5656);
    			attr_dev(div7, "class", "vbox panel svelte-13yd3sg");
    			add_location(div7, file, 156, 3, 4267);
    			attr_dev(div8, "class", "params space-around svelte-13yd3sg");
    			add_location(div8, file, 121, 2, 3005);
    			attr_dev(p, "class", "text-center");
    			add_location(p, file, 210, 2, 6154);
    			attr_dev(div9, "class", "container vbox svelte-13yd3sg");
    			add_location(div9, file, 109, 1, 2674);
    			add_location(main, file, 108, 0, 2642);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div9);
    			append_dev(div9, h1);
    			append_dev(div9, t1);
    			append_dev(div9, div2);
    			append_dev(div2, div0);
    			append_dev(div0, h40);
    			append_dev(div0, t3);
    			append_dev(div0, span0);
    			append_dev(span0, t4);
    			append_dev(div2, t5);
    			append_dev(div2, div1);
    			append_dev(div1, h41);
    			append_dev(div1, t7);
    			append_dev(div1, span1);
    			append_dev(span1, t8);
    			append_dev(div9, t9);
    			append_dev(div9, div8);
    			append_dev(div8, div4);
    			append_dev(div4, h20);
    			append_dev(div4, t11);
    			append_dev(div4, section0);
    			append_dev(section0, label0);
    			append_dev(section0, t13);
    			append_dev(section0, input0);
    			set_input_value(input0, /*weaponDamage*/ ctx[0]);
    			append_dev(div4, t14);
    			append_dev(div4, section1);
    			append_dev(section1, label1);
    			append_dev(section1, t16);
    			append_dev(section1, input1);
    			set_input_value(input1, /*specialDamage*/ ctx[1]);
    			append_dev(div4, t17);
    			append_dev(div4, section2);
    			append_dev(section2, label2);
    			append_dev(section2, t19);
    			append_dev(section2, input2);
    			set_input_value(input2, /*jobGain*/ ctx[3]);
    			append_dev(div4, t20);
    			append_dev(div4, section3);
    			append_dev(section3, label3);
    			append_dev(section3, t22);
    			append_dev(section3, input3);
    			set_input_value(input3, /*equipGain*/ ctx[4]);
    			append_dev(div4, t23);
    			append_dev(div4, section4);
    			append_dev(section4, label4);
    			append_dev(section4, t25);
    			append_dev(section4, input4);
    			set_input_value(input4, /*parkGain*/ ctx[2]);
    			append_dev(div4, t26);
    			append_dev(div4, section5);
    			append_dev(section5, span2);
    			append_dev(section5, t28);
    			append_dev(section5, div3);
    			append_dev(div3, select0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(select0, null);
    			}

    			select_option(select0, /*overStrength*/ ctx[12]);
    			append_dev(div3, t29);
    			append_dev(div3, input5);
    			append_dev(div8, t30);
    			append_dev(div8, div7);
    			append_dev(div7, div5);
    			append_dev(div5, h21);
    			append_dev(div5, t32);
    			append_dev(div5, section6);
    			append_dev(section6, label5);
    			append_dev(section6, t34);
    			append_dev(section6, select1);
    			append_dev(select1, option0);
    			append_dev(select1, option1);
    			append_dev(select1, option2);
    			append_dev(select1, option3);
    			select_option(select1, /*numLegendStone*/ ctx[5]);
    			append_dev(div5, t39);
    			append_dev(div5, section7);
    			append_dev(section7, input6);
    			input6.checked = /*magicStone*/ ctx[6]["level_1"];
    			append_dev(section7, t40);
    			append_dev(section7, label6);
    			append_dev(div5, t42);
    			append_dev(div5, section8);
    			append_dev(section8, input7);
    			input7.checked = /*magicStone*/ ctx[6]["level_2"];
    			append_dev(section8, t43);
    			append_dev(section8, label7);
    			append_dev(div5, t45);
    			append_dev(div5, section9);
    			append_dev(section9, input8);
    			input8.checked = /*magicStone*/ ctx[6]["level_3"];
    			append_dev(section9, t46);
    			append_dev(section9, label8);
    			append_dev(div5, t48);
    			append_dev(div5, section10);
    			append_dev(section10, input9);
    			input9.checked = /*magicStone*/ ctx[6]["level_4"];
    			append_dev(section10, t49);
    			append_dev(section10, label9);
    			append_dev(div5, t51);
    			append_dev(div5, section11);
    			append_dev(section11, input10);
    			input10.checked = /*magicStone*/ ctx[6]["level_4.5"];
    			append_dev(section11, t52);
    			append_dev(section11, label10);
    			append_dev(div5, t54);
    			append_dev(div5, section12);
    			append_dev(section12, input11);
    			input11.checked = /*magicStone*/ ctx[6]["level_5"];
    			append_dev(section12, t55);
    			append_dev(section12, label11);
    			append_dev(div7, t57);
    			append_dev(div7, div6);
    			append_dev(div6, h22);
    			append_dev(div6, t59);
    			append_dev(div6, section13);
    			append_dev(section13, label12);
    			append_dev(section13, t61);
    			append_dev(section13, select2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select2, null);
    			}

    			select_option(select2, /*skill*/ ctx[7]);
    			append_dev(div6, t62);
    			append_dev(div6, section14);
    			append_dev(section14, label13);
    			append_dev(section14, t64);
    			append_dev(section14, input12);
    			set_input_value(input12, /*strLevel*/ ctx[8]);
    			append_dev(div9, t65);
    			append_dev(div9, p);
    			append_dev(div9, t67);
    			mount_component(themebutton, div9, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[18]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[19]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[20]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[21]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[22]),
    					listen_dev(select0, "change", /*select0_change_handler*/ ctx[23]),
    					listen_dev(input5, "click", /*applyOverStrength*/ ctx[17], false, false, false),
    					listen_dev(select1, "change", /*select1_change_handler*/ ctx[24]),
    					listen_dev(input6, "change", /*input6_change_handler*/ ctx[25]),
    					listen_dev(input7, "change", /*input7_change_handler*/ ctx[26]),
    					listen_dev(input8, "change", /*input8_change_handler*/ ctx[27]),
    					listen_dev(input9, "change", /*input9_change_handler*/ ctx[28]),
    					listen_dev(input10, "change", /*input10_change_handler*/ ctx[29]),
    					listen_dev(input11, "change", /*input11_change_handler*/ ctx[30]),
    					listen_dev(select2, "change", /*select2_change_handler*/ ctx[31]),
    					listen_dev(input12, "input", /*input12_input_handler*/ ctx[32]),
    					listen_dev(main, "load", applyTheme(), false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty[0] & /*$normalResult*/ 8192) && t4_value !== (t4_value = /*$normalResult*/ ctx[13].toFixed(2) + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty[0] & /*$criticalResult*/ 16384) && t8_value !== (t8_value = /*$criticalResult*/ ctx[14].toFixed(2) + "")) set_data_dev(t8, t8_value);

    			if (dirty[0] & /*weaponDamage*/ 1 && to_number(input0.value) !== /*weaponDamage*/ ctx[0]) {
    				set_input_value(input0, /*weaponDamage*/ ctx[0]);
    			}

    			if (dirty[0] & /*specialDamage*/ 2 && to_number(input1.value) !== /*specialDamage*/ ctx[1]) {
    				set_input_value(input1, /*specialDamage*/ ctx[1]);
    			}

    			if (dirty[0] & /*jobGain*/ 8 && to_number(input2.value) !== /*jobGain*/ ctx[3]) {
    				set_input_value(input2, /*jobGain*/ ctx[3]);
    			}

    			if (dirty[0] & /*equipGain*/ 16 && to_number(input3.value) !== /*equipGain*/ ctx[4]) {
    				set_input_value(input3, /*equipGain*/ ctx[4]);
    			}

    			if (dirty[0] & /*parkGain*/ 4 && to_number(input4.value) !== /*parkGain*/ ctx[2]) {
    				set_input_value(input4, /*parkGain*/ ctx[2]);
    			}

    			if (dirty[0] & /*over_strength_values*/ 2048) {
    				each_value_1 = /*over_strength_values*/ ctx[11];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(select0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty[0] & /*overStrength*/ 4096) {
    				select_option(select0, /*overStrength*/ ctx[12]);
    			}

    			if (dirty[0] & /*numLegendStone*/ 32) {
    				select_option(select1, /*numLegendStone*/ ctx[5]);
    			}

    			if (dirty[0] & /*magicStone*/ 64) {
    				input6.checked = /*magicStone*/ ctx[6]["level_1"];
    			}

    			if (dirty[0] & /*magicStone*/ 64) {
    				input7.checked = /*magicStone*/ ctx[6]["level_2"];
    			}

    			if (dirty[0] & /*magicStone*/ 64) {
    				input8.checked = /*magicStone*/ ctx[6]["level_3"];
    			}

    			if (dirty[0] & /*magicStone*/ 64) {
    				input9.checked = /*magicStone*/ ctx[6]["level_4"];
    			}

    			if (dirty[0] & /*magicStone*/ 64) {
    				input10.checked = /*magicStone*/ ctx[6]["level_4.5"];
    			}

    			if (dirty[0] & /*magicStone*/ 64) {
    				input11.checked = /*magicStone*/ ctx[6]["level_5"];
    			}

    			if (dirty[0] & /*skill_data*/ 1024) {
    				each_value = Object.keys(/*skill_data*/ ctx[10]);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select2, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty[0] & /*skill, skill_data*/ 1152) {
    				select_option(select2, /*skill*/ ctx[7]);
    			}

    			if (dirty[0] & /*strLevel*/ 256 && to_number(input12.value) !== /*strLevel*/ ctx[8]) {
    				set_input_value(input12, /*strLevel*/ ctx[8]);
    			}

    			const themebutton_changes = {};

    			if (!updating_darkMode && dirty[0] & /*darkMode*/ 512) {
    				updating_darkMode = true;
    				themebutton_changes.darkMode = /*darkMode*/ ctx[9];
    				add_flush_callback(() => updating_darkMode = false);
    			}

    			themebutton.$set(themebutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(themebutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(themebutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			destroy_component(themebutton);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $normalResult;
    	let $criticalResult;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let { skill_data } = $$props;
    	let { over_strength_values } = $$props;
    	let { darkMode } = $$props;
    	let { weaponDamage = "" } = $$props;
    	let { specialDamage = "" } = $$props;
    	let { parkGain = "" } = $$props;
    	let { jobGain = "" } = $$props;
    	let { equipGain = "" } = $$props;
    	let overStrength = "0";
    	let { numLegendStone = "0" } = $$props;

    	let { magicStone = {
    		level_1: false,
    		level_2: false,
    		level_3: false,
    		level_4: false,
    		"level_4.5": false,
    		level_5: false
    	} } = $$props;

    	let { skill = "general_attack" } = $$props;
    	let { strLevel = 0 } = $$props;

    	const normalResult = tweened(0, {
    		delay: 200,
    		duration: 1000,
    		easing: quartOut
    	});

    	validate_store(normalResult, 'normalResult');
    	component_subscribe($$self, normalResult, value => $$invalidate(13, $normalResult = value));

    	const criticalResult = tweened(0, {
    		delay: 200,
    		duration: 1000,
    		easing: quartOut
    	});

    	validate_store(criticalResult, 'criticalResult');
    	component_subscribe($$self, criticalResult, value => $$invalidate(14, $criticalResult = value));

    	let magicStoneScales = {
    		level_1: 1.1,
    		level_2: 1.15,
    		level_3: 1.23,
    		level_4: 1.35,
    		"level_4.5": 1.4,
    		level_5: 1.55
    	};

    	function applyOverStrength() {
    		$$invalidate(2, parkGain = over_strength_values[Number(overStrength)]);
    	}

    	function updateURLParameters() {
    		const url = new URL(window.location);
    		const params = new URLSearchParams();
    		if (weaponDamage) params.set("wd", weaponDamage.toString(36));
    		if (specialDamage) params.set("sd", specialDamage.toString(36));
    		if (parkGain) params.set("pg", parkGain.toString(36));
    		if (jobGain) params.set("jg", jobGain.toString(36));
    		if (equipGain) params.set("eg", equipGain.toString(36));
    		if (numLegendStone !== "0") params.set("ns", numLegendStone.toString(36));
    		if (skill !== "general_attack") params.set("sk", skill);

    		const ms = Object.keys(magicStone).reduce(
    			(acc, cur) => {
    				return acc + (magicStone[cur] ? 1 : 0);
    			},
    			""
    		);

    		if (ms !== "000000") {
    			params.set("ms", ms);
    		}

    		if (strLevel) {
    			params.set("str", strLevel.toString(36));
    		}

    		url.search = params.toString();
    		window.history.replaceState({}, "", url);
    	}

    	const writable_props = [
    		'skill_data',
    		'over_strength_values',
    		'darkMode',
    		'weaponDamage',
    		'specialDamage',
    		'parkGain',
    		'jobGain',
    		'equipGain',
    		'numLegendStone',
    		'magicStone',
    		'skill',
    		'strLevel'
    	];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		weaponDamage = to_number(this.value);
    		$$invalidate(0, weaponDamage);
    	}

    	function input1_input_handler() {
    		specialDamage = to_number(this.value);
    		$$invalidate(1, specialDamage);
    	}

    	function input2_input_handler() {
    		jobGain = to_number(this.value);
    		$$invalidate(3, jobGain);
    	}

    	function input3_input_handler() {
    		equipGain = to_number(this.value);
    		$$invalidate(4, equipGain);
    	}

    	function input4_input_handler() {
    		parkGain = to_number(this.value);
    		$$invalidate(2, parkGain);
    	}

    	function select0_change_handler() {
    		overStrength = select_value(this);
    		$$invalidate(12, overStrength);
    	}

    	function select1_change_handler() {
    		numLegendStone = select_value(this);
    		$$invalidate(5, numLegendStone);
    	}

    	function input6_change_handler() {
    		magicStone["level_1"] = this.checked;
    		$$invalidate(6, magicStone);
    	}

    	function input7_change_handler() {
    		magicStone["level_2"] = this.checked;
    		$$invalidate(6, magicStone);
    	}

    	function input8_change_handler() {
    		magicStone["level_3"] = this.checked;
    		$$invalidate(6, magicStone);
    	}

    	function input9_change_handler() {
    		magicStone["level_4"] = this.checked;
    		$$invalidate(6, magicStone);
    	}

    	function input10_change_handler() {
    		magicStone["level_4.5"] = this.checked;
    		$$invalidate(6, magicStone);
    	}

    	function input11_change_handler() {
    		magicStone["level_5"] = this.checked;
    		$$invalidate(6, magicStone);
    	}

    	function select2_change_handler() {
    		skill = select_value(this);
    		$$invalidate(7, skill);
    		$$invalidate(10, skill_data);
    	}

    	function input12_input_handler() {
    		strLevel = to_number(this.value);
    		$$invalidate(8, strLevel);
    	}

    	function themebutton_darkMode_binding(value) {
    		darkMode = value;
    		$$invalidate(9, darkMode);
    	}

    	$$self.$$set = $$props => {
    		if ('skill_data' in $$props) $$invalidate(10, skill_data = $$props.skill_data);
    		if ('over_strength_values' in $$props) $$invalidate(11, over_strength_values = $$props.over_strength_values);
    		if ('darkMode' in $$props) $$invalidate(9, darkMode = $$props.darkMode);
    		if ('weaponDamage' in $$props) $$invalidate(0, weaponDamage = $$props.weaponDamage);
    		if ('specialDamage' in $$props) $$invalidate(1, specialDamage = $$props.specialDamage);
    		if ('parkGain' in $$props) $$invalidate(2, parkGain = $$props.parkGain);
    		if ('jobGain' in $$props) $$invalidate(3, jobGain = $$props.jobGain);
    		if ('equipGain' in $$props) $$invalidate(4, equipGain = $$props.equipGain);
    		if ('numLegendStone' in $$props) $$invalidate(5, numLegendStone = $$props.numLegendStone);
    		if ('magicStone' in $$props) $$invalidate(6, magicStone = $$props.magicStone);
    		if ('skill' in $$props) $$invalidate(7, skill = $$props.skill);
    		if ('strLevel' in $$props) $$invalidate(8, strLevel = $$props.strLevel);
    	};

    	$$self.$capture_state = () => ({
    		tweened,
    		quartOut,
    		ThemeButton,
    		applyTheme,
    		skill_data,
    		over_strength_values,
    		darkMode,
    		weaponDamage,
    		specialDamage,
    		parkGain,
    		jobGain,
    		equipGain,
    		overStrength,
    		numLegendStone,
    		magicStone,
    		skill,
    		strLevel,
    		normalResult,
    		criticalResult,
    		magicStoneScales,
    		applyOverStrength,
    		updateURLParameters,
    		$normalResult,
    		$criticalResult
    	});

    	$$self.$inject_state = $$props => {
    		if ('skill_data' in $$props) $$invalidate(10, skill_data = $$props.skill_data);
    		if ('over_strength_values' in $$props) $$invalidate(11, over_strength_values = $$props.over_strength_values);
    		if ('darkMode' in $$props) $$invalidate(9, darkMode = $$props.darkMode);
    		if ('weaponDamage' in $$props) $$invalidate(0, weaponDamage = $$props.weaponDamage);
    		if ('specialDamage' in $$props) $$invalidate(1, specialDamage = $$props.specialDamage);
    		if ('parkGain' in $$props) $$invalidate(2, parkGain = $$props.parkGain);
    		if ('jobGain' in $$props) $$invalidate(3, jobGain = $$props.jobGain);
    		if ('equipGain' in $$props) $$invalidate(4, equipGain = $$props.equipGain);
    		if ('overStrength' in $$props) $$invalidate(12, overStrength = $$props.overStrength);
    		if ('numLegendStone' in $$props) $$invalidate(5, numLegendStone = $$props.numLegendStone);
    		if ('magicStone' in $$props) $$invalidate(6, magicStone = $$props.magicStone);
    		if ('skill' in $$props) $$invalidate(7, skill = $$props.skill);
    		if ('strLevel' in $$props) $$invalidate(8, strLevel = $$props.strLevel);
    		if ('magicStoneScales' in $$props) $$invalidate(34, magicStoneScales = $$props.magicStoneScales);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*weaponDamage, skill_data, skill, specialDamage, parkGain, jobGain, equipGain, magicStone, strLevel, numLegendStone*/ 1535) {
    			{
    				let normal = Number(weaponDamage);

    				if (skill_data[skill].availabilSpecial) {
    					normal += specialDamage;
    				}

    				let scale = (100 + parkGain + jobGain + equipGain) / 100;

    				for (const key of Object.keys(magicStone)) {
    					if (magicStone[key]) {
    						scale *= magicStoneScales[key];
    					}
    				}

    				scale *= skill_data[skill].multiply;
    				scale *= strLevel ? 1 + 0.2 * Number(strLevel) : 1;
    				scale *= 1.06 ** Number(numLegendStone);
    				normalResult.set(normal * scale);
    				criticalResult.set(normal * scale * 1.15);
    				updateURLParameters();
    			}
    		}
    	};

    	return [
    		weaponDamage,
    		specialDamage,
    		parkGain,
    		jobGain,
    		equipGain,
    		numLegendStone,
    		magicStone,
    		skill,
    		strLevel,
    		darkMode,
    		skill_data,
    		over_strength_values,
    		overStrength,
    		$normalResult,
    		$criticalResult,
    		normalResult,
    		criticalResult,
    		applyOverStrength,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		select0_change_handler,
    		select1_change_handler,
    		input6_change_handler,
    		input7_change_handler,
    		input8_change_handler,
    		input9_change_handler,
    		input10_change_handler,
    		input11_change_handler,
    		select2_change_handler,
    		input12_input_handler,
    		themebutton_darkMode_binding
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance,
    			create_fragment,
    			safe_not_equal,
    			{
    				skill_data: 10,
    				over_strength_values: 11,
    				darkMode: 9,
    				weaponDamage: 0,
    				specialDamage: 1,
    				parkGain: 2,
    				jobGain: 3,
    				equipGain: 4,
    				numLegendStone: 5,
    				magicStone: 6,
    				skill: 7,
    				strLevel: 8
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*skill_data*/ ctx[10] === undefined && !('skill_data' in props)) {
    			console.warn("<App> was created without expected prop 'skill_data'");
    		}

    		if (/*over_strength_values*/ ctx[11] === undefined && !('over_strength_values' in props)) {
    			console.warn("<App> was created without expected prop 'over_strength_values'");
    		}

    		if (/*darkMode*/ ctx[9] === undefined && !('darkMode' in props)) {
    			console.warn("<App> was created without expected prop 'darkMode'");
    		}
    	}

    	get skill_data() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set skill_data(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get over_strength_values() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set over_strength_values(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get darkMode() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set darkMode(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get weaponDamage() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set weaponDamage(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get specialDamage() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set specialDamage(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get parkGain() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set parkGain(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get jobGain() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set jobGain(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get equipGain() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set equipGain(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get numLegendStone() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set numLegendStone(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get magicStone() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set magicStone(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get skill() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set skill(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get strLevel() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set strLevel(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const skill_data = {
    	general_attack: {
    		name: "スキルなし(通常攻撃)",
    		selectorIndex: 0,
    		multiply: 1.0,
    		availabilSpecial: true,
    	},
    	seiken_passive_boss: {
    		name: "下剋上(BOSS)",
    		selectorIndex: 1,
    		multiply: 1.2,
    		availabilSpecial: true,
    	},
    	seiken_passive_mob: {
    		name: "下剋上(MOB)",
    		selectorIndex: 2,
    		multiply: 0.7,
    		availabilSpecial: true,
    	},
    	volcano: {
    		name: "ボルケーノ",
    		selectorIndex: 3,
    		multiply: 22.0,
    		availabilSpecial: false,
    	},
    	magic_ball_chant: {
    		name: "マジックボール(詠唱あり)",
    		selectorIndex: 4,
    		multiply: 8.0,
    		availabilSpecial: false,
    	},
    	magic_ball_normal: {
    		name: "マジックボール(詠唱なし)",
    		selectorIndex: 5,
    		multiply: 4.0,
    		availabilSpecial: false,
    	},
    	shock_stone: {
    		name: "ショックストーン",
    		selectorIndex: 6,
    		multiply: 7.0,
    		availabilSpecial: false,
    	},
    	chaos_blizzard: {
    		name: "カオスブリザード(全弾Hit)",
    		selectorIndex: 7,
    		multiply: 7.0,
    		availabilSpecial: true,
    	},
    	snow_pillar: {
    		name: "雪柱",
    		selectorIndex: 8,
    		multiply: 4.0,
    		availabilSpecial: false,
    	},
    	over_shoot_shadow_power: {
    		name: "オーバーシュート(スキルあり)",
    		selectorIndex: 9,
    		multiply: 18.75,
    		availabilSpecial: false,
    	},
    	over_shoot_normal: {
    		name: "オーバーシュート(スキルなし)",
    		selectorIndex: 10,
    		multiply: 12.5,
    		availabilSpecial: false,
    	},
    	awakening: {
    		name: "覚醒",
    		selectorIndex: 11,
    		multiply: 2.0,
    		availabilSpecial: true,
    	},
    	blood_slash: {
    		name: "血の斬撃",
    		selectorIndex: 12,
    		multiply: 2.5,
    		availabilSpecial: true,
    	},
    	heiron_metu: {
    		name: "ヘイロン滅",
    		selectorIndex: 13,
    		multiply: 8.0,
    		availabilSpecial: false,
    	},
    };

    const over_strength_values = [
    	9, 18, 27, 36, 45, 54, 63, 72, 81, 102.659, 115.072, 122.172, 126.701, 129.829, 132.114, 133.856, 135.227, 136.334,
    	137.246, 138.011, 138.661, 139.221, 139.707, 140.135, 140.513, 140.849, 141.151, 141.424, 141.67, 141.895, 142.1,
    	142.289, 142.462, 142.623, 142.772, 142.91, 143.039, 143.159, 143.272, 143.377, 143.476, 143.57, 143.658, 143.742,
    	143.821, 143.895, 143.966, 144.034, 144.098, 144.159, 144.217, 144.273, 144.326, 144.377, 144.426, 144.473, 144.518,
    	144.561, 144.602, 144.642, 144.68, 144.717, 144.753, 144.787, 144.82, 144.852, 144.883, 144.913, 144.942, 144.97,
    	144.997, 145.024, 145.049, 145.074,
    ];

    const app = new App({
    	target: document.body,
    	props: {
    		skill_data,
    		over_strength_values,
    		darkMode: localStorage.getItem("dark_mode") == "true",
    		...parseURLParams(),
    	},
    });

    function applyTheme() {
    	const darkMode = localStorage.getItem("dark_mode") == "true";

    	//Apply theme attribute
    	if (darkMode) {
    		document.documentElement.setAttribute("theme", "dark");
    	} else {
    		document.documentElement.removeAttribute("theme");
    	}
    }

    function parseURLParams() {
    	const params = new URLSearchParams(location.search);
    	const parsed = {
    		weaponDamage: params.has("wd") ? parseInt(params.get("wd"), 36) : 0,
    		specialDamage: params.has("sd") ? parseInt(params.get("sd"), 36) : 0,
    		parkGain: params.has("pg") ? parseInt(params.get("pg"), 36) : 0,
    		jobGain: params.has("jg") ? parseInt(params.get("jg"), 36) : 0,
    		equipGain: params.has("eg") ? parseInt(params.get("eg"), 36) : 0,
    		numLegendStone: params.has("ns") ? parseInt(params.get("ns"), 36) : "0",
    		skill: params.has("sk") ? params.get("sk") : "general_attack",
    		strLevel: params.has("str") ? parseInt(params.get("str"), 36) : 0,
    	};

    	if (params.has("ms")) {
    		const flg = parseInt(params.get("ms"), 2);
    		parsed["magicStone"] = {
    			level_1: ((flg >> 5) & 1) == 1,
    			level_2: ((flg >> 4) & 1) == 1,
    			level_3: ((flg >> 3) & 1) == 1,
    			level_4: ((flg >> 2) & 1) == 1,
    			"level_4.5": ((flg >> 1) & 1) == 1,
    			level_5: ((flg >> 0) & 1) == 1,
    		};
    	}

    	return parsed;
    }

    exports.applyTheme = applyTheme;
    exports["default"] = app;
    exports.parseURLParams = parseURLParams;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({});
//# sourceMappingURL=bundle.js.map
