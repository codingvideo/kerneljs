function Counter(initial){

  initial(function(data){
    return { count: data.props.startAt };
  });

  let __= CounterElements;
  let $$= CounterEvents;
  
  function render(data){
    return (
      element('div')(
        element("h1", { class: "heading" })(
          "hello"
        ),
        __.count(data, $$)(
          data.state['count']
        ),
        __.buttonList(data, $$)(
          null
        )
      )
    );
  }

  return render;
}

var CounterElements = {
  
  count: element('div', function(data, $$){
    return { 
      onClick: function(e){ $$.handleClickIncrease(data, e) } 
    };
  }),

  buttonList: element(ButtonList, function(data, $$){
    return {
      count: data.state['count'], 
      onClickIncrease: function(e){ $$.handleClickIncrease(data, e) },
      onClickDecrease: function(e){ $$.handleClickDecrease(data, e) } 
    };
  })
};

var CounterEvents = {

  handleClickIncrease: function (data, $event){
    data.setState({ count: data.state['count'] + 1 });
  },

  handleClickDecrease: function(data, $event){
    data.setState(function(state){
      return { count: state['count'] - 1 };
    });
  }
};