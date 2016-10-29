function submitClick() {
    var result = JSON.parse(proxy.GetProxy("http://owl.dog:8000/click?uwId=" + user.Student.StudentNumber));
    return result;
}

function getFinishTime() {
 	var result = JSON.parse(proxy.GetProxy("http://owl.dog:8000/button?uwId=" + user.Student.StudentNumber));
    return result;
}