function ItemCounter(initial, updated, mounted, beforeUnmount){

  initial(function(data){
    return { count: data.props.startCount };
  });

  let $  = ItemCounterElements;
  let $$ = ItemCounterEvents;
  
  function render(data){
    
    return (
      $.span(data, $$)(
        data.state.count
      )
    );
  }

  return [ render, 'shallow' ];
}

var ItemCounterElements = {

  span: element('span', function(data, $$){ 
    return {
      style: { color:'red' }, 
      onClick: function(e){ $$.handleClick(data, e); } 
    };
  })
};

var ItemCounterEvents = {

  handleClick: function(data, $event){
    data.setState(function(state){
      return { count: state['count'] + 1 };
    });
    $event.stopPropagation();
  }
};