function params(data) {
	var arr = [];
	for(var i in data) {
		arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(data[i]))
	}
	return arr.join('&');
}

function ajax(obj) {
	var xhr = (function() {
		return window.XMLHttpRequest ? new window.XMLHttpRequest() :
			new window.ActiveXObject('XMLHTTP');
	})();

	obj.url = obj.url + '?rand=' + Math.random();


	obj.data = (function(data) {
		var arr = [];
		for(var i in data) {
			arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(data[i]))
		}
		return arr.join('&');
	})(obj.data)
	
	//	obj.method = obj.method.toUpperCase();
	
	if(obj.method == 'get') {
		obj.url += obj.url.indexOf('?') == -1 ?
			'?' + obj.data : '&' + obj.data;
	}

	if(obj.async === true) {
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4) {
				callback();
			}
		};
	}
	xhr.open(obj.method, obj.url, obj.async);
	if(obj.method == 'post') {
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.send(obj.data);
	} else {
		xhr.send(null);
	}
	if(obj.async === false) {
		callback();
	}

	function callback() {
		if(xhr.status >= 200 && xhr.status < 300) {
			obj.success(xhr.responseText);
		} else {
			alert('获取数据错误！错误代号：' + xhr.status + '，错误信息：' + xhr.statusText);
		}
	}
}