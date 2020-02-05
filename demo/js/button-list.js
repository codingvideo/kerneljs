function ButtonList(props){
  
  let div = element('div');
  let button1= element('button', { onClick: props.onClickDecrease });
  let button2= element('button', { onClick: props.onClickIncrease });

  return (
    div(
      button1('decrease'),
      button2('increase')
    )
  );
}