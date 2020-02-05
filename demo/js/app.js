function App(props){

  let div = element('div');
  let counter = element(Counter, { startAt: props.startAt });
  let list = element(List, { items: [1,2] });

  return (
    div(
      counter(
        null
      )
      ,
      list(
        null
      )
    )
  );
}

rootElement(App, { startAt: 0 });
