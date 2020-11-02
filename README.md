# kerneljs

Front-end JavaScript library for using React in a different syntax without JSX. (This is just an experimental project.)

## Simple Component

```js
function App(props){

  return (
    element('div')(
      element(Border)(
        element(Counter, { startAt: props.startAt })(
          null
        )
      ),
      element(Border)(
        element(List, { items: [1,2] })(
          null
        )
      )
    )
  );
}

rootElement(App, { startAt: 0 }); // INSERT COMPONENT INTO HTML
```

`element` and `rootElement` are the two main functions of the library. `element` is similar to the `React.createElement` function, but using a *partial application* approach.

The `element` function takes either a string of an HTML element name such as `div`, or a component such as `Border` in the example code above, then it will return a function.

This returned function will allow you to include the child elements as arguments.

Just like a functional React component, you just need to return a tree of elements from the function to make it a valid component.

## Attributes

If you need to set up attributes for a component, you can provide an object of attributes as the second argument of the `element` function. (as illustrated below)


```js
function ExampleComponent(){
  return (
    element('div')(
      element("h1", { class: "heading" })( // THIS
        "hello"
      )
    )
  )l
}
```

## State and Lifecycle Hooks

Let's use a lifecycle hook to set up the `initial` value of the component's state.

```js
function ExampleComponent(initial){ // INJECT HOOK AS PARAMETER

  // SET UP STATE HERE
  initial(function(data){
    return { count: data.props.startAt };
  });
  
  function render(data){
    return (
      element('div')(
        element("h1")(
          data.state.count // USE STATE HERE
        )
      )
    );
  }

  return render;
}
```

In this example, we're using the `initial` hook. This hook will be made available through dependency injection, so all you need to do is just to specify it in the parameters. Others hooks include `mounted`, `unmounted`, `updated`.

The `initial` hook in the above example is expected to return the initial value of the state. All the other `hooks` won't require any return value, but they'll have access to the `data` object through the parameter just like `initial`.

The `data` object for the hooks will contains two properties, the `props` and the `state`. (Although in the `initial` hook's case, the `state` wouldn't be available)

Whenever you're using hooks in a component, you have to return a `render` function instead of a tree of elements. This `render` function will recieve the same data object that the lifecycle hooks receive.

## More Info

Since KernelJS is built on top of React, these are still React components behind the scene, they just look different syntactically.

Please checkout the code in the demo folder for more code samples.
