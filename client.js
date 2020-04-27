viewlog = {};
viewlog.activeLine = 0;
viewlog.error = function(request){
	if (request.readyState == 4)
		alert(request.responseText);
	else
		alert("Connection failed");
	Cookies.remove("ssid")
	location.reload();
}
viewlog.reload = function(){
	return $.post({
		url: "/data",
		data: Cookies.get("ssid"),
		ifModified: true,
		success: data => {
			$("#content").innerHTML = "<var>" + data.replace(/\n/g, "\n</var><var>") + "</var>";
			$("var")[viewlog.activeLine] && $("var")[viewlog.activeLine].scrollIntoView();
			$("var").hover(event => {
				let list = $("var");
				for (let i in list) {
					if (list[i] == this)
						viewlog.activeLine = i;
				}
			});
		},
		error: viewlog.error,
	});
}
viewlog.login = function(){
	return $.post({
		url: "/login",
		data: prompt("Enter the Password to view the Logfile:"),
		success: data => {
			Cookies.set("ssid", data);
		},
		error: viewlog.error,
	});
}
viewlog.logout = function(){
	return $.post({
		url: "/logout",
		data: Cookies.get("ssid"),
		success: data => {
			location.reload();
		},
		error: viewlog.error,
	});
}
if (Cookies.get("ssid"))
	viewlog.reload();
else
	viewlog.login().then(viewlog.reload);
setInterval(_ => {
	$("#autoreload").checked && viewlog.reload();
}, 1000);
