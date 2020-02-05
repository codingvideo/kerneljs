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

rootElement(App, { startAt: 0 });
