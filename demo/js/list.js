function List(initial){

  initial(function(data){
    return { items: data.props.items };
  });

  let render = function(data){
    
    let $ = ListElements;
    let $$= ListEvents;
    let items = data.state.items;
    
    return (
      $.ul(
        items.map(function(item){return(
          $.li(data, item, $$)(
            $.item_counter(item)(
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

  ul: element('ul'),

  li: element('li', function(data, item, $$){
    return { 
      'class'  : 'item _'+item, 
      'key'    : item, 
      'data-id': item, 
      'onClick': function(e){ $$.handleItemClick(data, e) }
    };
  }),

  item_counter: element(ItemCounter, function(item){ 
    return { startCount: item };
  })
};

let ListEvents = {

  handleItemClick: function(data, $event){
    let toDelete = parseInt($event.target.getAttribute('data-id'));
    data.setState(function(state){
      let newData = state.items.filter(function(item){ 
        return item !== toDelete 
      });
      console.log(newData);
      return { items: newData };
    });
  }
}