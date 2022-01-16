
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
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
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
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

    /* src\App.svelte generated by Svelte v3.46.2 */

    const { Object: Object_1, console: console_1 } = globals;
    const file = "src\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[30] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[33] = list[i];
    	child_ctx[35] = i;
    	return child_ctx;
    }

    // (107:7) {#each over_strength_values as _, i}
    function create_each_block_1(ctx) {
    	let option;
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(/*i*/ ctx[35]);
    			option.__value = `${/*i*/ ctx[35]}`;
    			option.value = option.__value;
    			add_location(option, file, 107, 8, 2758);
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
    		source: "(107:7) {#each over_strength_values as _, i}",
    		ctx
    	});

    	return block;
    }

    // (157:7) {#each Object.keys(skill_data) as id}
    function create_each_block(ctx) {
    	let option;
    	let t_value = /*skill_data*/ ctx[0][/*id*/ ctx[30]].name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*id*/ ctx[30];
    			option.value = option.__value;
    			add_location(option, file, 157, 8, 4551);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*skill_data*/ 1 && t_value !== (t_value = /*skill_data*/ ctx[0][/*id*/ ctx[30]].name + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*skill_data*/ 1 && option_value_value !== (option_value_value = /*id*/ ctx[30])) {
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
    		source: "(157:7) {#each Object.keys(skill_data) as id}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let div10;
    	let h1;
    	let t1;
    	let div3;
    	let div2;
    	let div0;
    	let h40;
    	let t3;
    	let span0;
    	let t4_value = /*result*/ ctx[12].normal.toFixed(2) + "";
    	let t4;
    	let t5;
    	let div1;
    	let h41;
    	let t7;
    	let span1;
    	let t8_value = /*result*/ ctx[12].critical.toFixed(2) + "";
    	let t8;
    	let t9;
    	let div9;
    	let div5;
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
    	let div4;
    	let select0;
    	let t29;
    	let input5;
    	let t30;
    	let div8;
    	let div6;
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
    	let div7;
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
    	let mounted;
    	let dispose;
    	let each_value_1 = /*over_strength_values*/ ctx[1];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = Object.keys(/*skill_data*/ ctx[0]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			div10 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Thelowダメージ計算";
    			t1 = space();
    			div3 = element("div");
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
    			div9 = element("div");
    			div5 = element("div");
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
    			div4 = element("div");
    			select0 = element("select");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t29 = space();
    			input5 = element("input");
    			t30 = space();
    			div8 = element("div");
    			div6 = element("div");
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
    			div7 = element("div");
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
    			attr_dev(h1, "class", "svelte-2x1evt");
    			add_location(h1, file, 66, 2, 1346);
    			add_location(h40, file, 70, 5, 1471);
    			attr_dev(span0, "class", "text-big");
    			add_location(span0, file, 71, 5, 1489);
    			attr_dev(div0, "class", "vbox");
    			add_location(div0, file, 69, 4, 1446);
    			add_location(h41, file, 74, 5, 1588);
    			attr_dev(span1, "class", "text-big");
    			add_location(span1, file, 75, 5, 1610);
    			attr_dev(div1, "class", "vbox");
    			add_location(div1, file, 73, 4, 1563);
    			attr_dev(div2, "class", "hbox space-around");
    			add_location(div2, file, 68, 3, 1409);
    			attr_dev(div3, "class", "result vbox padding");
    			add_location(div3, file, 67, 2, 1371);
    			add_location(h20, file, 81, 4, 1786);
    			attr_dev(label0, "for", "weaponDamageInput");
    			add_location(label0, file, 83, 5, 1823);
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "placeholder", "例:300");
    			add_location(input0, file, 84, 5, 1877);
    			add_location(section0, file, 82, 4, 1807);
    			attr_dev(label1, "for", "specialDamageInput");
    			add_location(label1, file, 87, 5, 1984);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "placeholder", "例:50");
    			add_location(input1, file, 88, 5, 2034);
    			add_location(section1, file, 86, 4, 1968);
    			attr_dev(label2, "for", "jobGainInput");
    			add_location(label2, file, 91, 5, 2141);
    			attr_dev(input2, "type", "number");
    			attr_dev(input2, "placeholder", "例:10");
    			add_location(input2, file, 92, 5, 2189);
    			add_location(section2, file, 90, 4, 2125);
    			attr_dev(label3, "for", "equipGainInput");
    			add_location(label3, file, 95, 5, 2290);
    			attr_dev(input3, "type", "number");
    			attr_dev(input3, "placeholder", "例:10");
    			add_location(input3, file, 96, 5, 2340);
    			add_location(section3, file, 94, 4, 2274);
    			attr_dev(label4, "for", "parkGainInput");
    			add_location(label4, file, 99, 5, 2443);
    			attr_dev(input4, "type", "number");
    			attr_dev(input4, "placeholder", "例:140");
    			add_location(input4, file, 100, 5, 2491);
    			add_location(section4, file, 98, 4, 2427);
    			add_location(span2, file, 103, 5, 2594);
    			attr_dev(select0, "class", "flex-grow-3");
    			if (/*overStrength*/ ctx[11] === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[19].call(select0));
    			add_location(select0, file, 105, 6, 2649);
    			attr_dev(input5, "class", "flex-grow-1");
    			attr_dev(input5, "type", "button");
    			input5.value = "OS値適用";
    			add_location(input5, file, 110, 6, 2834);
    			attr_dev(div4, "class", "hbox");
    			add_location(div4, file, 104, 5, 2623);
    			add_location(section5, file, 102, 4, 2578);
    			attr_dev(div5, "class", "basicdamage panel padding");
    			add_location(div5, file, 80, 3, 1741);
    			add_location(h21, file, 116, 5, 3039);
    			attr_dev(label5, "for", "legendValueSelector");
    			add_location(label5, file, 118, 6, 3101);
    			option0.__value = "0";
    			option0.value = option0.__value;
    			add_location(option0, file, 120, 7, 3205);
    			option1.__value = "1";
    			option1.value = option1.__value;
    			add_location(option1, file, 121, 7, 3243);
    			option2.__value = "2";
    			option2.value = option2.__value;
    			add_location(option2, file, 122, 7, 3281);
    			option3.__value = "3";
    			option3.value = option3.__value;
    			add_location(option3, file, 123, 7, 3319);
    			if (/*numLegendStone*/ ctx[7] === void 0) add_render_callback(() => /*select1_change_handler*/ ctx[20].call(select1));
    			add_location(select1, file, 119, 6, 3160);
    			attr_dev(section6, "class", "vbox margin-1/2em");
    			add_location(section6, file, 117, 5, 3058);
    			attr_dev(input6, "id", "ms1");
    			attr_dev(input6, "type", "checkbox");
    			add_location(input6, file, 127, 6, 3406);
    			attr_dev(label6, "for", "ms1");
    			add_location(label6, file, 128, 6, 3485);
    			add_location(section7, file, 126, 5, 3389);
    			attr_dev(input7, "id", "ms2");
    			attr_dev(input7, "type", "checkbox");
    			add_location(input7, file, 131, 6, 3562);
    			attr_dev(label7, "for", "ms2");
    			add_location(label7, file, 132, 6, 3641);
    			add_location(section8, file, 130, 5, 3545);
    			attr_dev(input8, "id", "ms3");
    			attr_dev(input8, "type", "checkbox");
    			add_location(input8, file, 135, 6, 3718);
    			attr_dev(label8, "for", "ms3");
    			add_location(label8, file, 136, 6, 3797);
    			add_location(section9, file, 134, 5, 3701);
    			attr_dev(input9, "id", "ms4");
    			attr_dev(input9, "type", "checkbox");
    			add_location(input9, file, 139, 6, 3874);
    			attr_dev(label9, "for", "ms4");
    			add_location(label9, file, 140, 6, 3953);
    			add_location(section10, file, 138, 5, 3857);
    			attr_dev(input10, "id", "ms4.5");
    			attr_dev(input10, "type", "checkbox");
    			add_location(input10, file, 143, 6, 4030);
    			attr_dev(label10, "for", "ms4.5");
    			add_location(label10, file, 144, 6, 4113);
    			add_location(section11, file, 142, 5, 4013);
    			attr_dev(input11, "id", "ms5");
    			attr_dev(input11, "type", "checkbox");
    			add_location(input11, file, 147, 6, 4194);
    			attr_dev(label11, "for", "ms5");
    			add_location(label11, file, 148, 6, 4273);
    			add_location(section12, file, 146, 5, 4177);
    			attr_dev(div6, "class", "magicstone padding vbox");
    			add_location(div6, file, 115, 4, 2995);
    			add_location(h22, file, 152, 5, 4386);
    			attr_dev(label12, "for", "skillSelector");
    			add_location(label12, file, 154, 6, 4422);
    			if (/*skill*/ ctx[9] === void 0) add_render_callback(() => /*select2_change_handler*/ ctx[27].call(select2));
    			add_location(select2, file, 155, 6, 4468);
    			add_location(section13, file, 153, 5, 4405);
    			attr_dev(label13, "for", "strengthEffectInput");
    			add_location(label13, file, 162, 6, 4674);
    			attr_dev(input12, "type", "number");
    			attr_dev(input12, "placeholder", "例:5");
    			add_location(input12, file, 163, 6, 4735);
    			add_location(section14, file, 161, 5, 4657);
    			attr_dev(div7, "class", "othereffect");
    			add_location(div7, file, 151, 4, 4354);
    			attr_dev(div8, "class", "vbox panel");
    			add_location(div8, file, 114, 3, 2965);
    			attr_dev(div9, "class", "hbox space-around");
    			add_location(div9, file, 79, 2, 1705);
    			attr_dev(p, "class", "text-center");
    			add_location(p, file, 168, 2, 4863);
    			attr_dev(div10, "class", "container vbox");
    			add_location(div10, file, 65, 1, 1314);
    			attr_dev(main, "class", "svelte-2x1evt");
    			add_location(main, file, 64, 0, 1305);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div10);
    			append_dev(div10, h1);
    			append_dev(div10, t1);
    			append_dev(div10, div3);
    			append_dev(div3, div2);
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
    			append_dev(div10, t9);
    			append_dev(div10, div9);
    			append_dev(div9, div5);
    			append_dev(div5, h20);
    			append_dev(div5, t11);
    			append_dev(div5, section0);
    			append_dev(section0, label0);
    			append_dev(section0, t13);
    			append_dev(section0, input0);
    			set_input_value(input0, /*weaponDamage*/ ctx[2]);
    			append_dev(div5, t14);
    			append_dev(div5, section1);
    			append_dev(section1, label1);
    			append_dev(section1, t16);
    			append_dev(section1, input1);
    			set_input_value(input1, /*specialDamage*/ ctx[3]);
    			append_dev(div5, t17);
    			append_dev(div5, section2);
    			append_dev(section2, label2);
    			append_dev(section2, t19);
    			append_dev(section2, input2);
    			set_input_value(input2, /*jobGain*/ ctx[5]);
    			append_dev(div5, t20);
    			append_dev(div5, section3);
    			append_dev(section3, label3);
    			append_dev(section3, t22);
    			append_dev(section3, input3);
    			set_input_value(input3, /*equipGain*/ ctx[6]);
    			append_dev(div5, t23);
    			append_dev(div5, section4);
    			append_dev(section4, label4);
    			append_dev(section4, t25);
    			append_dev(section4, input4);
    			set_input_value(input4, /*parkGain*/ ctx[4]);
    			append_dev(div5, t26);
    			append_dev(div5, section5);
    			append_dev(section5, span2);
    			append_dev(section5, t28);
    			append_dev(section5, div4);
    			append_dev(div4, select0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(select0, null);
    			}

    			select_option(select0, /*overStrength*/ ctx[11]);
    			append_dev(div4, t29);
    			append_dev(div4, input5);
    			append_dev(div9, t30);
    			append_dev(div9, div8);
    			append_dev(div8, div6);
    			append_dev(div6, h21);
    			append_dev(div6, t32);
    			append_dev(div6, section6);
    			append_dev(section6, label5);
    			append_dev(section6, t34);
    			append_dev(section6, select1);
    			append_dev(select1, option0);
    			append_dev(select1, option1);
    			append_dev(select1, option2);
    			append_dev(select1, option3);
    			select_option(select1, /*numLegendStone*/ ctx[7]);
    			append_dev(div6, t39);
    			append_dev(div6, section7);
    			append_dev(section7, input6);
    			input6.checked = /*magicStone*/ ctx[8]["level_1"];
    			append_dev(section7, t40);
    			append_dev(section7, label6);
    			append_dev(div6, t42);
    			append_dev(div6, section8);
    			append_dev(section8, input7);
    			input7.checked = /*magicStone*/ ctx[8]["level_2"];
    			append_dev(section8, t43);
    			append_dev(section8, label7);
    			append_dev(div6, t45);
    			append_dev(div6, section9);
    			append_dev(section9, input8);
    			input8.checked = /*magicStone*/ ctx[8]["level_3"];
    			append_dev(section9, t46);
    			append_dev(section9, label8);
    			append_dev(div6, t48);
    			append_dev(div6, section10);
    			append_dev(section10, input9);
    			input9.checked = /*magicStone*/ ctx[8]["level_4"];
    			append_dev(section10, t49);
    			append_dev(section10, label9);
    			append_dev(div6, t51);
    			append_dev(div6, section11);
    			append_dev(section11, input10);
    			input10.checked = /*magicStone*/ ctx[8]["level_4.5"];
    			append_dev(section11, t52);
    			append_dev(section11, label10);
    			append_dev(div6, t54);
    			append_dev(div6, section12);
    			append_dev(section12, input11);
    			input11.checked = /*magicStone*/ ctx[8]["level_5"];
    			append_dev(section12, t55);
    			append_dev(section12, label11);
    			append_dev(div8, t57);
    			append_dev(div8, div7);
    			append_dev(div7, h22);
    			append_dev(div7, t59);
    			append_dev(div7, section13);
    			append_dev(section13, label12);
    			append_dev(section13, t61);
    			append_dev(section13, select2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select2, null);
    			}

    			select_option(select2, /*skill*/ ctx[9]);
    			append_dev(div7, t62);
    			append_dev(div7, section14);
    			append_dev(section14, label13);
    			append_dev(section14, t64);
    			append_dev(section14, input12);
    			set_input_value(input12, /*strengthEffectLevel*/ ctx[10]);
    			append_dev(div10, t65);
    			append_dev(div10, p);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[14]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[15]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[16]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[17]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[18]),
    					listen_dev(select0, "change", /*select0_change_handler*/ ctx[19]),
    					listen_dev(input5, "click", /*applyOverStrength*/ ctx[13], false, false, false),
    					listen_dev(select1, "change", /*select1_change_handler*/ ctx[20]),
    					listen_dev(input6, "change", /*input6_change_handler*/ ctx[21]),
    					listen_dev(input7, "change", /*input7_change_handler*/ ctx[22]),
    					listen_dev(input8, "change", /*input8_change_handler*/ ctx[23]),
    					listen_dev(input9, "change", /*input9_change_handler*/ ctx[24]),
    					listen_dev(input10, "change", /*input10_change_handler*/ ctx[25]),
    					listen_dev(input11, "change", /*input11_change_handler*/ ctx[26]),
    					listen_dev(select2, "change", /*select2_change_handler*/ ctx[27]),
    					listen_dev(input12, "input", /*input12_input_handler*/ ctx[28])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*result*/ 4096 && t4_value !== (t4_value = /*result*/ ctx[12].normal.toFixed(2) + "")) set_data_dev(t4, t4_value);
    			if (dirty[0] & /*result*/ 4096 && t8_value !== (t8_value = /*result*/ ctx[12].critical.toFixed(2) + "")) set_data_dev(t8, t8_value);

    			if (dirty[0] & /*weaponDamage*/ 4 && to_number(input0.value) !== /*weaponDamage*/ ctx[2]) {
    				set_input_value(input0, /*weaponDamage*/ ctx[2]);
    			}

    			if (dirty[0] & /*specialDamage*/ 8 && to_number(input1.value) !== /*specialDamage*/ ctx[3]) {
    				set_input_value(input1, /*specialDamage*/ ctx[3]);
    			}

    			if (dirty[0] & /*jobGain*/ 32 && to_number(input2.value) !== /*jobGain*/ ctx[5]) {
    				set_input_value(input2, /*jobGain*/ ctx[5]);
    			}

    			if (dirty[0] & /*equipGain*/ 64 && to_number(input3.value) !== /*equipGain*/ ctx[6]) {
    				set_input_value(input3, /*equipGain*/ ctx[6]);
    			}

    			if (dirty[0] & /*parkGain*/ 16 && to_number(input4.value) !== /*parkGain*/ ctx[4]) {
    				set_input_value(input4, /*parkGain*/ ctx[4]);
    			}

    			if (dirty[0] & /*over_strength_values*/ 2) {
    				each_value_1 = /*over_strength_values*/ ctx[1];
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

    			if (dirty[0] & /*overStrength*/ 2048) {
    				select_option(select0, /*overStrength*/ ctx[11]);
    			}

    			if (dirty[0] & /*numLegendStone*/ 128) {
    				select_option(select1, /*numLegendStone*/ ctx[7]);
    			}

    			if (dirty[0] & /*magicStone*/ 256) {
    				input6.checked = /*magicStone*/ ctx[8]["level_1"];
    			}

    			if (dirty[0] & /*magicStone*/ 256) {
    				input7.checked = /*magicStone*/ ctx[8]["level_2"];
    			}

    			if (dirty[0] & /*magicStone*/ 256) {
    				input8.checked = /*magicStone*/ ctx[8]["level_3"];
    			}

    			if (dirty[0] & /*magicStone*/ 256) {
    				input9.checked = /*magicStone*/ ctx[8]["level_4"];
    			}

    			if (dirty[0] & /*magicStone*/ 256) {
    				input10.checked = /*magicStone*/ ctx[8]["level_4.5"];
    			}

    			if (dirty[0] & /*magicStone*/ 256) {
    				input11.checked = /*magicStone*/ ctx[8]["level_5"];
    			}

    			if (dirty[0] & /*skill_data*/ 1) {
    				each_value = Object.keys(/*skill_data*/ ctx[0]);
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

    			if (dirty[0] & /*skill, skill_data*/ 513) {
    				select_option(select2, /*skill*/ ctx[9]);
    			}

    			if (dirty[0] & /*strengthEffectLevel*/ 1024 && to_number(input12.value) !== /*strengthEffectLevel*/ ctx[10]) {
    				set_input_value(input12, /*strengthEffectLevel*/ ctx[10]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let { skill_data } = $$props;
    	let { over_strength_values } = $$props;
    	let weaponDamage = "";
    	let specialDamage = "";
    	let parkGain = "";
    	let jobGain = "";
    	let equipGain = "";
    	let overStrength = "0";
    	let numLegendStone = "0";

    	let magicStone = {
    		level_1: false,
    		level_2: false,
    		level_3: false,
    		level_4: false,
    		"level_4.5": false,
    		level_5: false
    	};

    	let skill = "general_attack";
    	let strengthEffectLevel = 0;
    	let result = { normal: 0, critical: 0 };

    	let magicStoneScales = {
    		level_1: 1.1,
    		level_2: 1.15,
    		level_3: 1.23,
    		level_4: 1.35,
    		"level_4.5": 1.4,
    		level_5: 1.55
    	};

    	function applyOverStrength() {
    		console.log(overStrength);
    		$$invalidate(4, parkGain = over_strength_values[Number(overStrength)]);
    	}

    	const writable_props = ['skill_data', 'over_strength_values'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		weaponDamage = to_number(this.value);
    		$$invalidate(2, weaponDamage);
    	}

    	function input1_input_handler() {
    		specialDamage = to_number(this.value);
    		$$invalidate(3, specialDamage);
    	}

    	function input2_input_handler() {
    		jobGain = to_number(this.value);
    		$$invalidate(5, jobGain);
    	}

    	function input3_input_handler() {
    		equipGain = to_number(this.value);
    		$$invalidate(6, equipGain);
    	}

    	function input4_input_handler() {
    		parkGain = to_number(this.value);
    		$$invalidate(4, parkGain);
    	}

    	function select0_change_handler() {
    		overStrength = select_value(this);
    		$$invalidate(11, overStrength);
    	}

    	function select1_change_handler() {
    		numLegendStone = select_value(this);
    		$$invalidate(7, numLegendStone);
    	}

    	function input6_change_handler() {
    		magicStone["level_1"] = this.checked;
    		$$invalidate(8, magicStone);
    	}

    	function input7_change_handler() {
    		magicStone["level_2"] = this.checked;
    		$$invalidate(8, magicStone);
    	}

    	function input8_change_handler() {
    		magicStone["level_3"] = this.checked;
    		$$invalidate(8, magicStone);
    	}

    	function input9_change_handler() {
    		magicStone["level_4"] = this.checked;
    		$$invalidate(8, magicStone);
    	}

    	function input10_change_handler() {
    		magicStone["level_4.5"] = this.checked;
    		$$invalidate(8, magicStone);
    	}

    	function input11_change_handler() {
    		magicStone["level_5"] = this.checked;
    		$$invalidate(8, magicStone);
    	}

    	function select2_change_handler() {
    		skill = select_value(this);
    		$$invalidate(9, skill);
    		$$invalidate(0, skill_data);
    	}

    	function input12_input_handler() {
    		strengthEffectLevel = to_number(this.value);
    		$$invalidate(10, strengthEffectLevel);
    	}

    	$$self.$$set = $$props => {
    		if ('skill_data' in $$props) $$invalidate(0, skill_data = $$props.skill_data);
    		if ('over_strength_values' in $$props) $$invalidate(1, over_strength_values = $$props.over_strength_values);
    	};

    	$$self.$capture_state = () => ({
    		skill_data,
    		over_strength_values,
    		weaponDamage,
    		specialDamage,
    		parkGain,
    		jobGain,
    		equipGain,
    		overStrength,
    		numLegendStone,
    		magicStone,
    		skill,
    		strengthEffectLevel,
    		result,
    		magicStoneScales,
    		applyOverStrength
    	});

    	$$self.$inject_state = $$props => {
    		if ('skill_data' in $$props) $$invalidate(0, skill_data = $$props.skill_data);
    		if ('over_strength_values' in $$props) $$invalidate(1, over_strength_values = $$props.over_strength_values);
    		if ('weaponDamage' in $$props) $$invalidate(2, weaponDamage = $$props.weaponDamage);
    		if ('specialDamage' in $$props) $$invalidate(3, specialDamage = $$props.specialDamage);
    		if ('parkGain' in $$props) $$invalidate(4, parkGain = $$props.parkGain);
    		if ('jobGain' in $$props) $$invalidate(5, jobGain = $$props.jobGain);
    		if ('equipGain' in $$props) $$invalidate(6, equipGain = $$props.equipGain);
    		if ('overStrength' in $$props) $$invalidate(11, overStrength = $$props.overStrength);
    		if ('numLegendStone' in $$props) $$invalidate(7, numLegendStone = $$props.numLegendStone);
    		if ('magicStone' in $$props) $$invalidate(8, magicStone = $$props.magicStone);
    		if ('skill' in $$props) $$invalidate(9, skill = $$props.skill);
    		if ('strengthEffectLevel' in $$props) $$invalidate(10, strengthEffectLevel = $$props.strengthEffectLevel);
    		if ('result' in $$props) $$invalidate(12, result = $$props.result);
    		if ('magicStoneScales' in $$props) $$invalidate(29, magicStoneScales = $$props.magicStoneScales);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*weaponDamage, skill_data, skill, specialDamage, parkGain, jobGain, equipGain, magicStone, strengthEffectLevel, numLegendStone*/ 2045) {
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

    				scale *= strengthEffectLevel
    				? 1 + 0.2 * Number(strengthEffectLevel)
    				: 1;

    				scale *= 1.06 ** Number(numLegendStone);
    				$$invalidate(12, result.normal = normal * scale, result);
    			}
    		}
    	};

    	return [
    		skill_data,
    		over_strength_values,
    		weaponDamage,
    		specialDamage,
    		parkGain,
    		jobGain,
    		equipGain,
    		numLegendStone,
    		magicStone,
    		skill,
    		strengthEffectLevel,
    		overStrength,
    		result,
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
    		input12_input_handler
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { skill_data: 0, over_strength_values: 1 }, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*skill_data*/ ctx[0] === undefined && !('skill_data' in props)) {
    			console_1.warn("<App> was created without expected prop 'skill_data'");
    		}

    		if (/*over_strength_values*/ ctx[1] === undefined && !('over_strength_values' in props)) {
    			console_1.warn("<App> was created without expected prop 'over_strength_values'");
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
    	},
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
