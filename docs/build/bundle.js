
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35730/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
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
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
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
    function empty() {
        return text('');
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
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
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
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
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
        flushing = false;
        seen_callbacks.clear();
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
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
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
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
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
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.35.0' }, detail)));
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

    /* src/components/InputGroup.svelte generated by Svelte v3.35.0 */

    const file$3 = "src/components/InputGroup.svelte";

    function create_fragment$3(ctx) {
    	let div;
    	let p;
    	let strong;
    	let t0;
    	let t1;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			strong = element("strong");
    			t0 = text(/*label*/ ctx[0]);
    			t1 = space();
    			if (default_slot) default_slot.c();
    			add_location(strong, file$3, 4, 5, 70);
    			add_location(p, file$3, 4, 2, 67);
    			attr_dev(div, "class", "box svelte-1hpc0hv");
    			add_location(div, file$3, 3, 0, 47);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			append_dev(p, strong);
    			append_dev(strong, t0);
    			append_dev(div, t1);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*label*/ 1) set_data_dev(t0, /*label*/ ctx[0]);

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 2) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[1], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("InputGroup", slots, ['default']);
    	let { label } = $$props;
    	const writable_props = ["label"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<InputGroup> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("label" in $$props) $$invalidate(0, label = $$props.label);
    		if ("$$scope" in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ label });

    	$$self.$inject_state = $$props => {
    		if ("label" in $$props) $$invalidate(0, label = $$props.label);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [label, $$scope, slots];
    }

    class InputGroup extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { label: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InputGroup",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*label*/ ctx[0] === undefined && !("label" in props)) {
    			console.warn("<InputGroup> was created without expected prop 'label'");
    		}
    	}

    	get label() {
    		throw new Error("<InputGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<InputGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/InputInteger.svelte generated by Svelte v3.35.0 */

    const file$2 = "src/components/InputInteger.svelte";

    function create_fragment$2(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "id", /*id*/ ctx[1]);
    			attr_dev(input, "type", "number");
    			attr_dev(input, "min", "0");
    			attr_dev(input, "step", "1");
    			add_location(input, file$2, 4, 0, 62);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[0]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[2]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*id*/ 2) {
    				attr_dev(input, "id", /*id*/ ctx[1]);
    			}

    			if (dirty & /*value*/ 1 && to_number(input.value) !== /*value*/ ctx[0]) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("InputInteger", slots, []);
    	let { id } = $$props;
    	let { value } = $$props;
    	const writable_props = ["id", "value"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<InputInteger> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		value = to_number(this.value);
    		$$invalidate(0, value);
    	}

    	$$self.$$set = $$props => {
    		if ("id" in $$props) $$invalidate(1, id = $$props.id);
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    	};

    	$$self.$capture_state = () => ({ id, value });

    	$$self.$inject_state = $$props => {
    		if ("id" in $$props) $$invalidate(1, id = $$props.id);
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [value, id, input_input_handler];
    }

    class InputInteger extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { id: 1, value: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InputInteger",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*id*/ ctx[1] === undefined && !("id" in props)) {
    			console.warn("<InputInteger> was created without expected prop 'id'");
    		}

    		if (/*value*/ ctx[0] === undefined && !("value" in props)) {
    			console.warn("<InputInteger> was created without expected prop 'value'");
    		}
    	}

    	get id() {
    		throw new Error("<InputInteger>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<InputInteger>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<InputInteger>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<InputInteger>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/InputItem.svelte generated by Svelte v3.35.0 */

    const file$1 = "src/components/InputItem.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			add_location(div, file$1, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[0], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
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
    	validate_slots("InputItem", slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<InputItem> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class InputItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InputItem",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.35.0 */
    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[14] = list[i];
    	return child_ctx;
    }

    // (28:4) <InputItem>
    function create_default_slot_7(ctx) {
    	let label;
    	let t0;
    	let t1;
    	let inputinteger;
    	let updating_value;
    	let current;

    	function inputinteger_value_binding(value) {
    		/*inputinteger_value_binding*/ ctx[6](value);
    	}

    	let inputinteger_props = { id: canvas_wdt_id };

    	if (/*canvas_wdt*/ ctx[0] !== void 0) {
    		inputinteger_props.value = /*canvas_wdt*/ ctx[0];
    	}

    	inputinteger = new InputInteger({
    			props: inputinteger_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(inputinteger, "value", inputinteger_value_binding));

    	const block = {
    		c: function create() {
    			label = element("label");
    			t0 = text("Larghezza");
    			t1 = space();
    			create_component(inputinteger.$$.fragment);
    			attr_dev(label, "for", canvas_wdt_id);
    			add_location(label, file, 28, 6, 770);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, t0);
    			insert_dev(target, t1, anchor);
    			mount_component(inputinteger, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const inputinteger_changes = {};

    			if (!updating_value && dirty & /*canvas_wdt*/ 1) {
    				updating_value = true;
    				inputinteger_changes.value = /*canvas_wdt*/ ctx[0];
    				add_flush_callback(() => updating_value = false);
    			}

    			inputinteger.$set(inputinteger_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(inputinteger.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(inputinteger.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(t1);
    			destroy_component(inputinteger, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(28:4) <InputItem>",
    		ctx
    	});

    	return block;
    }

    // (33:4) <InputItem>
    function create_default_slot_6(ctx) {
    	let label;
    	let t0;
    	let t1;
    	let inputinteger;
    	let updating_value;
    	let current;

    	function inputinteger_value_binding_1(value) {
    		/*inputinteger_value_binding_1*/ ctx[7](value);
    	}

    	let inputinteger_props = { id: canvas_hgt_id };

    	if (/*canvas_hgt*/ ctx[1] !== void 0) {
    		inputinteger_props.value = /*canvas_hgt*/ ctx[1];
    	}

    	inputinteger = new InputInteger({
    			props: inputinteger_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(inputinteger, "value", inputinteger_value_binding_1));

    	const block = {
    		c: function create() {
    			label = element("label");
    			t0 = text("Altezza");
    			t1 = space();
    			create_component(inputinteger.$$.fragment);
    			attr_dev(label, "for", canvas_hgt_id);
    			add_location(label, file, 33, 6, 934);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, t0);
    			insert_dev(target, t1, anchor);
    			mount_component(inputinteger, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const inputinteger_changes = {};

    			if (!updating_value && dirty & /*canvas_hgt*/ 2) {
    				updating_value = true;
    				inputinteger_changes.value = /*canvas_hgt*/ ctx[1];
    				add_flush_callback(() => updating_value = false);
    			}

    			inputinteger.$set(inputinteger_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(inputinteger.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(inputinteger.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(t1);
    			destroy_component(inputinteger, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(33:4) <InputItem>",
    		ctx
    	});

    	return block;
    }

    // (26:2) <InputGroup label={"Tavola disegno"}>
    function create_default_slot_5(ctx) {
    	let inputitem0;
    	let t;
    	let inputitem1;
    	let current;

    	inputitem0 = new InputItem({
    			props: {
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	inputitem1 = new InputItem({
    			props: {
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(inputitem0.$$.fragment);
    			t = space();
    			create_component(inputitem1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(inputitem0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(inputitem1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const inputitem0_changes = {};

    			if (dirty & /*$$scope, canvas_wdt*/ 131073) {
    				inputitem0_changes.$$scope = { dirty, ctx };
    			}

    			inputitem0.$set(inputitem0_changes);
    			const inputitem1_changes = {};

    			if (dirty & /*$$scope, canvas_hgt*/ 131074) {
    				inputitem1_changes.$$scope = { dirty, ctx };
    			}

    			inputitem1.$set(inputitem1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(inputitem0.$$.fragment, local);
    			transition_in(inputitem1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(inputitem0.$$.fragment, local);
    			transition_out(inputitem1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(inputitem0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(inputitem1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(26:2) <InputGroup label={\\\"Tavola disegno\\\"}>",
    		ctx
    	});

    	return block;
    }

    // (42:4) <InputItem>
    function create_default_slot_4(ctx) {
    	let label;
    	let t0;
    	let t1;
    	let inputinteger;
    	let updating_value;
    	let current;

    	function inputinteger_value_binding_2(value) {
    		/*inputinteger_value_binding_2*/ ctx[8](value);
    	}

    	let inputinteger_props = { id: grid_rows_id };

    	if (/*grid_rows*/ ctx[2] !== void 0) {
    		inputinteger_props.value = /*grid_rows*/ ctx[2];
    	}

    	inputinteger = new InputInteger({
    			props: inputinteger_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(inputinteger, "value", inputinteger_value_binding_2));

    	const block = {
    		c: function create() {
    			label = element("label");
    			t0 = text("Righe");
    			t1 = space();
    			create_component(inputinteger.$$.fragment);
    			attr_dev(label, "for", grid_rows_id);
    			add_location(label, file, 42, 6, 1162);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, t0);
    			insert_dev(target, t1, anchor);
    			mount_component(inputinteger, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const inputinteger_changes = {};

    			if (!updating_value && dirty & /*grid_rows*/ 4) {
    				updating_value = true;
    				inputinteger_changes.value = /*grid_rows*/ ctx[2];
    				add_flush_callback(() => updating_value = false);
    			}

    			inputinteger.$set(inputinteger_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(inputinteger.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(inputinteger.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(t1);
    			destroy_component(inputinteger, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(42:4) <InputItem>",
    		ctx
    	});

    	return block;
    }

    // (47:4) <InputItem>
    function create_default_slot_3(ctx) {
    	let label;
    	let t0;
    	let t1;
    	let inputinteger;
    	let updating_value;
    	let current;

    	function inputinteger_value_binding_3(value) {
    		/*inputinteger_value_binding_3*/ ctx[9](value);
    	}

    	let inputinteger_props = { id: grid_cols_id };

    	if (/*grid_cols*/ ctx[3] !== void 0) {
    		inputinteger_props.value = /*grid_cols*/ ctx[3];
    	}

    	inputinteger = new InputInteger({
    			props: inputinteger_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(inputinteger, "value", inputinteger_value_binding_3));

    	const block = {
    		c: function create() {
    			label = element("label");
    			t0 = text("Colonne");
    			t1 = space();
    			create_component(inputinteger.$$.fragment);
    			attr_dev(label, "for", grid_cols_id);
    			add_location(label, file, 47, 6, 1319);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, t0);
    			insert_dev(target, t1, anchor);
    			mount_component(inputinteger, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const inputinteger_changes = {};

    			if (!updating_value && dirty & /*grid_cols*/ 8) {
    				updating_value = true;
    				inputinteger_changes.value = /*grid_cols*/ ctx[3];
    				add_flush_callback(() => updating_value = false);
    			}

    			inputinteger.$set(inputinteger_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(inputinteger.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(inputinteger.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(t1);
    			destroy_component(inputinteger, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(47:4) <InputItem>",
    		ctx
    	});

    	return block;
    }

    // (40:2) <InputGroup label={"Griglia"}>
    function create_default_slot_2(ctx) {
    	let inputitem0;
    	let t;
    	let inputitem1;
    	let current;

    	inputitem0 = new InputItem({
    			props: {
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	inputitem1 = new InputItem({
    			props: {
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(inputitem0.$$.fragment);
    			t = space();
    			create_component(inputitem1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(inputitem0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(inputitem1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const inputitem0_changes = {};

    			if (dirty & /*$$scope, grid_rows*/ 131076) {
    				inputitem0_changes.$$scope = { dirty, ctx };
    			}

    			inputitem0.$set(inputitem0_changes);
    			const inputitem1_changes = {};

    			if (dirty & /*$$scope, grid_cols*/ 131080) {
    				inputitem1_changes.$$scope = { dirty, ctx };
    			}

    			inputitem1.$set(inputitem1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(inputitem0.$$.fragment, local);
    			transition_in(inputitem1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(inputitem0.$$.fragment, local);
    			transition_out(inputitem1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(inputitem0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(inputitem1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(40:2) <InputGroup label={\\\"Griglia\\\"}>",
    		ctx
    	});

    	return block;
    }

    // (56:6) <InputItem>
    function create_default_slot_1(ctx) {
    	let label;
    	let t0_value = /*tile*/ ctx[14].text + "";
    	let t0;
    	let t1;
    	let inputinteger;
    	let updating_value;
    	let t2;
    	let current;

    	function inputinteger_value_binding_4(value) {
    		/*inputinteger_value_binding_4*/ ctx[10](value);
    	}

    	let inputinteger_props = { id: "" + (/*tile*/ ctx[14].id + "-num") };

    	if (/*line_num*/ ctx[4] !== void 0) {
    		inputinteger_props.value = /*line_num*/ ctx[4];
    	}

    	inputinteger = new InputInteger({
    			props: inputinteger_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(inputinteger, "value", inputinteger_value_binding_4));

    	const block = {
    		c: function create() {
    			label = element("label");
    			t0 = text(t0_value);
    			t1 = space();
    			create_component(inputinteger.$$.fragment);
    			t2 = space();
    			attr_dev(label, "for", "" + (/*tile*/ ctx[14].id + "-num"));
    			add_location(label, file, 56, 8, 1569);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, t0);
    			insert_dev(target, t1, anchor);
    			mount_component(inputinteger, target, anchor);
    			insert_dev(target, t2, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const inputinteger_changes = {};

    			if (!updating_value && dirty & /*line_num*/ 16) {
    				updating_value = true;
    				inputinteger_changes.value = /*line_num*/ ctx[4];
    				add_flush_callback(() => updating_value = false);
    			}

    			inputinteger.$set(inputinteger_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(inputinteger.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(inputinteger.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(t1);
    			destroy_component(inputinteger, detaching);
    			if (detaching) detach_dev(t2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(56:6) <InputItem>",
    		ctx
    	});

    	return block;
    }

    // (55:4) {#each tiles as tile}
    function create_each_block(ctx) {
    	let inputitem;
    	let current;

    	inputitem = new InputItem({
    			props: {
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(inputitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(inputitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const inputitem_changes = {};

    			if (dirty & /*$$scope, line_num*/ 131088) {
    				inputitem_changes.$$scope = { dirty, ctx };
    			}

    			inputitem.$set(inputitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(inputitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(inputitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(inputitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(55:4) {#each tiles as tile}",
    		ctx
    	});

    	return block;
    }

    // (54:2) <InputGroup label={"Densità forme"}>
    function create_default_slot(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*tiles*/ ctx[5];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tiles, line_num*/ 48) {
    				each_value = /*tiles*/ ctx[5];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(54:2) <InputGroup label={\\\"Densità forme\\\"}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div;
    	let inputgroup0;
    	let t0;
    	let inputgroup1;
    	let t1;
    	let inputgroup2;
    	let current;

    	inputgroup0 = new InputGroup({
    			props: {
    				label: "Tavola disegno",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	inputgroup1 = new InputGroup({
    			props: {
    				label: "Griglia",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	inputgroup2 = new InputGroup({
    			props: {
    				label: "Densità forme",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(inputgroup0.$$.fragment);
    			t0 = space();
    			create_component(inputgroup1.$$.fragment);
    			t1 = space();
    			create_component(inputgroup2.$$.fragment);
    			add_location(div, file, 23, 0, 670);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(inputgroup0, div, null);
    			append_dev(div, t0);
    			mount_component(inputgroup1, div, null);
    			append_dev(div, t1);
    			mount_component(inputgroup2, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const inputgroup0_changes = {};

    			if (dirty & /*$$scope, canvas_hgt, canvas_wdt*/ 131075) {
    				inputgroup0_changes.$$scope = { dirty, ctx };
    			}

    			inputgroup0.$set(inputgroup0_changes);
    			const inputgroup1_changes = {};

    			if (dirty & /*$$scope, grid_cols, grid_rows*/ 131084) {
    				inputgroup1_changes.$$scope = { dirty, ctx };
    			}

    			inputgroup1.$set(inputgroup1_changes);
    			const inputgroup2_changes = {};

    			if (dirty & /*$$scope, line_num*/ 131088) {
    				inputgroup2_changes.$$scope = { dirty, ctx };
    			}

    			inputgroup2.$set(inputgroup2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(inputgroup0.$$.fragment, local);
    			transition_in(inputgroup1.$$.fragment, local);
    			transition_in(inputgroup2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(inputgroup0.$$.fragment, local);
    			transition_out(inputgroup1.$$.fragment, local);
    			transition_out(inputgroup2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(inputgroup0);
    			destroy_component(inputgroup1);
    			destroy_component(inputgroup2);
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

    const canvas_wdt_id = "canvas_width";
    const canvas_hgt_id = "canvas_height";
    const grid_rows_id = "grid_rows";
    const grid_cols_id = "grid_columns";
    const cell_ratio_id = "cell_ratio";

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	let canvas_wdt = 500;
    	let canvas_hgt = 700;
    	let grid_rows = 10;
    	let grid_cols = 20;
    	let cell_ratio = 0.75;

    	const tiles = [
    		{ id: "line", text: "Linea" },
    		{ id: "wave", text: "Onda" },
    		{ id: "peak", text: "Picco" }
    	];

    	let line_num = 1;
    	let wave_num = 1;
    	let peak_num = 1;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function inputinteger_value_binding(value) {
    		canvas_wdt = value;
    		$$invalidate(0, canvas_wdt);
    	}

    	function inputinteger_value_binding_1(value) {
    		canvas_hgt = value;
    		$$invalidate(1, canvas_hgt);
    	}

    	function inputinteger_value_binding_2(value) {
    		grid_rows = value;
    		$$invalidate(2, grid_rows);
    	}

    	function inputinteger_value_binding_3(value) {
    		grid_cols = value;
    		$$invalidate(3, grid_cols);
    	}

    	function inputinteger_value_binding_4(value) {
    		line_num = value;
    		$$invalidate(4, line_num);
    	}

    	$$self.$capture_state = () => ({
    		InputGroup,
    		InputInteger,
    		InputItem,
    		canvas_wdt,
    		canvas_wdt_id,
    		canvas_hgt,
    		canvas_hgt_id,
    		grid_rows,
    		grid_rows_id,
    		grid_cols,
    		grid_cols_id,
    		cell_ratio,
    		cell_ratio_id,
    		tiles,
    		line_num,
    		wave_num,
    		peak_num
    	});

    	$$self.$inject_state = $$props => {
    		if ("canvas_wdt" in $$props) $$invalidate(0, canvas_wdt = $$props.canvas_wdt);
    		if ("canvas_hgt" in $$props) $$invalidate(1, canvas_hgt = $$props.canvas_hgt);
    		if ("grid_rows" in $$props) $$invalidate(2, grid_rows = $$props.grid_rows);
    		if ("grid_cols" in $$props) $$invalidate(3, grid_cols = $$props.grid_cols);
    		if ("cell_ratio" in $$props) cell_ratio = $$props.cell_ratio;
    		if ("line_num" in $$props) $$invalidate(4, line_num = $$props.line_num);
    		if ("wave_num" in $$props) wave_num = $$props.wave_num;
    		if ("peak_num" in $$props) peak_num = $$props.peak_num;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		canvas_wdt,
    		canvas_hgt,
    		grid_rows,
    		grid_cols,
    		line_num,
    		tiles,
    		inputinteger_value_binding,
    		inputinteger_value_binding_1,
    		inputinteger_value_binding_2,
    		inputinteger_value_binding_3,
    		inputinteger_value_binding_4
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
        props: {
            name: 'world'
        }
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
