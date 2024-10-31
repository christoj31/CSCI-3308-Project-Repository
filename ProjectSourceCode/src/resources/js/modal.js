function createBootstrapCard(day) {
    var row = document.createElement('div');
      // Let's add some bootstrap classes to the div to upgrade its appearance
      // This is the equivalent of <div class="col-sm m-1 bg-white rounded px-1 px-md-2"> in HTML
      (row.className = 'col-sm m-1 bg-white rounded px-1 px-md-2');
    // This the equivalent of <div id="monday"> in HTML
    row.id = day.toLowerCase();
    return card;
  }