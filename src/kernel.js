var kernel = {};

var element = function(type, attr){

  kernel.validateAttributeType(attr, 'style', 'object');

  if(typeof attr === 'function'){ 
    return function(){ // params
      let _attr = attr.apply(null, arguments); 
      return function(){ // arguments
        if(arguments.length === 0){
          throw('An element function needs at least null as argument.');
        }
        let args = [type, _attr].concat(arguments);
        return kernel.createElement.apply(null, args); 
      }
    }
  }
  else{
    return function(){ // arguments
      if(arguments.length === 0){
        throw('An element function needs at least null as argument.');
      }
      let args = [type, attr].concat(arguments);
      return kernel.createElement.apply(null, args); 
    };
  }
};

var nullUnless = function(cond, callback){
  if(cond){
    return callback();
  }
  else{
    return null;
  }
};

var rootElement = function(mainComponent, props){
  ReactDOM.render(
    kernel.createElement(mainComponent, props), 
    document.getElementById('root')
  )
};

kernel.validateAttributeType = function(attr, key, type){
  if(attr !== undefined){
    if(attr['style'] !== undefined){
      if(typeof attr[key] !== type){
        throw('The '+key+' attribute has to be type '+type+'.');
      }
    }
  }
};

kernel.createElement = function(){ 
  if(kernel._isClassComponent(arguments[0])){
    arguments[0] = kernel.type_to_component(arguments[0]);
    return React.createElement.apply(null, arguments);
  } 
  else{
    return React.createElement.apply(null, arguments); 
  }
};

kernel.cache = {};

kernel.render = function(element, container){
  let reactElement = this.recur_arr_to_element(element);
  ReactDOM.render(reactElement, container);
};

kernel.recur_arr_to_element = function(arr){
  let that = this;
  let spec = this.arr_to_spec(arr);
  
  if(this._hasChild(spec)){
    let childElements = that._mapChild(spec, function(item){
      return that.recur_arr_to_element(item);
    });
    return this.spec_to_element(arr, spec, childElements);
  }
  else{
    return this.spec_to_element(arr, spec);
  }
};

kernel.spec_to_element = function(arr, spec, reactChildren){
  let children;
  if(reactChildren === undefined){
    children = spec.children;
  }
  else{
    children = reactChildren;
  }

  // parse callback props
  for(let k in spec.props){
    if(spec.props.hasOwnProperty(k)){
      let v = spec.props[k]
      if(kernel._isArr(v) && typeof v[0]==='function'){
        console.log('is arr:',k, v);
        let f = v[0];
        let param = v[1];
        spec.props[k] = function(e){ f(param,e) };
      }
    }
  }
  
  return React.createElement(
    spec.component,
    spec.props,
    children
  );
};

kernel.arr_to_spec = function(arr){
  let that = this;
  let elementType = arr[0];
  let props       = arr[1];
  let children    = arr[2];

  if(this._isObj(props) === false){ // second param is children
    children = props;
    props = {};
  }

  let isComponent = typeof elementType !== 'string';
  let isClass = isComponent ? that._isClassComponent(elementType) : false;
  
  return { // obj: spec
    component: isComponent ? that.type_to_component(elementType, isClass) : elementType,
    props:     props,
    children:  children
  };
};

kernel.type_to_component = function(elementType){
  let theFunction = elementType;
  let comp;
  let cache = kernel.cache[theFunction.name];
  if(cache===undefined){
    comp = kernel.createComponent(theFunction);
    kernel.cache[theFunction.name] = comp;
  }
  else{
    comp = cache;
  }
  return comp
};

