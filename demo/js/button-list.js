function ButtonList(props){
  
  return (
    element('div')(
      element('button', { onClick: props.onClickDecrease })('decrease'),
      element('button', { onClick: props.onClickIncrease })('increase')
    )
  );
}