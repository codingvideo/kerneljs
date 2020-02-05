function List(initial){

  initial(function(data){
    return { items: data.props.items };
  });

  let render = function(data){
    
    let __= ListElements;
    let $$= ListEvents;
    let items = data.state.items;
    
    return (
      element('ul')(
        items.map(function(item){return(
          __.li(data, item, $$)(
            element(ItemCounter, { startCount: item })(
              null
            )
          )
        )})
      )
    );
  };

  return render;
};

let ListElements = {

  li: element('li', function(data, item, $$){
    return { 
      'class'  : 'item _'+item, 
      'key'    : item, 
      'data-id': item, 
      'onClick': delegate($$.handleItemClick)(data)
    };
  })
};

let ListEvents = {

  handleItemClick: function(data, $event){
    let toDelete = parseInt($event.target.getAttribute('data-id'));
    data.setState(function(state){
      let newData = state.items.filter(function(item){ 
        return item !== toDelete 
      });
      return { items: newData };
    });
  }
};