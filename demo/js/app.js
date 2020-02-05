function App(props){

  let border = element(Border);
  let div = element('div');
  let counter = element(Counter, { startAt: props.startAt });
  let list = element(List, { items: [1,2] });

  return (
    div(
      border(
        counter(
          null
        )
      ),
      border(
        list(
          null
        )
      )
    )
  );
}

rootElement(App, { startAt: 0 });
