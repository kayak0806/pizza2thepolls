var url = "https://spreadsheets.google.com/feeds/list/186bexc0iF8ROHm0-jMTIDQYwC0JGVa0kMzbCnNoD0iA/od6/public/basic?alt=json";

var now = new Date;

tinyGET(url, null, function(data) {
  var now = new Date()
  var raised = '$' + data.feed.entry[1].content['$t'].split(": ")[1].split(",")[0];
  var pizzas = data.feed.entry[1].content['$t'].split(': ')[2].split(",")[0];
  var remaining = '$' + data.feed.entry[1].content['$t'].split(': ')[3].split(",")[0];
  document.getElementById('stat-raised').innerHTML = raised;
  document.getElementById('stat-pizzas').innerHTML = pizzas;
  document.getElementById('stat-remaining').innerHTML = remaining;
  document.getElementById('stat-info').innerHTML = 'As of ' + now.toLocaleString();
});

var handler = StripeCheckout.configure({
  key: 'pk_test_sADB2cqphkgwJNsAPuzt1FG6',
  image: 'https://polls.pizza/images/logo.png',
  locale: 'auto',
  token: function(token) {
    var location = document.getElementById('location').value
    tinyPOST(
      'https://docs.google.com/forms/d/e/1FAIpQLScXFW1leCjt2I-lunIb5QZXYdfUHrLMWJKaV2Dbng_nH4VqiQ/formResponse',
      {
        'entry.523057126': token.email,
        'entry.1905224080': token.card.address_zip,
        'entry.1615134295': token.id,
        'entry.768194781': (window.amount).toString(),
        'entry.2124361339': location
      }
    )
  }
});

var getAmount = function() {
  var radios = document.getElementsByName('amount');
  var custom = document.getElementById('custom-amount');
  var amount;

  if (custom.value) {
    amount = custom.value * 100;
  } else {
    for (var i = 0; i < radios.length; i++) {
      if (radios[i].checked) {
        amount = radios[i].value * 100;
      }
    }
  }

  return amount;
};

document.getElementById('donate-form').addEventListener('change', function(e) {
  var amount = getAmount();
  if (amount) {
    document.getElementById('checkout').classList.remove('is-disabled');
  } else {
    document.getElementById('checkout').classList.add('is-disabled');
  }
});

document.getElementById('checkout').addEventListener('click', function(e) {
  var amount = getAmount(),
      pizzas = Math.ceil(amount/100/13.5)

  if (amount) {
    // Open Checkout with further options:
    handler.open({
      name: 'Pizza for Protesters',
      description: 'About '+pizzas+' Pizza' + (pizzas > 1 ? 's' : ''),
      zipCode: true,
      amount: amount,
      image: 'https://polls.pizza/images/logo.png'
    });
    window.amount = amount / 100
    e.preventDefault();
  }
});

// Close Checkout on page navigation:
window.addEventListener('popstate', function() {
  handler.close();
});