var component = kernel.createComponent = function(theFunction){
  let lifecycle = kernel._getEmptyLifecycle();
  let __lifecycle__ = kernel._getLifecycleSetters(lifecycle);
  
  let lifecycleSettersNeeded = kernel._getNeededSetters(theFunction, __lifecycle__);  
  let renderPackage = theFunction.apply(null, lifecycleSettersNeeded);
  let renderMethods = kernel.getRenderMethods(renderPackage);
  
  lifecycle['render'] = renderMethods['render'];
  lifecycle['shouldRerender'] = renderMethods['shouldRerender'];

  let getInitialState = function(){
    let name = 'initial';
    if(lifecycle[name] !== null){
      if(typeof lifecycle[name] === 'object'){
        lifecycle[name] = lifecycle[name][name];
      }
      return lifecycle[name](this);
    }else{
      throw('require initial callback for stateful component');
    }
  };

  let componentDidMount = function(){   
    let name = 'mounted';
    if(lifecycle[name] !== null){
      if(typeof lifecycle[name] === 'object'){
        lifecycle[name] = lifecycle[name][name];
      }
      return lifecycle[name](this);
    }
  };

  let componentDidUpdate = function(){   
    let name = 'updated';
    if(lifecycle[name] !== null){
      if(typeof lifecycle[name] === 'object'){
        lifecycle[name] = lifecycle[name][name];
      }
      return lifecycle[name](this);
    }
  };

  let componentWillUnmount = function(){  
    let name = 'beforeUnmount';
    if(lifecycle[name] !== null){
      if(typeof lifecycle[name] === 'object'){
        lifecycle[name] = lifecycle[name][name];
      }
      return lifecycle[name](this);
    }
  };

  let shouldComponentUpdate = function(nextProps, nextState){
    if(lifecycle['shouldRerender'] === null){ 
      return true; 
    }
    else if(lifecycle['shouldRerender'] === 'shallow'){
      return nextProps !== this.props || nextState !== this.state;
    }
    else{
      let nextData = { props: nextProps, state: nextState };
      return lifecycle['shouldRerender'](this, nextData);
    }
  };

  let render = function(){
    return lifecycle['render'](this);
  };

  return createReactClass({
    getInitialState: getInitialState,
    componentDidMount: componentDidMount,
    componentDidUpdate: componentDidUpdate,
    componentWillUnmount: componentWillUnmount,
    shouldComponentUpdate: shouldComponentUpdate,
    render: render
  });
};

kernel.getRenderMethods = function(renderPackage){
  let that = this;

  let out = {
    render: null,
    shouldRerender: null,
  }

  that._checkReturnError(renderPackage);

  if(typeof renderPackage === 'function'){
    out['render'] = renderPackage;
  }
  else {
    if(renderPackage.length === 2){
      out['render'] = renderPackage[0];
      out['shouldRerender'] = renderPackage[1];
    }
  }
  return out;
}

// -------
// HELPERS
// -------

kernel._getEmptyLifecycle = function(){
  return { 
    initial: null,
    render: null,
    mounted: null,
    updated: null,
    beforeUnmount: null,
    shouldRerender: null 
  };
};

kernel._getLifecycleSetters = function(lifecycleFunctions){
  
  let __initial__ = function(f){ lifecycleFunctions['initial'] = f; };
  let __mounted__ = function(f){ lifecycleFunctions['mounted'] = f; };
  let __updated__ = function(f){ lifecycleFunctions['updated'] = f; };
  let __beforeUnmount__ = function(f){ lifecycleFunctions['beforeUnmount'] = f; };

  return {
    initial: __initial__,
    mounted: __mounted__,
    updated: __updated__,
    beforeUnmount: __beforeUnmount__,
  };
};

kernel._expandShorthandConfig = function(config){
  if(config.$ !== 'undefined'){
    config.className = config.$
  }
  return config;
}

kernel._args = function(f){
  let items = f.toString().split(/\(/)[1].split(/\)/)[0].split(',');
  let out = [];
  for(let i=0; i<items.length; i++){
    out.push(items[i].trim());
  }
  return out;
};

kernel._isClassComponent = function(comp){
  if(typeof comp === 'function'){
    let args = this._args(comp);
    return args.indexOf('initial') > -1;
  }
  else{
    return false;
  }
};

kernel._getNeededSetters = function(f, lifecycleSetters){
  let args = this._args(f);
  let out = [];
  for(let i=0; i<args.length; i++){
    let name = args[i];
    let setter = lifecycleSetters[name];
    out.push(setter);
  }
  return out;
};

kernel._checkReturnError = function(renderPackage){
  if(renderPackage===undefined){
    throw('Stateful component needs to return a render function.');
  }
};

kernel._isObj= function(obj){
  if(this._isArr(obj) === false){ // not arr
    if(typeof obj === 'object'){ // but obj
      return true;
    }
  }
  return false;
};

kernel._isArr = function(obj){
  return Object.prototype.toString.call(obj) === '[object Array]';
};

kernel._hasChild = function(spec){
  return this._isArr(spec.children);
};

kernel._getNextStateGetter = function(){
  return { 
    get: function(key){ return nextState[key] } 
  };
}

kernel._mapChild = function(spec, cb){
  let out = [];
  for(let i=0; i < spec.children.length; i++){
    out.push( cb(spec.children[i]) );
  }
  return out;
};