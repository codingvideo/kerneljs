function Border(props){
  let css = {border:"2px solid black", padding: "10px", margin:"10px"};
  let div = element('div', {style: css});

  return (
    div(
      props.children
    )
  );
}