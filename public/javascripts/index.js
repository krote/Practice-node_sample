$(function(){
	$(document).ready(function(){
		var socket = io.connect('http://'+location.host + '/');

		$('#saveButton').click(function(){
			socket.emit('save', {
				userId:$('#userId').val(),
				age:$('#age').val(),
				site:{
					name:$('#site_name').val(),
					url:$('#site_url').val()
				}
			});
		});
		$('#searchButton').click(function(){
			socket.emit('search', {
				userId:$('#userId').val()
			});
		});
		socket.on('searchResult', function(dataSource){
			var obj = {};
			obj.width = 1000;
			obj.height = 400;
			obj.colModel = [
			{title:"name", width:100, dataType:'string', dataIndx:"name"},
			{title:"email", width:100, dataType:'string', dataIndx:"email"},
			{title:"password", width:200, dataType:'string', dataIndx:"password"},
			{title:"_id", width:300, dataType:'string', dataIndx:"_id"}
			];
			obj.dataModel = {dataType:"JSON", data:dataSource};
			$('#dataTable').pqGrid(obj);
		});
	});

});