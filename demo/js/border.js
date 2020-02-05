function Border(props){
  let css = {border:"2px solid black", padding: "10px", margin:"10px"};

  return (
    element('div', {style: css})(
      props.children
    )
  );
}