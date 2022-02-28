let $table = $('#leaderboard');


function responseHandler(res) {
  return res;
}

function detailFormatter(index, row) {
  let html = [];
  html.push('<p><b>ID:</b> ' + row.id + '</p>');
  html.push('<p><b>Role:</b> ' + row.role + '</p>');
  html.push('<p><b>Online:</b> ' + (row.is_active ? 'Yes' : 'No') + '</p>');
  html.push('<p><b>Moves:</b> ' + row.moves + '</p>');
  return html.join('');
}

function initTable() {
  $table.bootstrapTable('destroy').bootstrapTable({
    height: 500,
    columns: [{
      field: 'username',
      title: 'Username',
      sortable: true,
    }, {
      field: 'score',
      title: 'High Score',
      sortable: true,
    }, {
      field: 'member_since',
      title: 'Player since',
      sortable: true
    }]
  })
}

$(function() {
  initTable()
})