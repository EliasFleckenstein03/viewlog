viewlog = {};
viewlog.activeLine = 0;
viewlog.reload = function(){
	return $.post({
		url: "/data",
		data: {ssid: Cookie.get("ssid")},
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
		error: data => {
			alert(data);
		}
	});
}
viewlog.login = function(){
	return $.post({
		url: "/login",
		data: {password: prompt("Enter the Password to view the Logfile:")},
		success: data => {
			Cookie.set("ssid", data);
		},
		error: data => {
			alert(data);
			location.reload();
		}
	});
}
viewlog.logout = function(){
	return $.post({
		url: "/logout",
		data: {ssid: Cookie.get("ssid")},
		success: data => {
			location.reload();
		},
		error: data => {
			alert(data);
			location.reload();
		}
	});
}
if (Cookie.get("ssid"))
	viewlog.reload();
else
	viewlog.login().then(viewlog.reload);
setInterval(_ => {
	$("#autoreload").checked && viewlog.reload();
}, 1000);
