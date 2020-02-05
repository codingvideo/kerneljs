function Counter(initial){

  initial(function(data){
    return { count: data.props.startAt };
  });

  let $ = CounterElements;
  let $$= CounterEvents;
  
  function render(data){
    return (
      $.div_1(
        $.h1("hello"),
        $.div_2(data, $$)(
          data.state['count']
        ),
        $.button_list(data, $$)(
          null
        )
      )
    );
  }

  return render;
}

var CounterElements = {

  div_1: element('div'),
  
  div_2: element('div', function(data, $$){
    return { 
      onClick: function(e){ $$.handleClickIncrease(data, e) } 
    };
  }),

  button_list: element(ButtonList, function(data, $$){
    return {
      count: data.state['count'], 
      onClickIncrease: function(e){ $$.handleClickIncrease(data, e) },
      onClickDecrease: function(e){ $$.handleClickDecrease(data, e) } 
    };
  }),

  h1: element("h1", { className: "heading" })
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